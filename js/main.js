/* ============================================
   KumbhMelaTravel.com — Main JavaScript
   Mobile menu, smooth scroll, scroll animations,
   header behavior, FAQ accordion
   ============================================ */

(function () {
    'use strict';

    // ==================== DOM ELEMENTS ====================
    const header = document.getElementById('site-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');
    const animatedElements = document.querySelectorAll('[data-animate]');

    // ==================== HEADER SCROLL BEHAVIOR ====================
    let lastScrollY = 0;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initialize on load
    updateHeader();

    // ==================== MOBILE MENU ====================
    function toggleMobileMenu() {
        const isOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';

        mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
        navLinks.classList.toggle('mobile-open', !isOpen);

        // Prevent body scroll when menu is open
        document.body.style.overflow = !isOpen ? 'hidden' : '';
    }

    function closeMobileMenu() {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('mobile-open');
        document.body.style.overflow = '';
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when a nav link is clicked
    navLinkItems.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navLinks.classList.contains('mobile-open')) {
                closeMobileMenu();
            }
        });
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
            closeMobileMenu();
            mobileMenuToggle.focus();
        }
    });

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1024 && navLinks.classList.contains('mobile-open')) {
            closeMobileMenu();
        }
    });

    // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
                var elementPosition = target.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });

    // ==================== SCROLL ANIMATIONS (Intersection Observer) ====================
    if ('IntersectionObserver' in window) {
        var animationObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        animationObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        animatedElements.forEach(function (el) {
            animationObserver.observe(el);
        });
    } else {
        // Fallback: show all elements immediately
        animatedElements.forEach(function (el) {
            el.classList.add('animated');
        });
    }

    // ==================== FAQ ACCORDION (SINGLE OPEN) ====================
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (this.open) {
                // Close other open FAQ items
                faqItems.forEach(function (otherItem) {
                    if (otherItem !== item && otherItem.open) {
                        otherItem.open = false;
                    }
                });
            }
        });
    });

    // ==================== ACTIVE NAV LINK HIGHLIGHTING ====================
    var sections = document.querySelectorAll('section[id]');

    if ('IntersectionObserver' in window) {
        var navObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var id = entry.target.getAttribute('id');
                        navLinkItems.forEach(function (link) {
                            link.classList.remove('active');
                            var href = link.getAttribute('href');
                            if (href === '#' + id) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '-80px 0px -60% 0px'
            }
        );

        sections.forEach(function (section) {
            navObserver.observe(section);
        });
    }

    // ==================== PERFORMANCE: LAZY LOAD IMAGES ====================
    // Native lazy loading is used via HTML attributes, but add fallback
    if (!('loading' in HTMLImageElement.prototype)) {
        var lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            var imageObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        img.src = img.dataset.src || img.src;
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(function (img) {
                imageObserver.observe(img);
            });
        }
    }

})();
