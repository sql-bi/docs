// Fix initial width panels
try {
    const mobileNavQuery = window.matchMedia ? window.matchMedia("(max-width: 760px)") : { matches: false };
    const navTransitionDuration = 220;

    /**
     * Checks whether persisted panel sizes can be reused.
     * @param {unknown} sizes
     */
    const isValidSizes = sizes => Array.isArray(sizes) && sizes.length > 1 && sizes.every(size => Number.isFinite(size));

    /**
     * Reads the current persisted split panel sizes.
     */
    const readStoredSizes = () => {
        try {
            const sizes = JSON.parse(localStorage.getItem("panels-sizes"));
            return isValidSizes(sizes) ? sizes : null;
        } catch (_) {
            return null;
        }
    };

    /**
     * Checks whether the persisted navigation panel is collapsed.
     * @param {unknown} sizes
     */
    const isCollapsedSizes = sizes => isValidSizes(sizes) && sizes[0] < 10;

    const sizes = readStoredSizes();
    const rules = `
        ${sizes && !mobileNavQuery.matches ? `.main-nav { width:calc(${sizes[0] ?? 0}% - 3px); }` : ""}
        .page.loading { visibility: visible; }
    `;
    document.head.appendChild(document.createElement("style")).innerHTML=rules; 

    document.addEventListener("DOMContentLoaded", () => {
        const burger = document.querySelector(".burger");
        if (!burger) return;

        const root = document.documentElement;
        let navTransitionTimer = 0;

        /**
         * Stops mobile navigation transition overrides.
         */
        const stopMobileNavTransition = () => {
            window.clearTimeout(navTransitionTimer);
            root.classList.remove("nav-animating");
        };

        /**
         * Enables the mobile navigation transition only for user-triggered toggles.
         */
        const startMobileNavTransition = () => {
            window.clearTimeout(navTransitionTimer);
            root.classList.add("nav-animating");
            navTransitionTimer = window.setTimeout(stopMobileNavTransition, navTransitionDuration);
        };

        /**
         * Closes the off-canvas navigation when entering the mobile layout.
         * @param {MediaQueryList|MediaQueryListEvent} query
         */
        const syncMobileNav = query => {
            stopMobileNavTransition();
            root.classList.remove("nav-open");

            if (query.matches) {
                burger.classList.add("collapsed");
            } else {
                burger.classList.toggle("collapsed", isCollapsedSizes(readStoredSizes()));
            }
        };

        burger.addEventListener("click", e => {
            if (!mobileNavQuery.matches) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            startMobileNavTransition();
            const isOpen = root.classList.toggle("nav-open");
            burger.classList.toggle("collapsed", !isOpen);
        }, true);

        if (mobileNavQuery.addEventListener)
            mobileNavQuery.addEventListener("change", syncMobileNav);
        else if (mobileNavQuery.addListener)
            mobileNavQuery.addListener(syncMobileNav);

        syncMobileNav(mobileNavQuery);
    });
} catch (ignore) {}
