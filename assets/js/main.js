/*!
 * SQLBI Documentation
 * Copyright (c) SQLBI corp. - All rights reserved.
 * https://docs.sqlbi.com
*/

// Navigation
const treeToggleEls = document.querySelectorAll(".tree-toggle");
treeToggleEls.forEach(el => {
    const li = el.closest("li");
    if (li.querySelectorAll("ul li").length > 0) {
        el.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            let parent = e.currentTarget.closest("li");
            if (parent.classList.contains("expanded")) 
                parent.classList.remove("expanded");
            else
                parent.classList.add("expanded");
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
document.querySelectorAll("h2:not(.static), h3:not(.static)").forEach(h => h.addEventListener("click", e => {
    let el = e.target;
    const toggle = el.classList.contains("collapsed");
    if (toggle)
        el.classList.remove("collapsed");
    else
        el.classList.add("collapsed");

    toggleH(toggle, el);
}));

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

    const observer = new IntersectionObserver(([e]) => {
        if (e.boundingClientRect.top + e.boundingClientRect.height > window.innerHeight)
            e.target.classList.remove("sticky")
        else
            e.target.classList.toggle("sticky", e.intersectionRatio < 1);
    }, { threshold: [1] });
    observer.observe(tocElement);

    const pinToc = (pinned)=>{
        if (pinned === undefined) {
            const rawPinned = localStorage.getItem("toc");
            pinned = (rawPinned != null ? rawPinned == "true" : true);
        }
        if (pinned)
            tocElement.classList.add("pinned");
        else
            tocElement.classList.remove("pinned");

        localStorage.setItem("toc", pinned);
    };
    pinToc();

    const toggleToc = ()=> {
        const expanded = !(!tocElement.classList.contains("collapsed") && (tocElement.classList.contains("expanded") || !tocElement.classList.contains("sticky")));
        if (expanded) {
            tocElement.classList.add("expanded");
            tocElement.classList.remove("collapsed");
        } else {
            tocElement.classList.remove("expanded");
            tocElement.classList.add("collapsed");
        }
    };

    tocElement.querySelectorAll(".expander, .toc-title").forEach(el => el.addEventListener("click", e => {
        e.preventDefault();
        toggleToc();
    }));
    tocElement.querySelector(".pin").addEventListener("click", e => {
        e.preventDefault();

        const rawPinned = localStorage.getItem("toc");
        pinned = (rawPinned != null ? rawPinned == "true" : true);
        pinToc(!pinned);
    });

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

    try {
        let panes = Split([".main-nav", ".main-content"], {
            sizes: sizes,
            minSize: [0, 450],
            gutterSize: 6,
            direction: "horizontal",
            cursor: "ew-resize",
            onDragEnd: function (sizes) {
                localStorage.setItem(storage, JSON.stringify(sizes))
            }
        });

        document.querySelector(".burger").addEventListener("click", e => {
            e.preventDefault();

            if (panes) {
                let currentSizes = panes.getSizes();
                let sizes = (currentSizes[0] < 10 ? defaultSizes : [0, 100]);
                panes.setSizes(sizes);
                localStorage.setItem(storage, JSON.stringify(sizes));
            }
        });
    } catch (e){}
}

// TO DO
let showToDo = (window.location.search == "?todo");
if (showToDo) {
    window.history.replaceState({}, null, document.location.href.replace(window.location.search, ''));
} else {
    showToDo = localStorage.getItem("todo");
}
if (showToDo) {
    document.body.classList.add("show-todo");
    localStorage.setItem("todo", true);
} else {
    document.body.classList.remove("show-todo");
}

// Search (requires Fuse.js)
let minSearchLen = 3;
let maxPreviewLen = 140;
let lastTerm = "";
let searchEl = document.querySelector(".search input");
searchEl.addEventListener("change", e => {
    search(e.currentTarget.value);
});
searchEl.addEventListener("keyup", e => {
    search(e.currentTarget.value);
});
searchEl.addEventListener("click", e => {
    e.stopPropagation();
    search(e.currentTarget.value);
});
document.querySelector("header.main").addEventListener("click", e => {
    toggleResults(false);
});

function toggleResults(toggle, html = false) {
    let resultsEl = document.querySelector(".search-results");
    let catcherEl = document.querySelector(".search-catcher");
    if (html !== false)
        resultsEl.innerHTML = html;

    if (toggle) {
        
        resultsEl.classList.remove("hidden");
        if (!catcherEl) {
            catcherEl = document.createElement("div");
            catcherEl.classList.add("search-catcher");
            document.body.append(catcherEl);

            catcherEl.addEventListener("click", e => {
                e.preventDefault();
                toggleResults(false);
            });
        }
    } else {
        resultsEl.classList.add("hidden");
        
        if (catcherEl) catcherEl.remove();
    }
}

function search(term) {

    if (term.length >= minSearchLen) {
        if (term != lastTerm) {
            let fuse = new Fuse(searchIndex, {
                includeMatches: true,
                minMatchCharLength: term.length,
                threshold: 0,
                //location: 0,
                //distance: 5000,
                ignoreLocation: true,
                keys: [
                    "title", 
                    "content"
                ]
            });

            let html = "<ul>";
            let results = fuse.search(term);
            if (results.length) {
                results.forEach(result => {
                    let h = highlight(result);
                    html += `
                        <li>
                            <a href="${result.item.url}" class="unseen"><div class="title">${result.item.title}</div>${h}</a>
                            
                        </li>
                    `;
                });

            } else {
                html += `<li class="no-results">No results. Try another keyword.</li>`;
            }
            html += "</ul>";

            toggleResults(true, html);
            lastTerm = term;

        } else {
            toggleResults(true);
        }
    } else {
        toggleResults(false);
    }
}

function highlight(resultItem){

    let result = "";
    for (let i = 0; i < resultItem.matches.length; i++) {
        let matchItem = resultItem.matches[i];
        if (matchItem.key == "content") {
            let text = resultItem.item[matchItem.key];
            
            let matches = [].concat(matchItem.indices);
            let pair = matches.shift();
            let begin = pair[0];
            if (begin <= maxPreviewLen) {
                begin = 0;
            } else {
                for (let ii = begin - Math.ceil(maxPreviewLen / 3); ii < begin; ii++) {
                    let char = text.charAt(ii);
                    if (char == " ") {
                        result += "&hellip;";
                        begin = ii;
                        break;
                    }
                }
            }

            for (let ii = begin; ii < text.length; ii++) {
                let char = text.charAt(ii);
                if (pair && ii == pair[0]) {
                    result += "<b>";
                }
                result += char;
                if (pair && ii == pair[1]) {
                    result += "</b>";
                    pair = matches.shift();
                }
                if (result.length >= maxPreviewLen && (char == "." || char == " " || char == ";")) {
                    if (char == " ") result += "&hellip;";
                    break;
                }
            }
            break;
        }
    }
    return result;
}

// Light/Dark theme
class Theme{

    constructor() {
        this.device = "light";
        this.current = localStorage.getItem("theme");;

        if (window.matchMedia) {
            let mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            this.device = (mediaQuery.matches ? "dark" : "light");
            mediaQuery.addEventListener("change", e => {
                this.device = (e.matches ? "dark" : "light");
                this.apply();
            });
        }

        document.querySelector(".change-theme").addEventListener("click", e => {
            e.preventDefault();
            let newTheme = (this.current == "light" ? "dark" : (this.current == "dark" ? "auto" : "light"));
            this.apply(newTheme);
        });

        this.apply(this.current);
    }

    apply(theme) {

        if (!theme) {
            theme = this.current;
        } else {
            this.current = theme;
            localStorage.setItem("theme", theme);
            
            let ctrl = document.querySelector(".change-theme .ctrl");
            ctrl.classList.remove("icon-theme-auto", "icon-theme-light", "icon-theme-dark");
            ctrl.classList.add(`icon-theme-${theme}`);
        }

        if (document.body.classList.contains("no-theme")) return;

        if (theme == "dark" || (theme == "auto" && this.device == "dark")) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }

        
    }

    get isDark() {
        return this.current == "dark";
    }
    get isLight() {
        return this.current == "light";
    }
}
new Theme();

// Cookies (requires cookiehelper.js)
const cookieHelper = new CookieHelper({
    prefCookieName: "_sqlbi_consent",
    necessaryCookies: ["sqlbi-*"],
    privacyUrl: "https://www.sqlbi.com/privacy/#cookies",
    geoCookieName: '_sqlbi_iso',
    targetEU: true
});
cookieHelper.addDependency(() => {

    // Google Analytics
    const gaID = "G-R2Q43JNMWE";
    const script = document.createElement("script")
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaID}`;
    script.async = true
    document.head.appendChild(script); 
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag("js", new Date());
    gtag("config", gaID, { 
        "allow_display_features": false,
        "anonymize_ip": true,
        "cookie_flags": "secure"
    });
});

// Play/pause videos when they are on/offscreen
/*function playPauseVideo() {
    const videos = document.querySelectorAll("video");
    videos.forEach(video => {
        video.muted = true;
        let playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                const observer = new IntersectionObserver(entries => {
                    entries.forEach((entry) => {
                        if (entry.intersectionRatio !== 1 && !video.paused) {
                            video.pause();
                        } else if (video.paused) {
                            video.play();
                        }
                    });
                }, { threshold: 0.2 });
                observer.observe(video);
            });
        }
    });
}
playPauseVideo();*/
