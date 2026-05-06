#!/usr/bin/env bash

set -euo pipefail

usage() {
    cat <<'EOF'
Usage: ./_scripts/update-mydocs-modified.sh [--dry-run]

Updates the front matter "modified" value of Markdown files in _mydocs
for files whose front matter contains layout: page, a date field, and
does not enable no_date/nodate, using the last commit date recorded by
Git for each file.
EOF
}

if ! command -v git >/dev/null 2>&1; then
    echo "Error: git is required." >&2
    exit 1
fi

dry_run=0

case "${1:-}" in
    "")
        ;;
    --dry-run)
        dry_run=1
        ;;
    --help|-h)
        usage
        exit 0
        ;;
    *)
        echo "Error: unsupported option: ${1}" >&2
        usage >&2
        exit 1
        ;;
esac

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${repo_root}" ]]; then
    echo "Error: this script must run inside a Git working tree." >&2
    exit 1
fi

cd "${repo_root}"

docs_root="_mydocs"
if [[ ! -d "${docs_root}" ]]; then
    echo "Error: ${docs_root} was not found in ${repo_root}." >&2
    exit 1
fi

normalize_content() {
    awk '
        BEGIN {
            in_front_matter = 0;
            has_front_matter = 0;
        }
        NR == 1 {
            if ($0 == "---") {
                has_front_matter = 1;
                in_front_matter = 1;
            }
            print;
            next;
        }
        in_front_matter && $0 == "---" {
            in_front_matter = 0;
            print;
            next;
        }
        in_front_matter && $0 ~ /^modified:[[:space:]]*/ {
            next;
        }
        {
            print;
        }
    '
}

get_normalized_blob() {
    local revision="$1"
    local path="$2"

    if git show "${revision}:${path}" 2>/dev/null | normalize_content; then
        return 0
    fi

    return 0
}

get_meaningful_commit_date() {
    local file="$1"
    local current_path="${file}"
    local commit_hash=""
    local commit_date=""
    local status_line=""
    local status=""
    local path_one=""
    local path_two=""
    local path_at_commit=""
    local parent_path=""
    local parent_hash=""
    local current_content=""
    local parent_content=""

    while IFS= read -r line; do
        if [[ "${line}" == __COMMIT__* ]]; then
            commit_hash="${line#__COMMIT__ }"
            commit_date="${commit_hash##* }"
            commit_hash="${commit_hash% *}"
            continue
        fi

        if [[ -z "${line}" ]]; then
            continue
        fi

        status_line="${line}"
        IFS=$'\t' read -r status path_one path_two <<< "${status_line}"

        path_at_commit="${current_path}"
        parent_path="${current_path}"

        if [[ "${status}" == R* || "${status}" == C* ]]; then
            path_at_commit="${path_two}"
            parent_path="${path_one}"
            current_path="${path_one}"
        elif [[ -n "${path_one}" ]]; then
            path_at_commit="${path_one}"
            parent_path="${path_one}"
        fi

        current_content="$(get_normalized_blob "${commit_hash}" "${path_at_commit}")"
        parent_hash="$(git rev-parse "${commit_hash}^" 2>/dev/null || true)"
        if [[ -z "${parent_hash}" ]]; then
            if [[ -n "${current_content}" ]]; then
                printf '%s\n' "${commit_date}"
                return 0
            fi
            continue
        fi

        parent_content="$(get_normalized_blob "${parent_hash}" "${parent_path}" || true)"
        if [[ "${current_content}" != "${parent_content}" ]]; then
            printf '%s\n' "${commit_date}"
            return 0
        fi
    done < <(git log --follow --format='__COMMIT__ %H %cs' --name-status -- "${file}")

    return 0
}

updated_count=0
unchanged_count=0
filtered_count=0
skipped_count=0

process_file() {
    local file="$1"
    local front_matter_info=""
    local layout_value=""
    local has_date=""
    local hide_date=""
    local commit_date=""
    local original_last_byte=""
    local temp_file=""
    local awk_status=0

    if front_matter_info="$(awk '
        BEGIN {
            in_front_matter = 0;
            has_front_matter = 0;
            emitted = 0;
            layout_value = "";
            has_date = 0;
            hide_date = 0;
        }
        NR == 1 {
            if ($0 != "---") {
                exit 2;
            }
            has_front_matter = 1;
            in_front_matter = 1;
            next;
        }
        in_front_matter && $0 == "---" {
            in_front_matter = 0;
            emitted = 1;
            print layout_value "\t" has_date "\t" hide_date;
            exit;
        }
        in_front_matter && $0 ~ /^layout:[[:space:]]*/ {
            layout_value = $0;
            sub(/^layout:[[:space:]]*/, "", layout_value);
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", layout_value);
            next;
        }
        in_front_matter && $0 ~ /^date:[[:space:]]*/ {
            value = $0;
            sub(/^date:[[:space:]]*/, "", value);
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", value);
            if (value != "") {
                has_date = 1;
            }
            next;
        }
        in_front_matter && $0 ~ /^(no_date|nodate):[[:space:]]*/ {
            value = $0;
            sub(/^(no_date|nodate):[[:space:]]*/, "", value);
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", value);
            value = tolower(value);
            if (value == "" || value == "true" || value == "yes" || value == "on" || value == "1") {
                hide_date = 1;
            }
            next;
        }
        END {
            if (!has_front_matter) {
                exit 2;
            }
            if (!emitted) {
                print layout_value "\t" has_date "\t" hide_date;
            }
        }
    ' "${file}")"; then
        awk_status=0
    else
        awk_status=$?

        if [[ ${awk_status} -eq 2 ]]; then
            printf 'skip    %s (missing front matter)\n' "${file}"
            skipped_count=$((skipped_count + 1))
            return
        fi

        return "${awk_status}"
    fi

    IFS=$'\t' read -r layout_value has_date hide_date <<< "${front_matter_info}"

    if [[ "${layout_value}" != "page" ]]; then
        printf 'skip    %s (layout is %s)\n' "${file}" "${layout_value:-missing}"
        filtered_count=$((filtered_count + 1))
        return
    fi

    if [[ "${hide_date}" == "1" ]]; then
        printf 'skip    %s (no_date/nodate enabled)\n' "${file}"
        filtered_count=$((filtered_count + 1))
        return
    fi

    if [[ "${has_date}" != "1" ]]; then
        printf 'skip    %s (date is missing)\n' "${file}"
        filtered_count=$((filtered_count + 1))
        return
    fi

    if commit_date="$(get_meaningful_commit_date "${file}" | tr -d '\r')"; then
        :
    else
        commit_date=""
    fi

    if [[ -z "${commit_date}" ]]; then
        printf 'skip    %s (no commit found)\n' "${file}"
        skipped_count=$((skipped_count + 1))
        return
    fi

    temp_file="$(mktemp)"

    if awk -v modified_date="${commit_date}" '
        BEGIN {
            in_front_matter = 0;
            has_front_matter = 0;
            modified_written = 0;
        }
        NR == 1 {
            if ($0 == "---") {
                has_front_matter = 1;
                in_front_matter = 1;
            }
            print;
            next;
        }
        in_front_matter && $0 == "---" {
            if (!modified_written) {
                print "modified:           " modified_date;
            }
            in_front_matter = 0;
            print;
            next;
        }
        in_front_matter && $0 ~ /^modified:[[:space:]]*/ {
            current_line = $0;
            current_value = current_line;
            sub(/^modified:[[:space:]]*/, "", current_value);
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", current_value);
            if (current_value == modified_date) {
                print current_line;
            }
            else {
                match(current_line, /^modified:[[:space:]]*/);
                prefix = substr(current_line, 1, RLENGTH);
                print prefix modified_date;
            }
            modified_written = 1;
            next;
        }
        {
            print;
        }
        END {
            if (!has_front_matter) {
                exit 2;
            }
        }
    ' "${file}" > "${temp_file}"; then
        awk_status=0
    else
        awk_status=$?
        rm -f "${temp_file}"

        if [[ ${awk_status} -eq 2 ]]; then
            printf 'skip    %s (missing front matter)\n' "${file}"
            skipped_count=$((skipped_count + 1))
            return
        fi

        return "${awk_status}"
    fi

    original_last_byte="$(tail -c 1 "${file}" | od -An -t x1 | tr -d '[:space:]')"
    if [[ -n "${original_last_byte}" && "${original_last_byte}" != "0a" ]]; then
        perl -0pi -e 's/\n\z//' "${temp_file}"
    fi

    if cmp -s "${file}" "${temp_file}"; then
        rm -f "${temp_file}"
        unchanged_count=$((unchanged_count + 1))
        return
    fi

    if [[ ${dry_run} -eq 1 ]]; then
        rm -f "${temp_file}"
        printf 'would   %s -> %s\n' "${file}" "${commit_date}"
    else
        mv "${temp_file}" "${file}"
        printf 'update  %s -> %s\n' "${file}" "${commit_date}"
    fi

    updated_count=$((updated_count + 1))
}

while IFS= read -r file; do
    process_file "${file}"
done < <(find "${docs_root}" -type f -name "*.md" | LC_ALL=C sort)

if [[ ${dry_run} -eq 1 ]]; then
    summary_label="Would update"
else
    summary_label="Updated"
fi

printf '%s %d files. Unchanged: %d. Filtered out: %d. Skipped: %d.\n' "${summary_label}" "${updated_count}" "${unchanged_count}" "${filtered_count}" "${skipped_count}"
