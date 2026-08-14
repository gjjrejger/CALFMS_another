/* =========================================================
   CALFMS — CHWEYA & ASSOCIATES
   Main Website JavaScript
========================================================= */


/* =========================================================
   HEADER & MOBILE NAVIGATION
========================================================= */

const header = document.querySelector("header");
const menuToggle = document.querySelector(".menu-toggle");
const navigationLinks = document.querySelectorAll("header nav a");


function closeMobileMenu() {

    if (!header) return;

    header.classList.remove("nav-open");

    if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }
}


/* Open / close mobile menu */

if (menuToggle && header) {

    menuToggle.addEventListener("click", () => {

        const isOpen =
            header.classList.toggle("nav-open");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });

}


/* Close menu after selecting a link */

navigationLinks.forEach((link) => {

    link.addEventListener("click", () => {
        closeMobileMenu();
    });

});


/* Close menu when clicking outside */

document.addEventListener("click", (event) => {

    if (
        header &&
        !header.contains(event.target)
    ) {
        closeMobileMenu();
    }

});


/* Close menu with Escape */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeMobileMenu();
    }

});


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

function handleHeaderScroll() {

    if (!header) return;

    if (window.scrollY > 60) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

}


window.addEventListener(
    "scroll",
    handleHeaderScroll
);

handleHeaderScroll();


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements = document.querySelectorAll(
    "section > *, .practice-list article, #team article"
);


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "is-visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach((element) => {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });

} else {

    /*
       Fallback for older browsers.
       If IntersectionObserver is unavailable,
       simply show everything.
    */

    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = document.querySelectorAll(
    "main section[id]"
);


if (
    sections.length > 0 &&
    "IntersectionObserver" in window
) {

    const sectionObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    navigationLinks.forEach((link) => {
                        link.classList.remove("active");
                    });


                    const activeLink =
                        document.querySelector(
                            `header nav a[href="#${entry.target.id}"]`
                        );


                    if (activeLink) {
                        activeLink.classList.add("active");
                    }

                });

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    sections.forEach((section) => {
        sectionObserver.observe(section);
    });

}


/* =========================================================
   COPY TO CLIPBOARD
========================================================= */

const copyButtons =
    document.querySelectorAll(".copy-button");


copyButtons.forEach((button) => {

    button.addEventListener("click", async () => {

        const textToCopy =
            button.dataset.copy;


        if (!textToCopy) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                textToCopy
            );


            const originalText =
                button.textContent;


            button.textContent = "Copied!";


            button.classList.add("copied");


            setTimeout(() => {

                button.textContent =
                    originalText;

                button.classList.remove(
                    "copied"
                );

            }, 1800);


        } catch (error) {

            /*
               Fallback for browsers where the
               Clipboard API is unavailable.
            */

            const temporaryInput =
                document.createElement("textarea");

            temporaryInput.value =
                textToCopy;

            document.body.appendChild(
                temporaryInput
            );

            temporaryInput.select();

            document.execCommand("copy");

            temporaryInput.remove();


            button.textContent = "Copied!";


            setTimeout(() => {

                button.textContent = "Copy";

            }, 1800);

        }

    });

});


/* =========================================================
CONTACT FORM
========================================================= */

const contactForm =
    document.querySelector(".contact-form");

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const submitButton =
                contactForm.querySelector(
                    ".submit-button"
                );

            const originalButtonText =
                submitButton.innerHTML;

            // Collect form data
            const formData = {
                name: document
                    .querySelector("#name")
                    .value
                    .trim(),

                email: document
                    .querySelector("#email")
                    .value
                    .trim(),

                subject: document
                    .querySelector("#subject")
                    .value
                    .trim(),

                message: document
                    .querySelector("#message")
                    .value
                    .trim()
            };

            // Prevent empty submissions
            if (
                !formData.name ||
                !formData.email ||
                !formData.subject ||
                !formData.message
            ) {
                alert(
                    "Please complete all the required fields."
                );

                return;
            }

            try {

                // Show sending state
                submitButton.disabled = true;

                submitButton.innerHTML =
                    "Sending...";

                // Send enquiry to CALFMS backend
                const response = await fetch(
                    "http://localhost:3000/api/contact",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            formData
                        )
                    }
                );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Unable to send enquiry."
                    );
                }

                // Success
                alert(
                    "Thank you for contacting Chweya & Associates Advocates. Your enquiry has been sent successfully."
                );

                // Clear form
                contactForm.reset();

            } catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );

                alert(
                    "We were unable to send your enquiry. Please try again or contact the office directly."
                );

            } finally {

                // Restore button
                submitButton.disabled = false;

                submitButton.innerHTML =
                    originalButtonText;
            }
        }
    );
}