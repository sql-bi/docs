// Search (requires Fuse.js)
class Search {
    minSearchLength = 3;
    lastQuery = {
        query: '',
        html: ''
    }

    /**
     * Search passed query
     *
     * @param query
     */
    search(query, maxResults = 3, maxSnippetLength = 130) {

        // Remove unsafe chars from the query
        query = query.replace(/[<>&'"]/g, "");

        if (query.length >= this.minSearchLength) {
            if (query != this.lastQuery.query) {
                const fuse = new Fuse(searchIndex, {
                    includeMatches: true,
                    minMatchCharLength: query.length,
                    findAllMatches: true,
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
                const results = fuse.search(query);
                if (results.length) {
                    for (let i = 0; i < Math.min(results.length, maxResults); i++) {
                        const result = results[i];
                        const snippet = this.highlight(result, maxSnippetLength);
                        html += `
                            <li>
                                <a href="${result.item.url}">
                                    <div class="item-title">${result.item.title}</div>
                                    <div class="item-snippet">${snippet}</div>
                                </a>
                            </li>
                        `;
                    }

                    if (results.length > maxResults)
                        html += `
                            <li class="show-all"><a href="/search/?s=${query}">Showing ${maxResults} of ${results.length} results. See all results...</a></li>
                        `;
    
                } else {
                    html += `<li class="no-results">No results. Try another keyword.</li>`;
                }
                html += "</ul>";

                const response = { query, html };

                this.lastQuery = response;

                return response;
    
            } else {
                return this.lastQuery;
            }
        } else {
            return null;
        }
    }

    /**
     * Highlight search query in passed search result item
     *
     * @param resultItem
     * @param maxSnippetLength
     */
    highlight(resultItem, maxSnippetLength){

        let result = "";
        for (let i = 0; i < resultItem.matches.length; i++) {
            let matchItem = resultItem.matches[i];
            if (matchItem.key == "content") {
                let text = resultItem.item[matchItem.key];
                
                let matches = [].concat(matchItem.indices);
                let pair = matches.shift();
                let begin = pair[0];
                if (begin <= maxSnippetLength) {
                    begin = 0;
                } else {
                    for (let ii = begin - Math.ceil(maxSnippetLength / 3); ii < begin; ii++) {
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
                    if (result.length >= maxSnippetLength && (char == "." || char == " " || char == ";")) {
                        if (char == " ") result += "&hellip;";
                        break;
                    }
                }
                break;
            }
        }
        return result;
    }
}
const searcher = new Search();

const isSearchPage = window.location.pathname.slice(-7) == "/search" || window.location.pathname.slice(-8) == "/search/";

// Header search
const headerSearchElement = document.querySelector("header.main .search input");
if (headerSearchElement) {
    headerSearchElement.addEventListener("search", e => {
        headerSearch(e.currentTarget.value);
    });
    headerSearchElement.addEventListener("keyup", e => {
        const query = e.currentTarget.value;
        if (e.key == "Enter")
            window.location.href = `/search/?s=${query}`;
        else
            headerSearch(query);
    });
    headerSearchElement.addEventListener("click", e => {
        e.stopPropagation();
        headerSearch(e.currentTarget.value);
    });
}

function headerSearch(query) {
    //if (isSearchPage) return;

    const toggleResults = (toggle, html = false) => {
        let resultsEl = document.querySelector(".search-results");
        let catcherEl = document.querySelector(".search-catcher");
        if (html !== false)
            resultsEl.innerHTML = html;

        if (toggle) {
            
            resultsEl.removeAttribute("hidden");
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
            resultsEl.setAttribute("hidden", "hidden");
            
            if (catcherEl) catcherEl.remove();
        }
    }

    if (query) {
        const response = searcher.search(query);
        if (response !== null)
            toggleResults(true, response.html);
        else
            toggleResults(false);
    } else {
        toggleResults(false);
    }
}

// Page search
function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] === variable)
            return decodeURIComponent(pair[1].replace(/\+/g, "%20")).trim();
    }
    return "";
}


const query = getQueryVariable("s");
if (query && headerSearchElement)
    headerSearchElement.value = query;

if (isSearchPage) {
    const resultsElement = document.querySelector(".page-search-results");
    if (resultsElement) {
        if (query) {
            const response = searcher.search(query, Infinity, 300);
            resultsElement.innerHTML = response ? response.html : `<ul><li class="no-results">No results. Try another keyword.</li></ul>`;
        } else {
            resultsElement.innerHTML = `<ul><li class="no-results">Nothing to search.</li></ul>`;
        }
    }
} else if (query) {
    window.location.href = `/search/${window.location.search}`;
}
