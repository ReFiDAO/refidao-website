/**
 * ReFi DAO Navigation Component
 * Handles desktop dropdowns, mobile menu, and scroll behavior
 */

class Navigation {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.toggle = document.querySelector('.nav__toggle');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.mobileClose = document.querySelector('.mobile-menu__close');
    this.mobileLinks = document.querySelectorAll('.mobile-menu__link[data-submenu]');
    
    this.isScrolled = false;
    this.scrollThreshold = 50;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.checkScroll();
  }
  
  bindEvents() {
    // Scroll handler
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    
    // Mobile menu toggle
    if (this.toggle) {
      this.toggle.addEventListener('click', this.openMobileMenu.bind(this));
    }
    
    if (this.mobileClose) {
      this.mobileClose.addEventListener('click', this.closeMobileMenu.bind(this));
    }
    
    // Mobile submenu toggles
    this.mobileLinks.forEach(link => {
      link.addEventListener('click', this.toggleMobileSubmenu.bind(this));
    });
    
    // Close mobile menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenu?.classList.contains('is-open')) {
        this.closeMobileMenu();
      }
    });
    
    // Close mobile menu on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && this.mobileMenu?.classList.contains('is-open')) {
        this.closeMobileMenu();
      }
    });
  }
  
  handleScroll() {
    this.checkScroll();
  }
  
  checkScroll() {
    const scrolled = window.scrollY > this.scrollThreshold;
    
    if (scrolled !== this.isScrolled) {
      this.isScrolled = scrolled;
      this.nav?.classList.toggle('nav--scrolled', scrolled);
    }
  }
  
  openMobileMenu() {
    this.mobileMenu?.classList.add('is-open');
    document.body.classList.add('is-modal-open');
    
    // Focus first link
    const firstLink = this.mobileMenu?.querySelector('.mobile-menu__link');
    firstLink?.focus();
  }
  
  closeMobileMenu() {
    this.mobileMenu?.classList.remove('is-open');
    document.body.classList.remove('is-modal-open');
    
    // Return focus to toggle
    this.toggle?.focus();
  }
  
  toggleMobileSubmenu(e) {
    const link = e.currentTarget;
    const submenuId = link.dataset.submenu;
    const submenu = document.getElementById(submenuId);
    
    if (submenu) {
      e.preventDefault();
      submenu.classList.toggle('is-open');
      
      // Toggle aria-expanded
      const isOpen = submenu.classList.contains('is-open');
      link.setAttribute('aria-expanded', isOpen);
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
});

export default Navigation;
