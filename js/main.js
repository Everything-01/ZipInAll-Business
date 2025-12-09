document.addEventListener("DOMContentLoaded", () => {
    initializeContactForm();
    initializeNavMenu();
    
    // Safely init PageRenderer only if it exists (prevents errors if class is missing)
    if (typeof PageRenderer !== 'undefined') {
        new PageRenderer().init();
    } else {
        console.warn("PageRenderer is not defined. Skipping init.");
    }
});

/* =============================================================================
   CONTACT FORM LOGIC
   ============================================================================= */
function initializeContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector("button");
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        const data = new FormData(form);

        try {
            const res = await fetch(form.action, {
                method: "POST",
                body: data,
                headers: { Accept: "application/json" }
            });

            if (res.ok) {
                alert("Message sent successfully!");
                form.reset();
            } else {
                alert("There was an issue sending your message. Please try again.");
            }

        } catch (error) {
            console.error(error);
            alert("Network error. Please check your connection.");
        }

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

/* =============================================================================
   NAVBAR & MOBILE MENU LOGIC
   ============================================================================= */
function initializeNavMenu() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let toggle = navbar.querySelector('.nav-toggle');
    const links = navbar.querySelector('.nav-links');

    // 1. Create toggle button if missing (Auto-generates for Mobile)
    if (!toggle && links) {
        toggle = document.createElement('button');
        toggle.className = 'nav-toggle';
        toggle.setAttribute('aria-label', 'Toggle navigation');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
        
        // CRITICAL FIX: Insert toggle BEFORE links, so it sits to the Right of the Logo
        // (If we used firstChild, it would sit to the Left of the Logo)
        navbar.insertBefore(toggle, links);
    }

    if (!toggle || !links) return;

    // Helper: Close Menu
    const closeMenu = () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open'); // Removes dimming effect
    };

    // Helper: Toggle Menu
    const toggleMenu = () => {
        const isOpen = links.classList.contains('open');
        
        if (isOpen) {
            closeMenu();
        } else {
            links.classList.add('open');
            toggle.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('nav-open'); // Adds dimming effect
        }
    };

    // 2. Event Listeners
    toggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent immediate closing
        toggleMenu();
    });

    // Close when clicking a link (UX Best Practice)
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeMenu);
    });

    // Close on Escape key (Accessibility)
    window.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') closeMenu();
    });

    // Close when clicking outside the menu
    document.addEventListener('click', (ev) => {
        const isMenuOpen = links.classList.contains('open');
        const clickedInsideMenu = links.contains(ev.target);
        const clickedToggle = toggle.contains(ev.target);

        if (isMenuOpen && !clickedInsideMenu && !clickedToggle) {
            closeMenu();
        }
    });
}