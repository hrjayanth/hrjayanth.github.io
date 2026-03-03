document.addEventListener("DOMContentLoaded", function () {

    const contentDiv = document.getElementById("content");
    const navLinks = document.querySelectorAll(".nav-link");

    const initialPage = window.location.hash.replace("#", "") || "about";

    function loadPage(page, addToHistory = true) {

        fetch(`pages/${page}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Page not found");
                }
                return response.text();
            })
            .then(data => {
                contentDiv.classList.remove("loaded");
                contentDiv.innerHTML = data;
                initScrollReveal();
                setTimeout(() => {
                    contentDiv.classList.add("loaded");
                }, 50);

                navLinks.forEach(link => link.classList.remove("active"));
                document.querySelector(`[data-page="${page}"]`)
                        .classList.add("active");

                if (addToHistory) {
                    history.pushState({ page }, "", `#${page}`);
                }

                window.scrollTo(0, 0);
            })
            .catch(error => {
                contentDiv.innerHTML = "<h2>Page not found</h2>";
            });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            const page = this.getAttribute("data-page");
            loadPage(page);
        });
    });

    window.addEventListener("popstate", function (event) {
        if (event.state && event.state.page) {
            loadPage(event.state.page, false);
        }
    });


    loadPage(initialPage, false);

//    const pages = ["about", "experience", "education", "projects", "skills", "downloads", "contact"];
//    let currentIndex = pages.indexOf(initialPage);
//    let isScrolling = false;
//
//    window.addEventListener("wheel", function (e) {
//
//        if (isScrolling) return;
//
//        if (e.deltaY > 0) {
//            // Scroll Down
//            if (currentIndex < pages.length - 1) {
//                currentIndex++;
//                switchPage();
//            }
//        } else {
//            // Scroll Up
//            if (currentIndex > 0) {
//                currentIndex--;
//                switchPage();
//            }
//        }
//    });

    function switchPage() {
        isScrolling = true;

        loadPage(pages[currentIndex]);

        setTimeout(() => {
            isScrolling = false;
        }, 800); // adjust timing to match animation
    }
});

function initScrollReveal() {

    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    reveals.forEach(el => observer.observe(el));
}
