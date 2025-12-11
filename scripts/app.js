/**
 * Enhanced Mobile App JavaScript for Private Equity Mega-Deal Guide
 * Implements modern ES6+ features with accessibility and performance optimizations
 */

class PrivateEquityApp {
    constructor() {
        this.isExpanded = false;
        this.debounceTimer = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        try {
            // Initialize core components
            this.setupNavigation();
            this.setupTakeawaysToggle();
            this.setupSmoothScrolling();
            this.setupScrollAnimations();
            this.setupResponsiveHandlers();
            this.setupAccessibility();
            this.setupPerformanceOptimizations();
            
            // Add loading complete class
            document.body.classList.add('loaded');
            
            console.log('Private Equity App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.handleError(error);
        }
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach((item, index) => {
            // Enhanced click handler with visual feedback
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigationClick(item, navItems);
            });

            // Add keyboard support
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleNavigationClick(item, navItems);
                }
            });

            // Add touch feedback
            item.addEventListener('touchstart', () => {
                item.style.transform = 'scale(0.95)';
            });

            item.addEventListener('touchend', () => {
                setTimeout(() => {
                    item.style.transform = '';
                }, 150);
            });
        });
    }

    handleNavigationClick(activeItem, allItems) {
        // Remove active state from all items
        allItems.forEach(item => {
            item.classList.remove('active');
            item.setAttribute('aria-current', 'false');
        });

        // Add active state to clicked item
        activeItem.classList.add('active');
        activeItem.setAttribute('aria-current', 'page');

        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Track interaction
        this.trackEvent('navigation_click', {
            section: activeItem.textContent.trim().toLowerCase()
        });
    }

    setupTakeawaysToggle() {
        const header = document.querySelector('.takeaways-header');
        const content = document.querySelector('.takeaways-content');
        const chevron = document.querySelector('.chevron');

        if (!header || !content || !chevron) return;

        // Set initial state
        this.updateTakeawaysState(false);

        // Click handler
        header.addEventListener('click', () => this.toggleTakeaways());

        // Keyboard accessibility
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTakeaways();
            }
        });

        // Make header accessible
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-controls', 'takeaways-content');
        header.setAttribute('aria-label', 'Toggle executive summary');
    }

    toggleTakeaways() {
        const content = document.querySelector('.takeaways-content');
        const chevron = document.querySelector('.chevron');
        const header = document.querySelector('.takeaways-header');

        if (!content || !chevron || !header) return;

        this.isExpanded = !this.isExpanded;
        this.updateTakeawaysState(this.isExpanded);

        // Add haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(this.isExpanded ? [5, 10, 5] : 5);
        }

        // Track interaction
        this.trackEvent('takeaways_toggle', {
            state: this.isExpanded ? 'expanded' : 'collapsed'
        });
    }

    updateTakeawaysState(expanded) {
        const content = document.querySelector('.takeaways-content');
        const chevron = document.querySelector('.chevron');
        const header = document.querySelector('.takeaways-header');

        if (!content || !chevron || !header) return;

        if (expanded) {
            content.classList.add('expanded');
            content.style.maxHeight = content.scrollHeight + 'px';
            chevron.classList.add('rotated');
            header.setAttribute('aria-expanded', 'true');
        } else {
            content.classList.remove('expanded');
            content.style.maxHeight = '0px';
            chevron.classList.remove('rotated');
            header.setAttribute('aria-expanded', 'false');
        }
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling for navigation
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Add scroll-to-top functionality for mobile
        this.addScrollToTop();
    }

    addScrollToTop() {
        // Create scroll to top button
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑';
        scrollButton.className = 'scroll-to-top';
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        
        // Style the button
        Object.assign(scrollButton.style, {
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: '0',
            visibility: 'hidden',
            transition: 'all 0.3s ease',
            zIndex: '1000'
        });

        document.body.appendChild(scrollButton);

        // Show/hide based on scroll position
        window.addEventListener('scroll', this.debounce(() => {
            if (window.scrollY > 300) {
                scrollButton.style.opacity = '1';
                scrollButton.style.visibility = 'visible';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.visibility = 'hidden';
            }
        }, 100));

        // Scroll to top on click
        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (navigator.vibrate) navigator.vibrate(10);
        });
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe deal cards
            document.querySelectorAll('.deal-card').forEach(card => {
                card.style.animationPlayState = 'paused';
                observer.observe(card);
            });
        }
    }

    setupResponsiveHandlers() {
        // Enhanced resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Orientation change handler
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        // Viewport height fix for mobile browsers
        this.setViewportHeight();
        window.addEventListener('resize', this.debounce(() => {
            this.setViewportHeight();
        }, 100));
    }

    setViewportHeight() {
        // Fix for mobile browser viewport height issues
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    handleResize() {
        // Recalculate expandable content heights
        const takeawaysContent = document.querySelector('.takeaways-content');
        if (takeawaysContent && takeawaysContent.classList.contains('expanded')) {
            takeawaysContent.style.maxHeight = takeawaysContent.scrollHeight + 'px';
        }

        // Update viewport height
        this.setViewportHeight();

        // Trigger custom resize event for other components
        window.dispatchEvent(new CustomEvent('appResize'));
    }

    setupAccessibility() {
        // Add skip link for keyboard navigation
        this.addSkipLink();
        
        // Enhance focus management
        this.enhanceFocusManagement();
        
        // Add ARIA live regions for dynamic content
        this.setupLiveRegions();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        
        // Style skip link
        Object.assign(skipLink.style, {
            position: 'absolute',
            top: '-40px',
            left: '6px',
            background: 'var(--color-primary)',
            color: 'white',
            padding: '8px',
            textDecoration: 'none',
            borderRadius: '4px',
            zIndex: '9999',
            transition: 'top 0.3s'
        });

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content id
        const main = document.querySelector('.content-grid');
        if (main) {
            main.id = 'main-content';
            main.setAttribute('role', 'main');
        }
    }

    enhanceFocusManagement() {
        // Trap focus in modals (for future enhancement)
        // Manage focus visibility for better UX
        let mouseDown = false;
        
        document.addEventListener('mousedown', () => {
            mouseDown = true;
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                mouseDown = false;
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupLiveRegions() {
        // Create live region for dynamic updates
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        
        document.body.appendChild(liveRegion);
        this.liveRegion = liveRegion;
    }

    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadResources();
        
        // Optimize scroll performance
        this.optimizeScrolling();
        
        // Setup error boundaries
        this.setupErrorHandling();
    }

    preloadResources() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }

    optimizeScrolling() {
        // Use passive event listeners for better scroll performance
        let scrollTimeout;
        const originalScrollHandler = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Custom scroll logic here
            }, 16); // ~60fps
        };

        window.addEventListener('scroll', scrollTimeout, { passive: true });
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Application error:', e.error);
            this.handleError(e.error);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.handleError(e.reason);
        });
    }

    handleError(error) {
        // Graceful degradation - app continues to function
        console.warn('Error handled gracefully:', error);
        
        // Notify user if critical error
        if (this.liveRegion) {
            this.liveRegion.textContent = 'An error occurred, but the app continues to function.';
        }
    }

    // Utility Functions
    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
        };
    }

    trackEvent(eventName, eventData) {
        // Placeholder for analytics tracking
        console.log('Event tracked:', eventName, eventData);
        
        // Future implementation:
        // if (window.gtag) {
        //     window.gtag('event', eventName, eventData);
        // }
    }
}

// Initialize the app
const app = new PrivateEquityApp();

// Export for external use
window.PrivateEquityApp = app;