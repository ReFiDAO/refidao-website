/**
 * ReFi DAO Timeline Script
 * Handles smooth horizontal scroll hijacking and fade-in animations
 */

class SmoothHorizontalTimeline {
    constructor() {
        this.section = document.querySelector('.timeline-section');
        this.container = document.querySelector('.timeline-container');
        this.isMobile = window.innerWidth <= 768;
        
        if (!this.section || !this.container || this.isMobile) {
            // Fallback: just initialize animations for mobile
            this.initAnimations();
            return;
        }
        
        this.init();
    }
    
    init() {
        // Calculate bounds
        this.updateBounds();
        
        // Smooth scroll handling with RAF
        this.targetScrollLeft = 0;
        this.currentScrollLeft = 0;
        this.isAnimating = true;
        this.smoothScroll();
        
        // Listen to scroll
        window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
        window.addEventListener('resize', this.updateBounds.bind(this));
        
        // Initialize animations
        this.initAnimations();
    }
    
    updateBounds() {
        if (!this.section || !this.container) return;
        
        const rect = this.section.getBoundingClientRect();
        this.sectionTop = window.scrollY + rect.top;
        this.sectionHeight = this.section.offsetHeight;
        this.maxScroll = Math.max(0, this.container.scrollWidth - this.container.clientWidth);
    }
    
    onScroll() {
        if (!this.section || !this.container || this.maxScroll <= 0) return;
        
        const scrollY = window.scrollY;
        const scrollOffset = scrollY - this.sectionTop;
        
        // Only map scroll when we're within the timeline section
        if (scrollOffset >= 0 && scrollOffset <= this.sectionHeight) {
            const progress = scrollOffset / this.sectionHeight;
            const clampedProgress = Math.max(0, Math.min(1, progress));
            this.targetScrollLeft = clampedProgress * this.maxScroll;
        } else if (scrollOffset < 0) {
            this.targetScrollLeft = 0;
        } else {
            this.targetScrollLeft = this.maxScroll;
        }
    }
    
    smoothScroll() {
        if (!this.isAnimating) return;
        
        // Smooth interpolation with easing
        const ease = 0.1;
        const diff = this.targetScrollLeft - this.currentScrollLeft;
        this.currentScrollLeft += diff * ease;
        
        // Update scroll position
        if (Math.abs(diff) > 0.1) {
            this.container.scrollLeft = this.currentScrollLeft;
            requestAnimationFrame(() => this.smoothScroll());
        } else {
            // Snap to final position when close enough
            this.container.scrollLeft = this.targetScrollLeft;
            this.currentScrollLeft = this.targetScrollLeft;
            requestAnimationFrame(() => this.smoothScroll());
        }
    }
    
    initAnimations() {
        // Intersection Observer for Timeline Items
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the item is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        const timelineContents = document.querySelectorAll('.timeline-content');
        timelineContents.forEach(el => observer.observe(el));

        // Smooth Scroll for "Scroll to Explore" indicator (if present)
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const timelineSection = document.querySelector('.timeline-section');

        if (scrollIndicator && timelineSection) {
            scrollIndicator.addEventListener('click', () => {
                timelineSection.scrollIntoView({ behavior: 'smooth' });
            });
            scrollIndicator.style.cursor = 'pointer';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize horizontal scroll hijacking (or fallback to animations only)
    new SmoothHorizontalTimeline();
});
