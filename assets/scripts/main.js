// Navigation
const treeToggleEls = document.querySelectorAll(".tree-toggle");
treeToggleEls.forEach(el => {
    const li = el.closest("li");
    if (li.querySelectorAll("ul li").length > 0) {
        el.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            let parent = e.currentTarget.closest("li");
            if (parent.classList.contains("expanded") || 
                (parent.classList.contains("current") && !parent.classList.contains("collapsed"))) { 
                parent.classList.remove("expanded");
                parent.classList.add("collapsed");
            } else {
                parent.classList.add("expanded");
                parent.classList.remove("collapsed");
            }
        });
    } else {
        li.classList.add("non-expandable");
    }
});
const treeLinks = document.querySelectorAll(".tree-link");
for (let i = 0; i < treeLinks.length; i++) {
    if (treeLinks[i].href == document.location.href) {
        treeLinks[i].scrollIntoView(false);
        break;
    }
}

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
    let data = JSON.parse(sessionStorage.getItem(storage));
    if (!data) data = { expanded: [], scroll: 0 };
        
    data.expanded.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.add("expanded");
    });
    if (data.scroll)
        navElement.scrollTop = parseInt(data.scroll, 10);
    
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
    const defaultLeftPerc = (300 / document.body.clientWidth) * 100;
    const defaultSizes = [defaultLeftPerc, 100 - defaultLeftPerc];
    let sizes = JSON.parse(localStorage.getItem(storage));
    if (!sizes) sizes = defaultSizes;

    const menuElement = document.querySelector(".burger");
    if (sizes[0] < 10) menuElement.classList.add("collapsed");

    try {
        let panes = Split([".main-nav", ".main-content"], {
            sizes: sizes,
            minSize: [0, 450],
            gutterSize: 6,
            direction: "horizontal",
            snapOffset: 70,
            cursor: "ew-resize",
            onDragEnd: function (sizes) {
                localStorage.setItem(storage, JSON.stringify(sizes))
            }
        });

        menuElement.addEventListener("click", e => {
            e.preventDefault();

            if (panes) {
                let currentSizes = panes.getSizes();
                let sizes = (currentSizes[0] < 10 ? defaultSizes : [0, 100]);
                menuElement.classList.toggle("collapsed", sizes[0] < 10);
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
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => this.apply());

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
    }
}
new Theme();