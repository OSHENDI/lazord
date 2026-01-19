
(function () {
    'use strict';

    const config = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const staggerDelay = getStaggerDelay(entry.target);
                entry.target.style.transitionDelay = `${staggerDelay}ms`;
                entry.target.classList.add('animate-visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, config);

    function getStaggerDelay(element) {
        const parent = element.parentElement;
        if (!parent) return 0;

        const siblings = Array.from(parent.children).filter(
            child => child.classList.contains('animate-on-scroll')
        );
        const index = siblings.indexOf(element);
        return index * 80; 
    }

    function initAnimations() {
        const animateElements = document.querySelectorAll(`
            .feature-card,
            .solution-card,
            .product-card,
            .benefit-card,
            .service-card,
            .pricing-card,
            .team-card,
            .case-study-card,
            .result-card,
            .stat-item,
            .workflow-step,
            .section-title,
            .section-subtitle,
            .hero-content,
            .hero-image,
            .about-content,
            .workflow-content,
            .contact-wrapper,
            .footer-grid
        `);

        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            animationObserver.observe(el);
        });

        const zoomImages = document.querySelectorAll(`
            .product-card img,
            .result-card img,
            .case-study-card img,
            .team-image img,
            .hero-image img
        `);

        zoomImages.forEach(img => {
            img.classList.add('img-zoom');
        });

        initCounters();
    }

    function animateCounter(element) {
        const target = parseFloat(element.dataset.target);
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const duration = 1500; 
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;

            const displayValue = isDecimal ? current.toFixed(1) : Math.floor(current);
            element.textContent = prefix + displayValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function initCounters() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }
})();
