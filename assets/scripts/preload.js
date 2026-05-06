// Fix initial width panels
try {
    const storedSizes = JSON.parse(localStorage.getItem("panels-sizes"));
    const sizes = Array.isArray(storedSizes) && storedSizes.length > 1 && storedSizes.every(size => Number.isFinite(size)) ? storedSizes : null;
    const mobileNavQuery = window.matchMedia ? window.matchMedia("(max-width: 760px)") : { matches: false };
    const rules = `
        ${sizes && !mobileNavQuery.matches ? `.main-nav { width:calc(${sizes[0] ?? 0}% - 3px); }` : ""}
        .page.loading { visibility: visible; }
    `;
    document.head.appendChild(document.createElement("style")).innerHTML=rules; 

    document.addEventListener("DOMContentLoaded", () => {
        const burger = document.querySelector(".burger");
        if (!burger) return;

        /**
         * Closes the off-canvas navigation when entering the mobile layout.
         * @param {MediaQueryList|MediaQueryListEvent} query
         */
        const syncMobileNav = query => {
            if (query.matches) {
                document.documentElement.classList.remove("nav-open");
                burger.classList.add("collapsed");
            } else {
                document.documentElement.classList.remove("nav-open");
                burger.classList.toggle("collapsed", Array.isArray(sizes) && sizes[0] < 10);
            }
        };

        burger.addEventListener("click", e => {
            if (!mobileNavQuery.matches) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            const isOpen = document.documentElement.classList.toggle("nav-open");
            burger.classList.toggle("collapsed", !isOpen);
        }, true);

        if (mobileNavQuery.addEventListener)
            mobileNavQuery.addEventListener("change", syncMobileNav);
        else if (mobileNavQuery.addListener)
            mobileNavQuery.addListener(syncMobileNav);

        syncMobileNav(mobileNavQuery);
    });
} catch (ignore) {}
