/**
 * Adds expand and collapse behavior to a navigation toggle.
 * @param {HTMLElement} toggle Navigation toggle element.
 */
function initializeNavigationToggle(toggle) {
    const parent = toggle.closest("li");

    toggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (parent.classList.contains("expanded") || parent.classList.contains("current") && !parent.classList.contains("collapsed")) {
            parent.classList.remove("expanded");
            parent.classList.add("collapsed");
        } else {
            parent.classList.add("expanded");
            parent.classList.remove("collapsed");
        }
    });
}

/**
 * Appends one navigation level and its descendants.
 * @param {HTMLUListElement} parentList List that receives the navigation items.
 * @param {string} parentUrl URL of the current navigation parent.
 * @param {Map<string, Array<object>>} childrenByParent Navigation items grouped by parent URL.
 * @param {Set<string>} visited URLs already rendered.
 */
function appendNavigationItems(parentList, parentUrl, childrenByParent, visited) {
    const items = childrenByParent.get(parentUrl) || [];

    for (const item of items) {
        if (visited.has(item.url)) {
            continue;
        }

        visited.add(item.url);
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        const title = document.createElement("span");
        const level = item.url.split("/").filter(Boolean).length;
        const children = childrenByParent.get(item.url) || [];

        listItem.id = item.id;
        listItem.classList.add(`l${level}`);
        listItem.dataset.navUrl = item.url;
        link.href = item.url;
        link.classList.add("tree-link");

        for (const className of item.menuClass.split(/\s+/).filter(Boolean)) {
            link.classList.add(className);
        }

        title.classList.add("link-title");
        title.title = item.title;
        title.textContent = item.title;
        link.appendChild(title);

        if (children.length > 0) {
            const toggle = document.createElement("span");
            const childList = document.createElement("ul");

            toggle.classList.add("icon");
            toggle.dataset.navigationToggle = "";
            link.appendChild(toggle);
            listItem.appendChild(link);
            listItem.appendChild(childList);
            appendNavigationItems(childList, item.url, childrenByParent, visited);
            initializeNavigationToggle(toggle);
        } else {
            listItem.appendChild(link);
        }

        parentList.appendChild(listItem);

        if (item.separator) {
            const separator = document.createElement("li");
            separator.classList.add("block");
            parentList.appendChild(separator);
        }
    }
}

/**
 * Restores expanded items and the previous navigation scroll position.
 * @param {HTMLElement} navigation Navigation container.
 */
function restoreNavigationState(navigation) {
    try {
        const data = JSON.parse(sessionStorage.getItem("nav-status"));

        if (!data || !Array.isArray(data.expanded)) {
            return;
        }

        for (const id of data.expanded) {
            if (typeof id !== "string") {
                continue;
            }

            const item = document.getElementById(id);

            if (item && navigation.contains(item)) {
                item.classList.add("expanded");
            }
        }

        const scroll = Number.parseInt(data.scroll, 10);

        if (Number.isFinite(scroll)) {
            navigation.scrollTop = scroll;
        }
    } catch (_) {}
}

/**
 * Marks the current item and expands all of its navigation ancestors.
 * @param {HTMLElement} navigation Navigation container.
 * @param {string} currentUrl URL of the current documentation page.
 */
function markCurrentNavigation(navigation, currentUrl) {
    const items = navigation.querySelectorAll("li[data-nav-url]");
    let currentItem = null;

    for (const item of items) {
        if (item.dataset.navUrl === currentUrl) {
            currentItem = item;
            break;
        }
    }

    if (!currentItem) {
        return;
    }

    currentItem.classList.add("current");
    let ancestor = currentItem.parentElement.closest("li");

    while (ancestor) {
        ancestor.classList.add("expanded");
        ancestor.classList.remove("collapsed");
        ancestor = ancestor.parentElement.closest("li");
    }

    const currentLink = currentItem.querySelector(":scope > .tree-link");

    if (currentLink) {
        const navigationRect = navigation.getBoundingClientRect();
        const linkRect = currentLink.getBoundingClientRect();

        if (linkRect.top < navigationRect.top) {
            navigation.scrollTop -= navigationRect.top - linkRect.top;
        } else if (linkRect.bottom > navigationRect.bottom) {
            navigation.scrollTop += linkRect.bottom - navigationRect.bottom;
        }
    }
}

/**
 * Validates navigation data and groups items by parent URL.
 * @param {object} payload Navigation JSON payload.
 */
function buildNavigationGroups(payload) {
    if (!payload || !Array.isArray(payload.items)) {
        throw new Error("Invalid navigation payload.");
    }

    const childrenByParent = new Map();
    const knownUrls = new Set();

    for (const item of payload.items) {
        if (!item || typeof item !== "object" || typeof item.id !== "string" || !/^p-[a-z0-9_-]+$/i.test(item.id) || typeof item.url !== "string" || !item.url.startsWith("/") || item.url.startsWith("//") || typeof item.title !== "string" || typeof item.menuClass !== "string" || typeof item.separator !== "boolean" || knownUrls.has(item.url)) {
            continue;
        }

        knownUrls.add(item.url);
        const pathWithoutTrailingSlash = item.url.endsWith("/") ? item.url.slice(0, -1) : item.url;
        const parentSlashIndex = pathWithoutTrailingSlash.lastIndexOf("/");
        const parentUrl = parentSlashIndex <= 0 ? "/" : `${pathWithoutTrailingSlash.slice(0, parentSlashIndex)}/`;
        const siblings = childrenByParent.get(parentUrl) || [];
        siblings.push(item);
        childrenByParent.set(parentUrl, siblings);
    }

    return childrenByParent;
}

/**
 * Renders navigation data and restores its page-specific state.
 * @param {HTMLElement} navigation Navigation container.
 * @param {Map<string, Array<object>>} childrenByParent Navigation items grouped by parent URL.
 */
function renderNavigation(navigation, childrenByParent) {
    const rootList = navigation.querySelector("ul");

    if (!rootList) {
        throw new Error("Navigation root is missing.");
    }

    appendNavigationItems(rootList, "/", childrenByParent, new Set());
    markCurrentNavigation(navigation, navigation.dataset.currentUrl || "/");
    restoreNavigationState(navigation);
    navigation.setAttribute("aria-busy", "false");
}

/**
 * Loads and renders the shared documentation navigation.
 */
async function loadNavigation() {
    const navigation = document.querySelector(".main-nav[data-navigation-source]");

    if (!navigation) {
        return;
    }

    const cacheKey = `navigation-data:${navigation.dataset.navigationSource}`;

    try {
        const cachedPayload = JSON.parse(sessionStorage.getItem(cacheKey));

        if (cachedPayload) {
            renderNavigation(navigation, buildNavigationGroups(cachedPayload));
            return;
        }
    } catch (_) {}

    try {
        const response = await fetch(navigation.dataset.navigationSource, { credentials: "same-origin" });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        renderNavigation(navigation, buildNavigationGroups(payload));

        try {
            sessionStorage.setItem(cacheKey, JSON.stringify(payload));
        } catch (_) {}
    } catch (error) {
        navigation.classList.add("navigation-load-error");
        console.error("Navigation could not be loaded.", error);
    } finally {
        navigation.setAttribute("aria-busy", "false");
    }
}

void loadNavigation();

/**
 * Initializes page behavior after the complete document and script dependencies are available.
 */
function initializeMain() {

    // Header Collapsing
    const toggleH = (toggle, el)=> {
        if (!el) return;

        const level = parseInt(el.tagName.substr(1));
        while (el) {
            el = el.nextSibling;
            if (!el || el.nodeType == Node.TEXT_NODE) continue;
            if (el.classList.contains("next-reading") || el.tagName == "FOOTER") return;
            if (el.tagName.length == 2 && el.tagName.substr(0, 1) == "H") {
                const siblingLevel = parseInt(el.tagName.substr(1));
                if (siblingLevel <= level) return;
            }
            if (!toggle)
                el.setAttribute("hidden", true);
            else
                el.removeAttribute("hidden")
        }
    };

    document.querySelectorAll("h2:not(.static), h3:not(.static)").forEach(heading => heading.addEventListener("click", e => {
        let el = e.target;
        const toggle = el.classList.contains("collapsed");
        if (toggle)
            el.classList.remove("collapsed");
        else
            el.classList.add("collapsed");

        toggleH(toggle, el);
    }));

    // Clickable checkboxes
    document.querySelectorAll(`input[type="checkbox"]`).forEach(c => c.removeAttribute('disabled'));

    // Anchor links
    document.querySelectorAll("h2, h3, h4, h5, h6").forEach(heading => {

        if (heading.classList.contains("noanchor")) return;
        const anchorLink = document.createElement("a");
        anchorLink.href = `#${heading.id}`;
        anchorLink.classList.add("anchor-link", "alt", "icon-anchor");
        heading.appendChild(anchorLink);
    });

    // Fix broken images
    document.querySelectorAll("img").forEach(img => {
        if (img.complete && img.naturalHeight == 0) {
            img.classList.add("broken");
            img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="; // Blank image
        }
    });

    // Zoom images
    mediumZoom(".markdown-body img:not(.nozoom)", {
        margin: 20,
        background: "rgba(0, 0, 0, 0.8)",
        scrollOffset: 40,
    });

    // TOC
    const tocElement = document.querySelector(".toc");
    if (tocElement) {
        const container = document.querySelector(".main-content, .content-no-nav");
        const items = tocElement.querySelectorAll("li");
        const sections = container.querySelectorAll("h2, h3, h4, h5, h6");

        items.forEach(item => {
            item.addEventListener("click", e => {
                items.forEach(i => i.classList.remove("active"));
                e.currentTarget.classList.add("active");
            });
        });

        const getActiveSection = ()=> {

            if (window.location.hash) {
                const id = window.location.hash.substring(1);
                const section = document.getElementById(id);
                if (section) return section;
            }

            for (const section of sections) {
                const rect = section.getBoundingClientRect();
                if (rect.top >= 0 && rect.top < window.innerHeight)
                    return section;
            }
            return null;
        }

        const highlightActiveSection = ()=> {
            const activeSection = getActiveSection();
            if (!activeSection) return;
            items.forEach(item => {
                item.classList.remove("active");
                if (activeSection) {
                    const itemId = item.querySelector("a").href.split("#")[1];
                    if (activeSection.id === itemId)
                        item.classList.add("active");
                }
            });

            // Remove hash from URL
            //history.replaceState(null, null, ' ');
        }

        container.addEventListener("scroll", ()=> highlightActiveSection());
        highlightActiveSection();
    }

    // Nav position & expanded status
    const navElement = document.querySelector(".main-nav");
    if (navElement) {
        const storage = "nav-status";

        window.addEventListener("beforeunload", () => {
            let expanded = [];
            navElement.querySelectorAll(".expanded").forEach(el => expanded.push(el.id));

            sessionStorage.setItem(storage, JSON.stringify({
                scroll: navElement.scrollTop,
                expanded: expanded
            }));
        });
    }

    // Nav Split
    if (navElement) {
        const storage = "panels-sizes";
        const expandedStorage = "panels-expanded-sizes";
        const defaultLeftPerc = (300 / document.body.clientWidth) * 100;
        const defaultSizes = [defaultLeftPerc, 100 - defaultLeftPerc];
        /**
         * Checks whether the stored split pane sizes can be reused.
         * @param {unknown} sizes
         */
        const isValidSizes = sizes => Array.isArray(sizes) && sizes.length > 1 && sizes.every(size => Number.isFinite(size));
        /**
         * Checks whether the navigation pane is collapsed.
         * @param {unknown} sizes
         */
        const isCollapsedSizes = sizes => isValidSizes(sizes) && sizes[0] < 10;
        /**
         * Reads split pane sizes from local storage.
         * @param {string} key
         */
        const readSizes = key => {
            try {
                const sizes = JSON.parse(localStorage.getItem(key));
                return isValidSizes(sizes) ? sizes : null;
            } catch (_) {
                return null;
            }
        };
        /**
         * Stores the last expanded split pane sizes.
         * @param {number[]} sizes
         */
        const rememberExpandedSizes = sizes => {
            if (!isCollapsedSizes(sizes))
                localStorage.setItem(expandedStorage, JSON.stringify(sizes));
        };
        /**
         * Gets the latest expanded split pane sizes.
         */
        const getExpandedSizes = () => readSizes(expandedStorage) || defaultSizes;
        let sizes = readSizes(storage) || defaultSizes;
        rememberExpandedSizes(sizes);

        const menuElement = document.querySelector(".burger");
        const mobileNavQuery = window.matchMedia ? window.matchMedia("(max-width: 760px)") : { matches: false };
        if (isCollapsedSizes(sizes)) menuElement.classList.add("collapsed");

        try {
            let panes = Split([".main-nav", ".main-content"], {
                sizes: sizes,
                minSize: [0, 450],
                gutterSize: 6,
                direction: "horizontal",
                snapOffset: 70,
                cursor: "ew-resize",
                onDragEnd: function (sizes) {
                    localStorage.setItem(storage, JSON.stringify(sizes));
                    rememberExpandedSizes(sizes);
                    menuElement.classList.toggle("collapsed", isCollapsedSizes(sizes));
                }
            });

            /**
             * Restores the desktop burger icon after leaving the mobile breakpoint.
             * @param {MediaQueryList|MediaQueryListEvent} query
             */
            const syncDesktopNav = query => {
                if (query.matches) return;

                document.documentElement.classList.remove("nav-open", "nav-animating");
                menuElement.classList.toggle("collapsed", isCollapsedSizes(panes.getSizes()));
            };

            if (mobileNavQuery.addEventListener)
                mobileNavQuery.addEventListener("change", syncDesktopNav);
            else if (mobileNavQuery.addListener)
                mobileNavQuery.addListener(syncDesktopNav);

            menuElement.addEventListener("click", e => {
                if (mobileNavQuery.matches) return;

                e.preventDefault();

                if (panes) {
                    let currentSizes = panes.getSizes();
                    rememberExpandedSizes(currentSizes);

                    let sizes = (isCollapsedSizes(currentSizes) ? getExpandedSizes() : [0, 100]);
                    menuElement.classList.toggle("collapsed", isCollapsedSizes(sizes));
                    panes.setSizes(sizes);
                    localStorage.setItem(storage, JSON.stringify(sizes));
                }
            });
        } catch (e){}
    }

    // Light/Dark theme
    class Theme {

        theme;
        ctrl;
        onChangeCallbacks = [];

        get current() {
            if (this.theme == "system") {
                return this.getActualTheme();
            } else {
                return this.theme;
            }
        }

        get isDark() {
            return this.current == "dark";
        }
        get isLight() {
            return this.current == "light";
        }

        constructor() {
            this.theme = localStorage.getItem("theme") || "system";

           if (window.matchMedia)
                window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => this.apply(this.theme));

            this.ctrl = document.querySelector(".change-theme");

            this.ctrl.addEventListener("click", e => {
                e.preventDefault();
                this.change(this.theme == "light" ? "dark" : (this.theme == "dark" ? "system" : "light"));
            });

            this.apply(this.theme);
        }

        getActualTheme() {
            if (!window.matchMedia) return "light";

            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            return isDark ? "dark" : "light";
        }

        /**
         * Registers a callback called after the active theme changes.
         * @param {Function} callback
         */
        onChange(callback) {
            this.onChangeCallbacks.push(callback);
        }

        change(theme) {
            localStorage.setItem("theme", theme);
            this.apply(theme);
        }

        apply(theme) {

            this.theme = theme;

            if (this.theme == "dark")
                document.documentElement.setAttribute("data-dark", "");
            else
                document.documentElement.removeAttribute("data-dark");

            if (this.theme == "light")
                document.documentElement.setAttribute("data-light", "");
            else
                document.documentElement.removeAttribute("data-light");

            this.ctrl.classList.remove("icon-theme-dark", "icon-theme-light", "icon-theme-system");
            this.ctrl.classList.add("icon-theme-" + this.theme);

            this.onChangeCallbacks.forEach(callback => {
                try {
                    callback(this.current);
                } catch (_) {}
            });
        }
    }
    const theme = new Theme();

    // Mermaid manager
    class MermaidManager {

        /**
         * Creates the Mermaid manager.
         * @param {Theme} theme
         */
        constructor(theme) {
            this.theme = theme;

            this.renderAll({ firstRun: true });
            this.theme.onChange(() => {
                this.renderAll({ firstRun: false });
            });
        }

        /**
         * Initializes Mermaid using the active theme.
         */
        initMermaid() {
            mermaid.initialize({
                startOnLoad: false,
                theme: this.theme.isDark ? "dark" : "default",
                securityLevel: "loose"
            });
        }

        /**
         * Converts Mermaid code blocks to renderable Mermaid elements.
         */
        initialTransform() {
            const blocks = document.querySelectorAll(
                "pre code.language-mermaid, pre.language-mermaid code"
            );

            blocks.forEach(block => {
                const pre = block.closest("pre");
                if (!pre) return;

                const code = block.textContent;
                const div = document.createElement("div");
                div.className = "mermaid";
                div.textContent = code;
                div.setAttribute("data-original-code", code);
                pre.replaceWith(div);
            });
        }

        /**
         * Restores Mermaid diagrams before re-rendering them.
         */
        resetDiagrams() {
            document.querySelectorAll(".mermaid").forEach(diagram => {
                const original = diagram.getAttribute("data-original-code");
                if (!original) return;
                diagram.removeAttribute("data-processed");
                diagram.textContent = original;
            });
        }

        /**
         * Runs Mermaid using the available API version.
         */
        runMermaid() {
            if (typeof mermaid.run === "function") {
                mermaid.run();
            } else if (typeof mermaid.init === "function") {
                mermaid.init(undefined, ".mermaid");
            }
        }

        /**
         * Renders all Mermaid diagrams.
         * @param {object} options
         */
        renderAll({ firstRun } = { firstRun: false }) {
            if (firstRun) {
                this.initialTransform();
            } else {
                this.resetDiagrams();
            }

            this.initMermaid();
            this.runMermaid();
        }
    }

    if (typeof mermaid !== "undefined")
        new MermaidManager(theme);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMain, { once: true });
} else {
    initializeMain();
}
