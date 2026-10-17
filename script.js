/**
 * Salaah – The Mentor Community
 * Vanilla JavaScript (Standalone Version)
 *
 * Handles:
 * 1. Mobile navigation toggle
 * 2. Smooth scrolling for navigation links
 * 3. Sticky navbar styling on scroll
 * 4. Scroll-based reveal animations (Intersection Observer)
 * 5. Active navigation link updates
 * 6. Automatic current year in footer
 * 7. Back to top functionality
 */

(function () {
  "use strict";

  // --- DOM Elements ---
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".navbar__hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelectorAll(".navbar__link");
  const mobileLinks = document.querySelectorAll(
    ".mobile-menu__link, .mobile-menu__cta",
  );
  const allNavAnchors = document.querySelectorAll('a[href^="#"]');
  const revealElements = document.querySelectorAll(".reveal");
  const sections = document.querySelectorAll("section[id]");
  const backToTopBtn = document.querySelector(".footer__back-to-top");
  const yearEl = document.getElementById("current-year");

  // --- 1. Set Current Year ---
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- 2. Sticky Navbar on Scroll ---
  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add("navbar--scrolled");
    } else {
      navbar.classList.remove("navbar--scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on load

  // --- 3. Mobile Menu Toggle ---
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains("mobile-menu--open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    mobileMenu.classList.add("mobile-menu--open");
    hamburger.classList.add("navbar__hamburger--open");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Close menu");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove("mobile-menu--open");
    hamburger.classList.remove("navbar__hamburger--open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  // Close mobile menu when clicking a link
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMobileMenu();
    });
  });

  // Close mobile menu on Escape key
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      mobileMenu.classList.contains("mobile-menu--open")
    ) {
      closeMobileMenu();
      hamburger.focus();
    }
  });

  // --- 4. Smooth Scrolling ---
  function smoothScrollTo(targetId) {
    var target = document.getElementById(targetId);
    if (!target) return;

    var offset = 80; // navbar height + padding
    var targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }

  allNavAnchors.forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        var targetId = href.substring(1);
        smoothScrollTo(targetId);

        // Close mobile menu if open
        if (mobileMenu.classList.contains("mobile-menu--open")) {
          closeMobileMenu();
        }
      }
    });
  });

  // --- 5. Active Navigation Link ---
  function updateActiveLink() {
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove("navbar__link--active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("navbar__link--active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink(); // Run on load

  // --- 6. Scroll Reveal Animations (Intersection Observer) ---
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    // If user prefers reduced motion, show all elements immediately
    revealElements.forEach(function (el) {
      el.classList.add("reveal--visible");
    });
  } else if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(function (el) {
      el.classList.add("reveal--visible");
    });
  }

  // --- 7. Back to Top ---
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // --- 8. Close mobile menu on window resize (if going to desktop) ---
  window.addEventListener("resize", function () {
    if (
      window.innerWidth > 768 &&
      mobileMenu.classList.contains("mobile-menu--open")
    ) {
      closeMobileMenu();
    }
  });
})();
