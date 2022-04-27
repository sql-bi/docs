/*!
 * SQLBI Documentation
 * Copyright (c) SQLBI corp. - All rights reserved.
 * https://docs.sqlbi.com
*/

// Navigation
let treeToggleEls = document.querySelectorAll(".tree-toggle");
treeToggleEls.forEach(a => {
    a.addEventListener("click", e => {
        e.preventDefault();
        let parent = e.currentTarget.parentNode;
        if (parent.classList.contains("expanded")) 
            parent.classList.remove("expanded");
        else
            parent.classList.add("expanded");
    });
});
let treeLinks = document.querySelectorAll(".tree-link");
for (let i = 0; i < treeLinks.length; i++) {
    if (treeLinks[i].href == document.location.href) {
        treeLinks[i].scrollIntoView(false);
        break;
    }
}

// Split
let navSizes = localStorage.getItem("nav");
navSizes = (navSizes ? JSON.parse(navSizes) : [20, 80]);
Split([".main-nav", ".main-content"], {
    sizes: navSizes,
    minSize: [200, 450],
    gutterSize: 1.5,
    direction: "horizontal",
    cursor: "ew-resize",
    onDragEnd: function (sizes) {
        localStorage.setItem("nav", JSON.stringify(sizes))
    }
});

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
    search(e.currentTarget.value);
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