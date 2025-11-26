import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/profile.scss"

export default (() => {
  const Profile: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={`profile-menu-container ${displayClass ?? ""}`}>
        <button
          class="profile-toggle action-button"
          type="button"
          aria-expanded="false"
          aria-label="Toggle user profile menu"
          aria-haspopup="true"
          data-profile-toggle
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
        <div class="profile-dropdown" data-dropdown-open="false">
          <ul>
            <li>
              <a href="https://pass.celopg.eco/welcome" target="_blank" rel="noopener noreferrer">
                Prosperity Pass <span class="external-arrow">↗</span>
              </a>
            </li>
            <li>
              <a href="https://app.gardens.fund/gardens/42220/0x4f604735c1cf31399c6e711d5962b2b3e0225ad3/0x13e71c56c5b048e9b8b6a9dbb4a4f346b5dab986" target="_blank" rel="noopener noreferrer">
                Gardens <span class="external-arrow">↗</span>
              </a>
            </li>
            <li>
              <a href="https://airtable.com/appzPVOtxJ9ug5MA7/shr21152t5xSyuJi6?YQ8fN=allRecords" target="_blank" rel="noopener noreferrer">
                Contribution Points Leaderboard <span class="external-arrow">↗</span>
              </a>
            </li>
            <li>
              <a href="https://hub.regencoordination.xyz/c/refi-dao/21" target="_blank" rel="noopener noreferrer">
                Forum <span class="external-arrow">↗</span>
              </a>
            </li>
            <li class="profile-dropdown-divider"></li>
            <li>
              <a href="/resources-hub/documents/network-member-onboarding">
                Onboarding Guide
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  Profile.css = style
  Profile.afterDOMLoaded = `
    document.addEventListener('DOMContentLoaded', () => {
      const profileContainer = document.querySelector('.profile-menu-container');
      const profileToggle = profileContainer?.querySelector('[data-profile-toggle]');
      const profileDropdown = profileContainer?.querySelector('.profile-dropdown');
      
      if (!profileContainer || !profileToggle || !profileDropdown) {
        return;
      }

      const closeProfileMenu = () => {
        profileDropdown.setAttribute('data-dropdown-open', 'false');
        profileToggle.setAttribute('aria-expanded', 'false');
      };

      const openProfileMenu = () => {
        profileDropdown.setAttribute('data-dropdown-open', 'true');
        profileToggle.setAttribute('aria-expanded', 'true');
      };

      profileToggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const isOpen = profileDropdown.getAttribute('data-dropdown-open') === 'true';
        if (isOpen) {
          closeProfileMenu();
        } else {
          openProfileMenu();
        }
      });

      // Close profile menu when clicking outside
      document.addEventListener('click', (event) => {
        const target = event.target;
        if (profileContainer && !profileContainer.contains(target)) {
          closeProfileMenu();
        }
      });

      // Keyboard navigation for profile menu
      profileToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          profileToggle.click();
        }
      });

      // Close profile menu when Escape is pressed
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          if (profileDropdown.getAttribute('data-dropdown-open') === 'true') {
            closeProfileMenu();
          }
        }
      });
    });
  `

  return Profile
}) satisfies QuartzComponentConstructor


