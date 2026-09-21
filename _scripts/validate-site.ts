const dns = require("node:dns").promises;
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");
const timers = require("node:timers/promises");

const externalHostDelayMs = 5000;

interface IValidationIssue {
    file: string;
    message: string;
}

interface IResolvedTarget {
    filePath: string;
    fragment: string;
}

interface ICatalogDocument {
    id: string;
    url: string;
    contextTitle: string;
    dateModified: string | null;
}

interface ICatalog {
    canonicalBaseUrl: string;
    documents: ICatalogDocument[];
}

interface INavigationItem {
    id: string;
    url: string;
    title: string;
    menuClass: string;
    separator: boolean;
}

interface INavigation {
    items: INavigationItem[];
}

interface IExternalLinkResult {
    status: "ok" | "warning" | "error";
    message: string;
    httpStatus?: number;
}

interface IExternalLinkFinding {
    url: string;
    sources: string[];
    result: IExternalLinkResult;
}

interface IHostCheckResult {
    status: "ok" | "warning" | "error";
    message: string;
}

interface ISiteContext {
    origin: string;
    repositorySourcePrefix: string | null;
}

/**
 * Collects files recursively below a directory.
 * @param directory Directory to scan.
 * @param suffix Optional filename suffix to require.
 */
function collectFiles(directory: string, suffix = ""): string[] {
    const files: string[] = [];

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...collectFiles(entryPath, suffix));
        } else if (!suffix || entry.name.endsWith(suffix)) {
            files.push(entryPath);
        }
    }

    return files;
}

/**
 * Decodes the HTML entities used in generated URL attributes.
 * @param value Attribute value to decode.
 */
function decodeHtmlAttribute(value: string): string {
    return value
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "'")
        .replace(/&#x2F;/gi, "/");
}

/**
 * Discovers the public site origin and optional GitHub source prefix from generated pages.
 * @param htmlFiles Generated HTML files to inspect.
 */
function discoverSiteContext(htmlFiles: string[]): ISiteContext {
    let origin = "https://docs0.local";
    let originFound = false;
    let repositorySourcePrefix: string | null = null;

    for (const filePath of htmlFiles) {
        const html = fs.readFileSync(filePath, "utf8");

        if (!originFound) {
            const canonicalTag = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i);
            const canonicalHref = canonicalTag ? canonicalTag[0].match(/\bhref=["']([^"']+)["']/i) : null;

            if (canonicalHref) {
                try {
                    origin = new URL(decodeHtmlAttribute(canonicalHref[1])).origin;
                    originFound = true;
                } catch {
                    // Metadata validation reports invalid canonical URLs later.
                }
            }
        }

        if (!repositorySourcePrefix) {
            const sourceTag = html.match(/<a\b(?=[^>]*\bclass=["'][^"']*\bgotogithub\b[^"']*["'])[^>]*>/i);
            const sourceHref = sourceTag ? sourceTag[0].match(/\bhref=["']([^"']+)["']/i) : null;

            if (sourceHref) {
                try {
                    const sourceUrl = new URL(decodeHtmlAttribute(sourceHref[1]));
                    const prefixMatch = sourceUrl.hostname === "github.com" ? sourceUrl.pathname.match(/^\/[^/]+\/[^/]+\/blob\/[^/]+\//) : null;
                    repositorySourcePrefix = prefixMatch ? prefixMatch[0] : null;
                } catch {
                    // External-link validation reports malformed source URLs later.
                }
            }
        }

        if (originFound && repositorySourcePrefix) {
            break;
        }
    }

    return { origin, repositorySourcePrefix };
}

/**
 * Normalizes an external HTTP URL and removes its fragment for deduplication.
 * @param value URL attribute value.
 * @param sourceRoute Public route of the referring page.
 * @param siteOrigin Public origin of the generated documentation site.
 */
function normalizeExternalUrl(value: string, sourceRoute: string, siteOrigin: string): string | null {
    const decodedValue = decodeHtmlAttribute(value.trim());

    if (!decodedValue || decodedValue.includes("${")) {
        return null;
    }

    try {
        const resolvedUrl = new URL(decodedValue, `${siteOrigin}${sourceRoute}`);

        if ((resolvedUrl.protocol !== "http:" && resolvedUrl.protocol !== "https:") || resolvedUrl.origin === siteOrigin) {
            return null;
        }

        resolvedUrl.hash = "";
        return resolvedUrl.toString();
    } catch {
        return null;
    }
}

/**
 * Checks whether an IP address belongs to a non-public network range.
 * @param address IP address to inspect.
 */
function isPrivateAddress(address: string): boolean {
    let normalizedAddress = address.toLowerCase();

    if (normalizedAddress.startsWith("[") && normalizedAddress.endsWith("]")) {
        normalizedAddress = normalizedAddress.slice(1, -1);
    }

    normalizedAddress = normalizedAddress.split("%")[0];

    if (net.isIP(normalizedAddress) === 4) {
        const parts = normalizedAddress.split(".").map(Number);
        return parts[0] === 0 || parts[0] === 10 || parts[0] === 127 ||
            parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127 ||
            parts[0] === 169 && parts[1] === 254 ||
            parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31 ||
            parts[0] === 192 && parts[1] === 168 ||
            parts[0] === 198 && (parts[1] === 18 || parts[1] === 19) ||
            parts[0] >= 224;
    }

    if (net.isIP(normalizedAddress) === 6) {
        return normalizedAddress.startsWith("::") ||
            normalizedAddress.startsWith("fc") || normalizedAddress.startsWith("fd") ||
            /^fe[89ab]/.test(normalizedAddress);
    }

    return false;
}

/**
 * Verifies that a URL cannot target credentials, localhost, or private networks.
 * @param url External URL to inspect.
 */
async function checkExternalHost(url: URL): Promise<IHostCheckResult> {
    if (url.username || url.password) {
        return { status: "error", message: "URLs containing credentials are not allowed." };
    }

    const hostname = url.hostname.toLowerCase();

    if (hostname === "localhost" || hostname.endsWith(".localhost") || isPrivateAddress(hostname)) {
        return { status: "error", message: "Requests to local or private addresses are blocked." };
    }

    try {
        const addresses = await dns.lookup(hostname, { all: true, verbatim: true });

        if (addresses.length === 0) {
            return { status: "warning", message: "DNS lookup returned no addresses." };
        }

        if (addresses.some((entry) => isPrivateAddress(entry.address))) {
            return { status: "error", message: "The hostname resolves to a local or private address." };
        }
    } catch (error) {
        const networkError = error as Error & { code?: string };
        const status = networkError.code === "ENOTFOUND" || networkError.code === "ENODATA" ? "error" : "warning";
        return { status, message: `DNS lookup failed: ${networkError.message}` };
    }

    return { status: "ok", message: "" };
}

/**
 * Reserves the next request slot for a hostname and waits until it is available.
 * @param url External URL whose hostname should be rate limited.
 * @param hostRequestSchedule Next available request time for each hostname.
 */
async function waitForHostRequestSlot(url: URL, hostRequestSchedule: Map<string, number>): Promise<void> {
    const now = Date.now();
    const previousRequestAt = hostRequestSchedule.get(url.hostname) || 0;
    const scheduledAt = Math.max(now, previousRequestAt + externalHostDelayMs);
    hostRequestSchedule.set(url.hostname, scheduledAt);

    if (scheduledAt > now) {
        await timers.setTimeout(scheduledAt - now);
    }
}

/**
 * Performs an external request with a timeout and one retry for network errors.
 * @param url External URL to request.
 * @param method HTTP method to use.
 * @param hostRequestSchedule Next available request time for each hostname.
 */
async function requestExternalUrl(url: URL, method: "HEAD" | "GET", hostRequestSchedule: Map<string, number>): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            await waitForHostRequestSlot(url, hostRequestSchedule);
            return await fetch(url, {
                method,
                redirect: "manual",
                signal: AbortSignal.timeout(10000),
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/json,*/*;q=0.8",
                    "User-Agent": "Docs0-Link-Validator/1.0"
                }
            });
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
        }
    }

    throw lastError || new Error("Unknown network error.");
}

/**
 * Cancels a response body because link validation only needs headers and status.
 * @param response HTTP response whose body should be discarded.
 */
async function discardResponseBody(response: Response): Promise<void> {
    if (response.body) {
        await response.body.cancel();
    }
}

/**
 * Checks one external URL, including redirects and a GET fallback for rejected HEAD requests.
 * @param value External URL to check.
 * @param hostRequestSchedule Next available request time for each hostname.
 */
async function checkExternalLink(value: string, hostRequestSchedule: Map<string, number>): Promise<IExternalLinkResult> {
    let currentUrl = new URL(value);

    for (let redirectCount = 0; redirectCount <= 5; redirectCount++) {
        const hostCheck = await checkExternalHost(currentUrl);

        if (hostCheck.status !== "ok") {
            return { status: hostCheck.status, message: hostCheck.message };
        }

        let response: Response;

        try {
            response = await requestExternalUrl(currentUrl, "HEAD", hostRequestSchedule);

            if (response.status >= 400) {
                await discardResponseBody(response);
                response = await requestExternalUrl(currentUrl, "GET", hostRequestSchedule);
            }
        } catch {
            try {
                response = await requestExternalUrl(currentUrl, "GET", hostRequestSchedule);
            } catch (getError) {
                return { status: "warning", message: `Network request failed: ${(getError as Error).message}` };
            }
        }

        const status = response.status;
        const location = response.headers.get("location");
        await discardResponseBody(response);

        if (status >= 300 && status < 400) {
            if (!location) {
                return { status: "warning", message: `HTTP ${status} did not provide a redirect location.`, httpStatus: status };
            }

            try {
                const redirectedUrl = new URL(location, currentUrl);

                if (redirectedUrl.protocol !== "http:" && redirectedUrl.protocol !== "https:") {
                    return { status: "error", message: `Redirected to unsupported protocol ${redirectedUrl.protocol}` };
                }

                currentUrl = redirectedUrl;
                continue;
            } catch {
                return { status: "error", message: `Invalid redirect location: ${location}` };
            }
        }

        if (status >= 200 && status < 300) {
            return { status: "ok", message: `HTTP ${status}`, httpStatus: status };
        }

        if (status === 401 || status === 403 || status === 429 || status >= 500) {
            return { status: "warning", message: `HTTP ${status}; the result may be caused by authentication, rate limiting, or a temporary server error.`, httpStatus: status };
        }

        return { status: "error", message: `HTTP ${status}`, httpStatus: status };
    }

    return { status: "error", message: "Too many redirects." };
}

/**
 * Validates a generated GitHub source link against the local repository.
 * @param value External GitHub source URL.
 * @param siteRoot Generated site root.
 * @param repositorySourcePrefix GitHub path prefix discovered from generated source links.
 */
function checkRepositorySourceLink(value: string, siteRoot: string, repositorySourcePrefix: string | null): IExternalLinkResult | null {
    if (!repositorySourcePrefix) {
        return null;
    }

    const url = new URL(value);

    if (url.hostname !== "github.com" || !url.pathname.startsWith(repositorySourcePrefix)) {
        return null;
    }

    const repositoryRoot = path.dirname(siteRoot);
    const sourcePath = path.resolve(repositoryRoot, decodeURIComponent(url.pathname.slice(repositorySourcePrefix.length)));

    if (sourcePath !== repositoryRoot && !sourcePath.startsWith(`${repositoryRoot}${path.sep}`)) {
        return { status: "error", message: "GitHub source path escapes the repository root." };
    }

    if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
        return { status: "error", message: "GitHub source path does not exist in the local repository." };
    }

    return { status: "ok", message: "Local source file exists." };
}

/**
 * Converts a generated HTML filename to its public route.
 * @param filePath Generated HTML filename.
 * @param siteRoot Generated site root.
 */
function routeFromFile(filePath: string, siteRoot: string): string {
    const relativePath = path.relative(siteRoot, filePath).split(path.sep).join("/");

    if (relativePath === "index.html") {
        return "/";
    }

    if (relativePath.endsWith("/index.html")) {
        return `/${relativePath.slice(0, -"index.html".length)}`;
    }

    return `/${relativePath.replace(/\.html$/, "")}`;
}

/**
 * Resolves an internal generated URL to a file and optional fragment.
 * @param value URL attribute value.
 * @param sourceRoute Public route of the referring page.
 * @param siteRoot Generated site root.
 * @param siteOrigin Public origin of the generated documentation site.
 */
function resolveTarget(value: string, sourceRoute: string, siteRoot: string, siteOrigin: string): IResolvedTarget | null {
    const decodedValue = decodeHtmlAttribute(value.trim());

    if (!decodedValue || decodedValue.includes("${") || decodedValue.startsWith("mailto:") || decodedValue.startsWith("tel:") || decodedValue.startsWith("javascript:") || decodedValue.startsWith("data:")) {
        return null;
    }

    let resolvedUrl: URL;

    try {
        resolvedUrl = new URL(decodedValue, `${siteOrigin}${sourceRoute}`);
    } catch {
        return null;
    }

    if (resolvedUrl.origin !== siteOrigin) {
        return null;
    }

    let pathname: string;
    let fragment: string;

    try {
        pathname = decodeURIComponent(resolvedUrl.pathname);
        fragment = decodeURIComponent(resolvedUrl.hash.slice(1));
    } catch {
        return null;
    }

    const relativeTarget = pathname.replace(/^\/+/, "");
    const directPath = path.resolve(siteRoot, relativeTarget);

    if (directPath !== siteRoot && !directPath.startsWith(`${siteRoot}${path.sep}`)) {
        return { filePath: "", fragment };
    }
    const candidates =
        pathname.endsWith("/") ? [path.join(directPath, "index.html")] :
        [directPath, `${directPath}.html`, path.join(directPath, "index.html")];
    const filePath = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());

    return filePath ? { filePath, fragment } : { filePath: "", fragment };
}

/**
 * Validates metadata, JSON-LD, local resources, and anchors in one HTML file.
 * @param filePath Generated HTML filename.
 * @param siteRoot Generated site root.
 * @param issues Mutable issue collection.
 * @param htmlCache Cache of generated HTML content.
 * @param externalLinks Mutable collection of external URLs and referring files.
 * @param siteOrigin Public origin of the generated documentation site.
 */
function validateHtmlFile(filePath: string, siteRoot: string, issues: IValidationIssue[], htmlCache: Map<string, string>, externalLinks: Map<string, Set<string>>, siteOrigin: string): void {
    const html = fs.readFileSync(filePath, "utf8");
    const relativeFile = path.relative(siteRoot, filePath);
    const sourceRoute = routeFromFile(filePath, siteRoot);
    htmlCache.set(filePath, html);

    if (!html.includes("<meta name=\"description\" content=\"") || !html.includes("http-equiv=\"refresh\"") && !html.includes("<link rel=\"canonical\" href=\"")) {
        issues.push({ file: relativeFile, message: "Missing description or canonical metadata." });
    }

    const jsonLdMatches = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);

    for (const match of jsonLdMatches) {
        try {
            JSON.parse(match[1]);
        } catch (error) {
            issues.push({ file: relativeFile, message: `Invalid JSON-LD: ${(error as Error).message}` });
        }
    }

    const attributeMatches = html.matchAll(/<(a|img|video|source|script|link)\b[^>]*\b(?:href|src)=["']([^"']+)["'][^>]*>/gi);

    for (const match of attributeMatches) {
        const isCanonicalLink = match[1].toLowerCase() === "link" && /\brel=["']canonical["']/i.test(match[0]);
        const externalUrl = isCanonicalLink ? null : normalizeExternalUrl(match[2], sourceRoute, siteOrigin);

        if (externalUrl) {
            const sources = externalLinks.get(externalUrl) || new Set<string>();
            sources.add(relativeFile);
            externalLinks.set(externalUrl, sources);
        }

        const target = resolveTarget(match[2], sourceRoute, siteRoot, siteOrigin);

        if (!target) {
            continue;
        }

        if (!target.filePath) {
            issues.push({ file: relativeFile, message: `Missing internal resource: ${decodeHtmlAttribute(match[2])}` });
            continue;
        }

        if (!target.fragment || path.extname(target.filePath) !== ".html") {
            continue;
        }

        const targetHtml = htmlCache.get(target.filePath) || fs.readFileSync(target.filePath, "utf8");
        htmlCache.set(target.filePath, targetHtml);
        const fragmentPattern = new RegExp(`(?:id|name)=["']${target.fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);

        if (!fragmentPattern.test(targetHtml)) {
            issues.push({ file: relativeFile, message: `Missing anchor: ${decodeHtmlAttribute(match[2])}` });
        }
    }
}

/**
 * Checks external links with bounded concurrency and records errors and inconclusive warnings.
 * @param externalLinks External URLs and the generated files that reference them.
 * @param siteRoot Generated site root.
 * @param repositorySourcePrefix GitHub path prefix discovered from generated source links.
 * @param findings Mutable external-link finding collection.
 */
async function validateExternalLinks(externalLinks: Map<string, Set<string>>, siteRoot: string, repositorySourcePrefix: string | null, findings: IExternalLinkFinding[]): Promise<void> {
    const entries = [...externalLinks.entries()].sort(([left], [right]) => left.localeCompare(right));
    const networkGroups = new Map<string, Array<[string, Set<string>]>>();
    const hostRequestSchedule = new Map<string, number>();
    const workers: Promise<void>[] = [];
    let networkCheckCount = 0;
    let localSourceCheckCount = 0;

    /**
     * Records a failed or inconclusive external-link result.
     * @param result Link validation result.
     * @param url External URL that was checked.
     * @param sources Generated files that reference the URL.
     */
    function recordResult(result: IExternalLinkResult, url: string, sources: Set<string>): void {
        if (result.status === "ok") {
            return;
        }

        findings.push({ url, sources: [...sources].sort(), result });
    }

    for (const [url, sources] of entries) {
        const localSourceResult = checkRepositorySourceLink(url, siteRoot, repositorySourcePrefix);

        if (localSourceResult) {
            localSourceCheckCount++;
            recordResult(localSourceResult, url, sources);
            continue;
        }

        const hostname = new URL(url).hostname;
        const hostEntries = networkGroups.get(hostname) || [];
        hostEntries.push([url, sources]);
        networkGroups.set(hostname, hostEntries);
    }

    const groups = [...networkGroups.values()].sort((left, right) => right.length - left.length);
    const workerCount = Math.min(8, groups.length);
    let nextGroupIndex = 0;

    console.log(`Checking ${entries.length} unique external links.`);
    console.log(`Delay per hostname: ${externalHostDelayMs / 1000} seconds.`);

    /**
     * Processes hostname groups until the shared queue is empty.
     */
    async function worker(): Promise<void> {
        while (nextGroupIndex < groups.length) {
            const groupIndex = nextGroupIndex;
            nextGroupIndex++;

            for (const [url, sources] of groups[groupIndex]) {
                networkCheckCount++;
                const result = await checkExternalLink(url, hostRequestSchedule);
                recordResult(result, url, sources);
            }
        }
    }

    for (let workerIndex = 0; workerIndex < workerCount; workerIndex++) {
        workers.push(worker());
    }

    await Promise.all(workers);
    console.log(`Checked ${networkCheckCount} HTTP links and ${localSourceCheckCount} local GitHub source mappings.`);
}

/**
 * Prints one external-link finding without combining the URL and source files on one line.
 * @param finding External-link finding to print.
 */
function printExternalFinding(finding: IExternalLinkFinding): void {
    console.log(`    - ${finding.url}`);

    if (finding.result.httpStatus === undefined) {
        console.log(`      Reason: ${finding.result.message}`);
    }

    console.log(`      Sources: ${finding.sources.length}`);

    for (const source of finding.sources.slice(0, 3)) {
        console.log(`        - ${source}`);
    }

    if (finding.sources.length > 3) {
        console.log(`        - ... ${finding.sources.length - 3} more`);
    }
}

/**
 * Prints external-link findings grouped by HTTP status and severity.
 * @param findings External-link findings to summarize.
 */
function printExternalLinkRecap(findings: IExternalLinkFinding[]): void {
    const httpGroups = new Map<number, IExternalLinkFinding[]>();
    const otherWarnings: IExternalLinkFinding[] = [];
    const otherErrors: IExternalLinkFinding[] = [];

    for (const finding of findings) {
        if (finding.result.httpStatus !== undefined) {
            const statusFindings = httpGroups.get(finding.result.httpStatus) || [];
            statusFindings.push(finding);
            httpGroups.set(finding.result.httpStatus, statusFindings);
        } else if (finding.result.status === "warning") {
            otherWarnings.push(finding);
        } else {
            otherErrors.push(finding);
        }
    }

    const otherHttpStatuses = [...httpGroups.keys()].filter((status) => status !== 403 && status !== 404).sort((left, right) => left - right);
    const httpStatuses = [403, 404, ...otherHttpStatuses];
    const blockingErrorCount = findings.filter((finding) => finding.result.status === "error").length;
    const warningCount = findings.filter((finding) => finding.result.status === "warning").length;

    console.log("");
    console.log("External link recap");
    console.log(`  Blocking errors: ${blockingErrorCount}`);
    console.log(`  Warnings: ${warningCount}`);

    for (const httpStatus of httpStatuses) {
        const statusFindings = httpGroups.get(httpStatus) || [];
        console.log("");
        console.log(`  HTTP ${httpStatus}: ${statusFindings.length}`);

        for (const finding of statusFindings) {
            printExternalFinding(finding);
        }
    }

    console.log("");
    console.log(`  Other warnings: ${otherWarnings.length}`);

    for (const finding of otherWarnings) {
        printExternalFinding(finding);
    }

    console.log("");
    console.log(`  Other errors: ${otherErrors.length}`);

    for (const finding of otherErrors) {
        printExternalFinding(finding);
    }
}

/**
 * Validates the optional AI catalog, policy, and their relationship to the sitemap.
 * @param siteRoot Generated site root.
 * @param issues Mutable issue collection.
 */
function validateMachineReadableFiles(siteRoot: string, issues: IValidationIssue[]): boolean {
    const catalogPath = path.join(siteRoot, "ai", "catalog.json");
    const policyPath = path.join(siteRoot, "ai", "policy.json");
    const sitemapPath = path.join(siteRoot, "sitemap.xml");
    const catalogExists = fs.existsSync(catalogPath);
    const policyExists = fs.existsSync(policyPath);
    let catalog: ICatalog;

    if (!catalogExists && !policyExists) {
        return false;
    }

    if (!catalogExists || !policyExists) {
        const missingFile = catalogExists ? "ai/policy.json" : "ai/catalog.json";
        issues.push({ file: "ai", message: `Missing machine-readable resource: ${missingFile}` });
        return true;
    }

    try {
        catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
        JSON.parse(fs.readFileSync(policyPath, "utf8"));
    } catch (error) {
        issues.push({ file: "ai", message: `Invalid machine-readable JSON: ${(error as Error).message}` });
        return true;
    }

    const seenIds = new Set<string>();
    const sitemap = fs.readFileSync(sitemapPath, "utf8");
    let catalogOrigin = "";

    try {
        catalogOrigin = new URL(catalog.canonicalBaseUrl).origin;
    } catch {
        issues.push({ file: "ai/catalog.json", message: "Invalid canonicalBaseUrl." });
    }

    for (const document of catalog.documents) {
        if (seenIds.has(document.id)) {
            issues.push({ file: "ai/catalog.json", message: `Duplicate document id: ${document.id}` });
        }

        seenIds.add(document.id);

        let documentOrigin = "";

        try {
            documentOrigin = new URL(document.url).origin;
        } catch {
            documentOrigin = "";
        }

        if (!document.contextTitle || !catalogOrigin || documentOrigin !== catalogOrigin) {
            issues.push({ file: "ai/catalog.json", message: `Invalid catalog entry: ${document.id}` });
        }

        if (document.dateModified) {
            const escapedUrl = document.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const sitemapEntry = new RegExp(`<loc>${escapedUrl}<\\/loc>\\s*<lastmod>${document.dateModified}T`).test(sitemap);

            if (!sitemapEntry) {
                issues.push({ file: "sitemap.xml", message: `Missing or stale lastmod for ${document.id}` });
            }
        }
    }

    return true;
}

/**
 * Validates the shared navigation JSON and all of its internal targets.
 * @param siteRoot Generated site root.
 * @param issues Mutable issue collection.
 * @param siteOrigin Public origin of the generated documentation site.
 */
function validateNavigationFile(siteRoot: string, issues: IValidationIssue[], siteOrigin: string): void {
    const navigationFile = "assets/nav.json";
    const navigationPath = path.join(siteRoot, navigationFile);
    let navigation: INavigation;

    try {
        navigation = JSON.parse(fs.readFileSync(navigationPath, "utf8"));
    } catch (error) {
        issues.push({ file: navigationFile, message: `Invalid navigation JSON: ${(error as Error).message}` });
        return;
    }

    if (!navigation || !Array.isArray(navigation.items)) {
        issues.push({ file: navigationFile, message: "Navigation items must be an array." });
        return;
    }

    const seenIds = new Set<string>();
    const seenUrls = new Set<string>();
    const validItems: INavigationItem[] = [];

    for (const item of navigation.items) {
        if (!item || typeof item.id !== "string" || !/^p-[a-z0-9_-]+$/i.test(item.id) || typeof item.url !== "string" || !item.url.startsWith("/") || item.url.startsWith("//") || typeof item.title !== "string" || !item.title.trim() || typeof item.menuClass !== "string" || typeof item.separator !== "boolean") {
            issues.push({ file: navigationFile, message: `Invalid navigation item: ${JSON.stringify(item)}` });
            continue;
        }

        if (seenIds.has(item.id)) {
            issues.push({ file: navigationFile, message: `Duplicate navigation id: ${item.id}` });
        }

        if (seenUrls.has(item.url)) {
            issues.push({ file: navigationFile, message: `Duplicate navigation URL: ${item.url}` });
        }

        seenIds.add(item.id);
        seenUrls.add(item.url);
        validItems.push(item);
    }

    for (const item of validItems) {
        const target = resolveTarget(item.url, "/", siteRoot, siteOrigin);

        if (!target || !target.filePath) {
            issues.push({ file: navigationFile, message: `Missing navigation target: ${item.url}` });
        }

        const pathWithoutTrailingSlash = item.url.endsWith("/") ? item.url.slice(0, -1) : item.url;
        const parentSlashIndex = pathWithoutTrailingSlash.lastIndexOf("/");
        const parentUrl = parentSlashIndex <= 0 ? "/" : `${pathWithoutTrailingSlash.slice(0, parentSlashIndex)}/`;

        if (parentUrl !== "/" && !seenUrls.has(parentUrl)) {
            issues.push({ file: navigationFile, message: `Missing navigation parent ${parentUrl} for ${item.url}` });
        }
    }
}

/**
 * Runs all generated-site checks and exits with a failure when issues are found.
 * @param siteRoot Generated site root.
 * @param checkExternalLinks Whether external HTTP links should be checked.
 */
async function main(siteRoot: string, checkExternalLinks: boolean): Promise<void> {
    const resolvedSiteRoot = path.resolve(siteRoot);
    const issues: IValidationIssue[] = [];
    const externalFindings: IExternalLinkFinding[] = [];
    const htmlCache = new Map<string, string>();
    const externalLinks = new Map<string, Set<string>>();

    if (!fs.existsSync(resolvedSiteRoot)) {
        throw new Error(`Generated site not found: ${resolvedSiteRoot}`);
    }

    const htmlFiles = collectFiles(resolvedSiteRoot, ".html");
    const siteContext = discoverSiteContext(htmlFiles);

    for (const filePath of htmlFiles) {
        validateHtmlFile(filePath, resolvedSiteRoot, issues, htmlCache, externalLinks, siteContext.origin);
    }

    const hasMachineReadableFiles = validateMachineReadableFiles(resolvedSiteRoot, issues);
    validateNavigationFile(resolvedSiteRoot, issues, siteContext.origin);

    if (checkExternalLinks) {
        await validateExternalLinks(externalLinks, resolvedSiteRoot, siteContext.repositorySourcePrefix, externalFindings);
        printExternalLinkRecap(externalFindings);
    }

    const externalErrorCount = externalFindings.filter((finding) => finding.result.status === "error").length;
    const totalErrorCount = issues.length + externalErrorCount;

    if (issues.length > 0) {
        console.log("");
        console.log(`Site errors: ${issues.length}`);

        for (const issue of issues) {
            console.log(`  - ${issue.message}`);
            console.log(`    File: ${issue.file}`);
        }
    }

    if (totalErrorCount > 0) {
        console.log("");
        console.log(`Site validation failed with ${totalErrorCount} blocking error(s).`);
        process.exitCode = 1;
        return;
    }

    console.log(`Validated ${htmlCache.size} HTML files${hasMachineReadableFiles ? " and the machine-readable documentation resources" : ""}${checkExternalLinks ? ", including external links" : ""}.`);
}

/**
 * Parses command-line arguments and runs site validation.
 */
async function run(): Promise<void> {
    let siteRoot = "_site";
    let checkExternalLinks = false;

    for (const argument of process.argv.slice(2)) {
        if (argument === "--external") {
            checkExternalLinks = true;
        } else if (!argument.startsWith("--")) {
            siteRoot = argument;
        }
    }

    try {
        await main(siteRoot, checkExternalLinks);
    } catch (error) {
        console.error((error as Error).message);
        process.exitCode = 1;
    }
}

void run();
