param(
    [switch]$DryRun,
    [switch]$Help
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Usage {
    Write-Host "Usage: ./_scripts/update-mydocs-modified.ps1 [-DryRun]"
    Write-Host ""
    Write-Host "Updates the front matter 'modified' value of Markdown files in _mydocs"
    Write-Host "for files whose front matter contains layout: page, a date field,"
    Write-Host "and does not enable no_date/nodate, using the last commit date"
    Write-Host "recorded by Git for each file."
}

if ($Help) {
    Write-Usage
    exit 0
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git is required."
}

$repoRoot = & git rev-parse --show-toplevel 2>$null
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($repoRoot)) {
    Write-Error "This script must run inside a Git working tree."
}

$repoRoot = $repoRoot.Trim()
Set-Location -LiteralPath $repoRoot

$docsRoot = Join-Path $repoRoot "_mydocs"
if (-not (Test-Path -LiteralPath $docsRoot -PathType Container)) {
    Write-Error "_mydocs was not found in $repoRoot."
}

function Normalize-Content {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Content
    )

    $normalized = [regex]::Replace(
        $Content,
        "(?s)\A---\r?\n(?<front>.*?)(\r?\n)---",
        {
            param($match)

            $frontMatter = $match.Groups["front"].Value
            $newline = if ($match.Value.Contains("`r`n")) { "`r`n" } else { "`n" }
            $frontLines = $frontMatter -split "\r?\n"
            $filteredLines = New-Object System.Collections.Generic.List[string]

            foreach ($line in $frontLines) {
                if ($line -match "^modified:\s*") {
                    continue
                }

                [void]$filteredLines.Add($line)
            }

            return "---$newline$($filteredLines -join $newline)$newline---"
        },
        1
    )

    return $normalized
}

function Get-NormalizedBlob {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Revision,
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    $content = & git show "$Revision`:$Path" 2>$null
    if ($LASTEXITCODE -ne 0) {
        return ""
    }

    return Normalize-Content (($content -join "`n"))
}

function Get-MeaningfulCommitDate {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    $currentPath = $Path
    $currentCommit = $null
    $logLines = & git log --follow --format="__COMMIT__ %H %cs" --name-status -- $Path 2>$null

    if ($LASTEXITCODE -ne 0) {
        return ""
    }

    foreach ($line in $logLines) {
        if ([string]::IsNullOrWhiteSpace($line)) {
            continue
        }

        if ($line.StartsWith("__COMMIT__ ")) {
            $parts = $line.Substring(11).Split(" ", 2)
            $currentCommit = @{
                Hash = $parts[0]
                Date = $parts[1]
            }
            continue
        }

        if ($null -eq $currentCommit) {
            continue
        }

        $parts = $line -split "`t"
        $status = $parts[0]
        $pathAtCommit = $currentPath
        $parentPath = $currentPath

        if (($status.StartsWith("R") -or $status.StartsWith("C")) -and $parts.Length -ge 3) {
            $pathAtCommit = $parts[2]
            $parentPath = $parts[1]
            $currentPath = $parts[1]
        }
        elseif ($parts.Length -ge 2) {
            $pathAtCommit = $parts[1]
            $parentPath = $parts[1]
        }

        $currentContent = Get-NormalizedBlob -Revision $currentCommit.Hash -Path $pathAtCommit
        $parentHash = (& git rev-parse "$($currentCommit.Hash)^" 2>$null)

        if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($parentHash)) {
            if (-not [string]::IsNullOrEmpty($currentContent)) {
                return $currentCommit.Date
            }

            continue
        }

        $parentContent = Get-NormalizedBlob -Revision $parentHash.Trim() -Path $parentPath
        if ($currentContent -cne $parentContent) {
            return $currentCommit.Date
        }
    }

    return ""
}

$updatedCount = 0
$unchangedCount = 0
$filteredCount = 0
$skippedCount = 0
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$utf8WithBom = New-Object System.Text.UTF8Encoding $true

Get-ChildItem -LiteralPath $docsRoot -Recurse -File -Filter "*.md" | Sort-Object FullName | ForEach-Object {
    $filePath = $_.FullName
    $relativePath = $filePath.Substring($repoRoot.Length).TrimStart("\", "/").Replace("\", "/")
    $content = Get-Content -LiteralPath $filePath -Raw
    $newline = if ($content.Contains("`r`n")) { "`r`n" } else { "`n" }

    $match = [regex]::Match(
        $content,
        "\A---\r?\n(?<front>.*?)(\r?\n)---(?<rest>[\s\S]*)\z",
        [System.Text.RegularExpressions.RegexOptions]::Singleline
    )

    if (-not $match.Success) {
        Write-Host "skip    $relativePath (missing front matter)"
        $script:skippedCount++
        return
    }

    $frontMatter = $match.Groups["front"].Value
    $layoutMatch = [regex]::Match($frontMatter, "(?m)^layout:\s*(?<layout>[^\r\n]+)\s*$")
    $layoutValue = if ($layoutMatch.Success) { $layoutMatch.Groups["layout"].Value.Trim() } else { "" }
    $dateMatch = [regex]::Match($frontMatter, "(?m)^date:\s*(?<date>[^\r\n]+)\s*$")
    $hideDateMatch = [regex]::Match($frontMatter, "(?mi)^(no_date|nodate):\s*(?<value>[^\r\n]*)\s*$")

    if ($layoutValue -ne "page") {
        $displayLayout = if ([string]::IsNullOrWhiteSpace($layoutValue)) { "missing" } else { $layoutValue }
        Write-Host "skip    $relativePath (layout is $displayLayout)"
        $script:filteredCount++
        return
    }

    if ($hideDateMatch.Success) {
        $hideDateValue = $hideDateMatch.Groups["value"].Value.Trim().ToLowerInvariant()

        if ([string]::IsNullOrWhiteSpace($hideDateValue) -or $hideDateValue -in @("true", "yes", "on", "1")) {
            Write-Host "skip    $relativePath (no_date/nodate enabled)"
            $script:filteredCount++
            return
        }
    }

    if (-not $dateMatch.Success -or [string]::IsNullOrWhiteSpace($dateMatch.Groups["date"].Value)) {
        Write-Host "skip    $relativePath (date is missing)"
        $script:filteredCount++
        return
    }

    $commitDate = Get-MeaningfulCommitDate -Path $relativePath

    if ([string]::IsNullOrWhiteSpace($commitDate)) {
        Write-Host "skip    $relativePath (no commit found)"
        $script:skippedCount++
        return
    }

    $commitDate = $commitDate.Trim()
    $modifiedMatch = [regex]::Match($frontMatter, "(?m)^(?<prefix>modified:\s*)(?<value>[^\r\n]*)$")

    if ($modifiedMatch.Success) {
        $existingDate = $modifiedMatch.Groups["value"].Value.Trim()

        if ($existingDate -eq $commitDate) {
            $updatedFrontMatter = $frontMatter
        }
        else {
            $replacementLine = $modifiedMatch.Groups["prefix"].Value + $commitDate
            $updatedFrontMatter = $frontMatter.Remove($modifiedMatch.Index, $modifiedMatch.Length).Insert($modifiedMatch.Index, $replacementLine)
        }
    }
    elseif ([string]::IsNullOrEmpty($frontMatter)) {
        $updatedFrontMatter = "modified:           $commitDate"
    }
    else {
        $updatedFrontMatter = "$frontMatter$newline" + "modified:           $commitDate"
    }

    $updatedContent = "---$newline$updatedFrontMatter$newline---$($match.Groups["rest"].Value)"

    if ($updatedContent -ceq $content) {
        $script:unchangedCount++
        return
    }

    if ($DryRun) {
        Write-Host "would   $relativePath -> $commitDate"
    }
    else {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $encoding = if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
            $utf8WithBom
        }
        else {
            $utf8NoBom
        }

        [System.IO.File]::WriteAllText($filePath, $updatedContent, $encoding)
        Write-Host "update  $relativePath -> $commitDate"
    }

    $script:updatedCount++
}

$summaryLabel = if ($DryRun) { "Would update" } else { "Updated" }
Write-Host "$summaryLabel $updatedCount files. Unchanged: $unchangedCount. Filtered out: $filteredCount. Skipped: $skippedCount."
