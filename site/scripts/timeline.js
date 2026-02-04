/**
 * ReFi DAO Timeline Script
 * Handles horizontal scroll hijacking and animations for the timeline section
 */

class HorizontalTimelineScroll {
    constructor() {
        this.timelineSection = document.querySelector('.timeline-section');
        this.timelineContainer = document.querySelector('.timeline-container');
        this.maxScrollLeft = 0;
        this.timelineStart = 0;
        this.scrollHeight = 0;
        
        if (this.timelineSection && this.timelineContainer) {
            this.init();
        }
    }

    init() {
        // Calculate timeline start position
        this.calculateBounds();
        
        // Set up scroll listener to map vertical scroll to horizontal
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        
        // Add wheel listener for immediate response when in timeline
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        
        // Recalculate on resize
        window.addEventListener('resize', () => {
            this.calculateBounds();
            this.calculateMaxScroll();
        });
        
        // Calculate max scroll after layout settles
        setTimeout(() => {
            this.calculateMaxScroll();
        }, 500);
    }

    calculateBounds() {
        if (!this.timelineSection) return;
        
        const rect = this.timelineSection.getBoundingClientRect();
        this.timelineStart = window.scrollY + rect.top;
        // Timeline section height is set in CSS (300vh = 3x viewport height)
        // This gives enough scroll space to go through all timeline items
        this.scrollHeight = window.innerHeight * 3;
    }

    calculateMaxScroll() {
        if (!this.timelineContainer) return;
        
        this.maxScrollLeft = this.timelineContainer.scrollWidth - this.timelineContainer.clientWidth;
    }

    handleScroll() {
        if (!this.timelineContainer || this.maxScrollLeft <= 0) return;
        
        const scrollY = window.scrollY;
        
        // Calculate scroll position relative to timeline start
        const scrollOffset = scrollY - this.timelineStart;
        
        // Only map scroll when we're within the timeline section
        if (scrollOffset >= 0 && scrollOffset <= this.scrollHeight) {
            // Map vertical scroll progress (0 to scrollHeight) to horizontal scroll (0 to maxScrollLeft)
            const scrollProgress = Math.max(0, Math.min(1, scrollOffset / this.scrollHeight));
            const targetScrollLeft = scrollProgress * this.maxScrollLeft;
            
            this.timelineContainer.scrollLeft = targetScrollLeft;
        }
    }

    handleWheel(e) {
        if (!this.timelineContainer || this.maxScrollLeft <= 0) return;
        
        const scrollY = window.scrollY;
        const scrollOffset = scrollY - this.timelineStart;
        
        // Check if we're within the timeline section
        const isInTimeline = scrollOffset >= 0 && scrollOffset <= this.scrollHeight;
        
        if (!isInTimeline) return;
        
        const currentScrollLeft = this.timelineContainer.scrollLeft;
        const isAtStart = currentScrollLeft <= 1;
        const isAtEnd = currentScrollLeft >= this.maxScrollLeft - 1;
        
        // If at boundaries, allow normal scroll
        if ((isAtEnd && e.deltaY > 0) || (isAtStart && e.deltaY < 0)) {
            return;
        }
        
        // Prevent default scroll and update horizontal position directly
        e.preventDefault();
        
        // Calculate new horizontal scroll position
        const scrollAmount = e.deltaY * 1.2;
        const newScrollLeft = Math.max(0, Math.min(this.maxScrollLeft, currentScrollLeft + scrollAmount));
        this.timelineContainer.scrollLeft = newScrollLeft;
        
        // Update vertical scroll to match horizontal progress
        const horizontalProgress = newScrollLeft / this.maxScrollLeft;
        const targetScrollY = this.timelineStart + (horizontalProgress * this.scrollHeight);
        
        window.scrollTo({
            top: targetScrollY,
            behavior: 'auto'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize horizontal scroll hijacking
    const horizontalScroll = new HorizontalTimelineScroll();
    
    // Intersection Observer for Timeline Items (fade-in animations)
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
});
