class PageRenderer {
    constructor() {
        this.app = document.getElementById("app");
        this.sections = document.querySelectorAll("main > section");
    }

    init() {
        window.addEventListener("hashchange", () => this.checkRoute());
        window.addEventListener("popstate", () => this.checkRoute());
        this.checkRoute();
    }

    async checkRoute() {
        // Determine page from hash (single-page) or pathname (separate HTML pages)
        let page = "";

        if (window.location.hash) {
            page = window.location.hash.replace("#", "");
        } else {
            const name = window.location.pathname.split("/").pop().replace(".html", "");
            page = name === "" ? "index" : name;
        }

        // map URL page names to markdown filenames
        const mdName = page === "privacy" ? "policy" : page;

        if (mdName === "policy" || mdName === "terms") {
            await this.loadMarkdown(mdName);
            this.showMarkdownMode();
        } else {
            this.showNormalMode();
        }
    }

    showMarkdownMode() {
        this.sections.forEach(sec => sec.style.display = "none");
        if (this.app) {
            this.app.style.display = "block";
        }
    }

    showNormalMode() {
        this.sections.forEach(sec => sec.style.display = "block");
        if (this.app) {
            this.app.innerHTML = "";
            this.app.style.display = "none";
        }
    }

    async loadMarkdown(page) {
        try {
            const res = await fetch(`./assets/data/${page}.md`);
            if (!res.ok) throw new Error(`Failed to load ${page}.md (${res.status})`);
            const md = await res.text();
            // parseMarkdown is provided by js/markdown-parser.js
            this.app.innerHTML = parseMarkdown(md);
        } catch (e) {
            console.error(e);
            if (this.app) this.app.innerHTML = "<p>Error loading content.</p>";
        }
    }
}
