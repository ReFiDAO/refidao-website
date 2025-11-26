import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/navigation.scss"
import { i18n } from "../i18n"
import { trieFromAllFiles } from "../util/ctx"
import { FileTrieNode } from "../util/fileTrie"
import { simplifySlug } from "../util/path"

export default (() => {
  const Navigation: QuartzComponent = ({ displayClass, cfg, allFiles, fileData }: QuartzComponentProps) => {
    const navCopy = i18n(cfg.locale).components.navigation
    const trie = trieFromAllFiles(allFiles)
    const currentSlug = simplifySlug(fileData.slug!)
    
    // Helper function to check if a nav item is a folder with children
    const getNavItemInfo = (slug: string, label: string) => {
      const slugParts = slug.split("/").filter(Boolean)
      const node = trie.findNode(slugParts)
      const hasChildren = node && node.children.length > 0
      
      // Get direct children (one level deep), filtering out index pages
      const subpages: Array<{ slug: string; title: string }> = []
      if (hasChildren && node) {
        node.children.forEach((child) => {
          // Skip index pages from submenu
          if (child.slugSegment !== "index" && child.data) {
            const title = child.data.frontmatter?.title || child.displayName || child.slugSegment
            subpages.push({
              slug: child.slug,
              title: title
            })
          }
        })
        // Sort alphabetically
        subpages.sort((a, b) => a.title.localeCompare(b.title))
      }
      
      return { hasChildren, subpages, node }
    }
    
    // Check if current page is within a nav folder
    const isCurrentPageInFolder = (folderSlug: string): boolean => {
      // Remove leading slash and normalize
      const normalizedFolder = folderSlug.replace(/^\//, "").replace(/\/index$/, "")
      const normalizedCurrent = currentSlug.replace(/\/index$/, "")
      
      // Check if current page is exactly the folder or a subpage
      return normalizedCurrent === normalizedFolder || normalizedCurrent.startsWith(normalizedFolder + "/")
    }
    
    // Render nav item (with dropdown if it's a folder)
    const renderNavItem = (slug: string, label: string, isExternal: boolean = false) => {
      if (isExternal) {
        return (
          <li>
            <a href={slug} target="_blank" rel="noopener noreferrer">
              {label} <span class="external-arrow">↗</span>
            </a>
          </li>
        )
      }
      
      const { hasChildren, subpages } = getNavItemInfo(slug, label)
      // Normalize slug for comparison (remove leading slash)
      const normalizedSlug = slug.replace(/^\//, "")
      const normalizedCurrent = currentSlug.replace(/\/index$/, "")
      const isActive = normalizedCurrent === normalizedSlug || normalizedCurrent === normalizedSlug + "/index" || (hasChildren && isCurrentPageInFolder(slug))
      const shouldBeOpen = hasChildren && isCurrentPageInFolder(slug)
      
      if (hasChildren && subpages.length > 0) {
        return (
          <li class="nav-item-has-children" data-has-children="true" data-expanded={shouldBeOpen ? "true" : "false"}>
            <div class="nav-item-wrapper">
              <a href={slug} class={isActive ? "active" : ""}>
                {label}
              </a>
              <button 
                class="nav-toggle-dropdown" 
                type="button"
                aria-expanded={shouldBeOpen ? "true" : "false"}
                aria-haspopup="true"
                aria-label={`Toggle ${label} submenu`}
                data-nav-dropdown-toggle
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  class="chevron-icon"
                >
                  <polyline points="3 4.5 6 7.5 9 4.5"></polyline>
                </svg>
              </button>
            </div>
            <ul class="nav-dropdown" data-dropdown-open={shouldBeOpen ? "true" : "false"}>
              {subpages.map((subpage) => {
                const subpageSlug = simplifySlug(subpage.slug).replace(/\/index$/, "")
                const isSubpageActive = normalizedCurrent === subpageSlug
                return (
                  <li key={subpage.slug}>
                    <a href={subpage.slug} class={isSubpageActive ? "active" : ""}>
                      {subpage.title}
                    </a>
                  </li>
                )
              })}
            </ul>
          </li>
        )
      }
      
      return (
        <li>
          <a href={slug} class={isActive ? "active" : ""}>
            {label}
          </a>
        </li>
      )
    }
    
    // Render Network dropdown manually
    const renderNetworkDropdown = () => {
      const normalizedCurrent = currentSlug.replace(/\/index$/, "")
      const isInNetwork = normalizedCurrent === "about" || normalizedCurrent.startsWith("nodes") || normalizedCurrent.startsWith("community")
      const shouldBeOpen = isInNetwork
      
      return (
        <li class="nav-item-has-children" data-has-children="true" data-expanded={shouldBeOpen ? "true" : "false"}>
          <div class="nav-item-wrapper">
            <a href="/about" class={normalizedCurrent === "about" ? "active" : ""}>
              Network
            </a>
            <button 
              class="nav-toggle-dropdown" 
              type="button"
              aria-expanded={shouldBeOpen ? "true" : "false"}
              aria-haspopup="true"
              aria-label="Toggle Network submenu"
              data-nav-dropdown-toggle
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                class="chevron-icon"
              >
                <polyline points="3 4.5 6 7.5 9 4.5"></polyline>
              </svg>
            </button>
          </div>
          <ul class="nav-dropdown" data-dropdown-open={shouldBeOpen ? "true" : "false"}>
            <li>
              <a href="/about" class={normalizedCurrent === "about" ? "active" : ""}>
                ReFi DAO Global
              </a>
            </li>
            <li>
              <a href="/nodes" class={normalizedCurrent.startsWith("nodes") ? "active" : ""}>
                Nodes
              </a>
            </li>
            <li>
              <a href="/community" class={normalizedCurrent.startsWith("community") ? "active" : ""}>
                Community
              </a>
            </li>
          </ul>
        </li>
      )
    }
    
    // Render Media dropdown manually
    const renderMediaDropdown = () => {
      const normalizedCurrent = currentSlug.replace(/\/index$/, "")
      const isInMedia = normalizedCurrent.startsWith("media")
      const shouldBeOpen = isInMedia
      
      return (
        <li class="nav-item-has-children" data-has-children="true" data-expanded={shouldBeOpen ? "true" : "false"}>
          <div class="nav-item-wrapper">
            <a href="/media" class={isInMedia ? "active" : ""}>
              Media
            </a>
            <button 
              class="nav-toggle-dropdown" 
              type="button"
              aria-expanded={shouldBeOpen ? "true" : "false"}
              aria-haspopup="true"
              aria-label="Toggle Media submenu"
              data-nav-dropdown-toggle
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                class="chevron-icon"
              >
                <polyline points="3 4.5 6 7.5 9 4.5"></polyline>
              </svg>
            </button>
          </div>
          <ul class="nav-dropdown" data-dropdown-open={shouldBeOpen ? "true" : "false"}>
            <li>
              <a href="https://blog.refidao.com/" target="_blank" rel="noopener noreferrer">
                ReFi Blog <span class="external-arrow">↗</span>
              </a>
            </li>
            <li>
              <a href="https://linktr.ee/refipodcast" target="_blank" rel="noopener noreferrer">
                ReFi Podcast <span class="external-arrow">↗</span>
              </a>
            </li>
          </ul>
        </li>
      )
    }
    
    return (
      <nav class={`navigation ${displayClass ?? ""}`} aria-label="Primary navigation">
        <div class="nav-shell">
          <ul id="nav-menu" class="nav-links">
            {renderNetworkDropdown()}
            {renderMediaDropdown()}
            {renderNavItem("/resources-hub", navCopy.resourcesHub || "Resources Hub")}
            {renderNavItem("https://hub.regencoordination.xyz/c/refi-dao/21", "Forum", true)}
          </ul>
          <button
            class="nav-toggle action-button"
            type="button"
            aria-controls="nav-menu"
            aria-expanded="false"
            aria-label="Toggle navigation menu"
            data-nav-toggle
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </nav>
    )
  }

  Navigation.css = style
  Navigation.afterDOMLoaded = `
    document.addEventListener('DOMContentLoaded', () => {
      const navigation = document.querySelector('.navigation');
      const navShell = navigation?.querySelector('.nav-shell');
      const navMenu = navigation?.querySelector('#nav-menu');
      const menuButton = navigation?.querySelector('[data-nav-toggle]');

      if (!navigation || !navShell || !navMenu || !menuButton) {
        return;
      }

      let isCollapsed = navigation.hasAttribute('data-collapsed');
      let rafId = null;

      const closeMenu = () => {
        navMenu.classList.remove('open');
        navShell.classList.remove('menu-open');
        menuButton.setAttribute('aria-expanded', 'false');
      };

      const openMenu = () => {
        navMenu.classList.add('open');
        navShell.classList.add('menu-open');
        menuButton.setAttribute('aria-expanded', 'true');
        const firstLink = navMenu.querySelector('a');
        if (firstLink instanceof HTMLElement) {
          firstLink.focus();
        }
      };

      const measureNavWidth = () => {
        const originalStyle = navMenu.getAttribute('style') ?? '';
        navMenu.setAttribute(
          'style',
          [
            originalStyle,
            'position:absolute !important',
            'visibility:hidden !important',
            'display:flex !important',
            'flex-direction:row !important',
            'flex-wrap:nowrap !important',
            'white-space:nowrap !important',
            'height:auto !important',
            'max-width:none !important',
          ].join(';')
        );
        const width = navMenu.scrollWidth;
        if (originalStyle) {
          navMenu.setAttribute('style', originalStyle);
        } else {
          navMenu.removeAttribute('style');
        }
        return width;
      };

      const updateCollapsedState = () => {
        rafId = null;
        
        if (!navigation || !navShell || !navMenu) {
          return;
        }
        
        const available = navShell.clientWidth;
        const needed = measureNavWidth();
        const forceMobile = window.innerWidth <= 768;
        const shouldCollapse = forceMobile || needed + 48 > available;

        const previousCollapsed = isCollapsed;
        isCollapsed = shouldCollapse;

        if (shouldCollapse) {
          navigation.setAttribute('data-collapsed', 'true');
          if (!previousCollapsed) {
            closeMenu();
          }
        } else {
          navigation.removeAttribute('data-collapsed');
          closeMenu();
        }
      };

      const scheduleUpdate = () => {
        if (rafId !== null) {
          return;
        }
        rafId = window.requestAnimationFrame(updateCollapsedState);
      };

      const resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(navigation);
      window.addEventListener('resize', scheduleUpdate);
      updateCollapsedState();

      document.addEventListener('nav', () => {
        setTimeout(() => {
          updateCollapsedState();
        }, 0);
      });

      const mutationObserver = new MutationObserver(() => {
        scheduleUpdate();
      });
      
      mutationObserver.observe(navMenu, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: false
      });

      menuButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const isOpen = navMenu.classList.contains('open');
        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('open')) {
          closeMenu();
          menuButton.focus();
        }
      });

      document.addEventListener('click', (event) => {
        if (!navigation.contains(event.target)) {
          closeMenu();
        }
      });

      navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
      });

      // Handle dropdown toggles for folder nav items
      const dropdownToggles = navMenu.querySelectorAll('[data-nav-dropdown-toggle]');
      
      // Initialize chevron rotation based on initial state
      dropdownToggles.forEach((toggle) => {
        const navItem = toggle.closest('.nav-item-has-children');
        const isExpanded = navItem?.getAttribute('data-expanded') === 'true';
        const chevron = toggle.querySelector('.chevron-icon');
        if (chevron && isExpanded) {
          chevron.style.transform = 'rotate(180deg)';
        }
      });
      
      dropdownToggles.forEach((toggle) => {
        toggle.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          
          const navItem = toggle.closest('.nav-item-has-children');
          const dropdown = navItem?.querySelector('.nav-dropdown');
          
          if (!navItem || !dropdown) return;
          
          const isExpanded = navItem.getAttribute('data-expanded') === 'true';
          const newState = !isExpanded;
          
          navItem.setAttribute('data-expanded', newState.toString());
          dropdown.setAttribute('data-dropdown-open', newState.toString());
          toggle.setAttribute('aria-expanded', newState.toString());
          
          // Rotate chevron icon
          const chevron = toggle.querySelector('.chevron-icon');
          if (chevron) {
            chevron.style.transform = newState ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        });
      });

      // Close dropdowns when clicking outside
      document.addEventListener('click', (event) => {
        const target = event.target;
        if (!target || !navigation.contains(target) || target.closest('[data-nav-dropdown-toggle]')) {
          return;
        }
        
        // If clicking a nav link (not the toggle), close all dropdowns
        if (target.closest('.nav-links a')) {
          dropdownToggles.forEach((toggle) => {
            const navItem = toggle.closest('.nav-item-has-children');
            const dropdown = navItem?.querySelector('.nav-dropdown');
            const chevron = toggle.querySelector('.chevron-icon');
            
            if (navItem && dropdown) {
              navItem.setAttribute('data-expanded', 'false');
              dropdown.setAttribute('data-dropdown-open', 'false');
              toggle.setAttribute('aria-expanded', 'false');
              if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
              }
            }
          });
        }
      });

      // Keyboard navigation support
      dropdownToggles.forEach((toggle) => {
        toggle.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle.click();
          }
        });
      });

      // Close dropdowns when Escape is pressed
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          dropdownToggles.forEach((toggle) => {
            const navItem = toggle.closest('.nav-item-has-children');
            const dropdown = navItem?.querySelector('.nav-dropdown');
            const chevron = toggle.querySelector('.chevron-icon');
            
            if (navItem && dropdown && navItem.getAttribute('data-expanded') === 'true') {
              navItem.setAttribute('data-expanded', 'false');
              dropdown.setAttribute('data-dropdown-open', 'false');
              toggle.setAttribute('aria-expanded', 'false');
              if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
              }
            }
          });
        }
      });
    });
  `

  return Navigation
}) satisfies QuartzComponentConstructor




