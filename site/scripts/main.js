/**
 * ReFi DAO Main Site JavaScript
 * Core functionality and initialization
 */

import Navigation from './navigation.js';

// ========================================
// SCROLL ANIMATIONS
// ========================================

class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('[data-animate]');
    this.observer = null;
    
    if (this.elements.length > 0) {
      this.init();
    }
  }
  
  init() {
    const options = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };
    
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), options);
    
    this.elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      this.observer.observe(el);
    });
  }
  
  handleIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.animateDelay || 0;
        
        setTimeout(() => {
          el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
        
        this.observer.unobserve(el);
      }
    });
  }
}

// ========================================
// STAGGERED GRID ANIMATIONS
// ========================================

class StaggeredGrid {
  constructor(selector) {
    this.grids = document.querySelectorAll(selector);
    
    if (this.grids.length > 0) {
      this.init();
    }
  }
  
  init() {
    const options = {
      root: null,
      rootMargin: '0px 0px -5% 0px',
      threshold: 0.1
    };
    
    this.grids.forEach(grid => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateGrid(grid);
            observer.unobserve(grid);
          }
        });
      }, options);
      
      observer.observe(grid);
    });
  }
  
  animateGrid(grid) {
    const items = grid.querySelectorAll('.glass-card, .node-card, .feature-card, .stat-card');
    
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        item.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
}

// ========================================
// SMOOTH SCROLL
// ========================================

class SmoothScroll {
  constructor() {
    this.links = document.querySelectorAll('a[href^="#"]');
    
    if (this.links.length > 0) {
      this.init();
    }
  }
  
  init() {
    this.links.forEach(link => {
      link.addEventListener('click', this.handleClick.bind(this));
    });
  }
  
  handleClick(e) {
    const href = e.currentTarget.getAttribute('href');
    
    if (href === '#') return;
    
    const target = document.querySelector(href);
    
    if (target) {
      e.preventDefault();
      
      const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}

// ========================================
// COUNTER ANIMATION
// ========================================

class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('[data-counter]');
    
    if (this.counters.length > 0) {
      this.init();
    }
  }
  
  init() {
    const options = {
      root: null,
      threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    this.counters.forEach(counter => observer.observe(counter));
  }
  
  animateCounter(element) {
    const target = parseInt(element.dataset.counter, 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const update = () => {
      current += step;
      
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
        
        // Add suffix if present
        const suffix = element.dataset.counterSuffix;
        if (suffix) {
          element.textContent += suffix;
        }
      }
    };
    
    requestAnimationFrame(update);
  }
}

// ========================================
// PARALLAX EFFECT
// ========================================

class ParallaxEffect {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax]');
    
    if (this.elements.length > 0 && !this.prefersReducedMotion()) {
      this.init();
    }
  }
  
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  init() {
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    this.handleScroll();
  }
  
  handleScroll() {
    const scrollY = window.scrollY;
    
    this.elements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const yPos = scrollY * speed;
      el.style.transform = `translateY(${yPos}px)`;
    });
  }
}

// ========================================
// PAGE TRANSITIONS
// ========================================

class PageTransitions {
  constructor() {
    this.init();
  }
  
  init() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    // Smooth fade-in on page load using CSS transitions
    // The body already has opacity transition defined in CSS
    // Just ensure smooth initialization
    this.fadeIn();
  }
  
  fadeIn() {
    // Use requestAnimationFrame for smooth initialization
    requestAnimationFrame(() => {
      if (document.body.classList.contains('is-loading')) {
        document.body.style.opacity = '0';
        requestAnimationFrame(() => {
          // Small delay for smoother transition
          setTimeout(() => {
            document.body.classList.remove('is-loading');
            document.body.classList.add('is-loaded');
          }, 10);
        });
      } else {
        // If not loading, ensure smooth appearance
        document.body.classList.add('is-loaded');
      }
    });
  }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Core navigation
  new Navigation();
  
  // Scroll-triggered animations
  new ScrollAnimations();
  new StaggeredGrid('.card-grid');
  
  // Smooth scrolling
  new SmoothScroll();
  
  // Counter animations
  new CounterAnimation();
  
  // Parallax (if not reduced motion)
  new ParallaxEffect();
  
  // Page transitions (handles fade-in)
  new PageTransitions();
});

// Export for module usage
export {
  Navigation,
  ScrollAnimations,
  StaggeredGrid,
  SmoothScroll,
  CounterAnimation,
  ParallaxEffect,
  PageTransitions
};
