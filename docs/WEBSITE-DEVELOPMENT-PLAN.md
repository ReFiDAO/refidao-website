# ReFi DAO Website Development Plan

> **Master Plan for Website Development and Architecture**
> 
> This document serves as the canonical reference for the ReFi DAO website revamp, including architecture decisions, implementation phases, and success criteria.

## Overview

Transform the ReFi DAO Website from a Quartz-based documentation site into a modern, interactive, modular website architecture. The new site adopts the sleek design language from `refi-node-map` while maintaining Quartz for the documentation subdomain (`docs.refidao.com`).

## Current Status

| Phase | Status | Description |
|-------|--------|-------------|
| Foundation & Structure | ✅ Complete | Project structure, dual build system, GitHub Actions |
| Design System | ✅ Complete | Design tokens, colors, typography, CSS architecture |
| Component Library | ✅ Complete | Hero, glass-card, modal, button, node-card |
| Navigation | ✅ Complete | Glassmorphism topbar, responsive mobile menu |
| Homepage | ✅ Complete | Animated ring, gradient text, interactive sections |
| Node Map Integration | ✅ Complete | Full refi-node-map on /local-nodes |
| Additional Pages | ✅ Complete | About, Community, Resources Hub |
| Architecture Doc | ✅ Complete | ARCHITECTURE.md created |
| Docs Subdomain | ✅ Complete | Quartz configured |
| Styling Polish | ✅ Complete | Responsive design, accessibility |
| Testing & Deployment | ✅ Complete | GitHub Pages deployment |

## Architecture

### Site Structure

```
refidao.com (Main Site)
├── Modern interactive pages (custom HTML/CSS/JS)
│   ├── Homepage (hero + interactive sections)
│   ├── About
│   ├── Local Nodes (with integrated node map)
│   ├── Community (network initiatives, Regen Coordination, ReFi Med)
│   ├── Media (dropdown: Blog, Podcast)
│   └── Resources Hub (preview/landing)
└── docs.refidao.com (Quartz subdomain)
    └── Full documentation site (existing Quartz structure)
```

### Navigation Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  About▼  Local Nodes  Community▼  Media▼  Resources  │
└─────────────────────────────────────────────────────────────────┘
           │                      │          │
           ├─ Mission & Vision    │          ├─ ReFi Blog ↗
           ├─ Network Structure   │          └─ ReFi Podcast ↗
           └─ Team                │
                                  ├─ Network Initiatives
                                  ├─ Regen Coordination
                                  └─ ReFi Mediterranean
```

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#172027` | Primary background |
| `--color-bg-deep` | `#11181d` | Deeper sections |
| `--color-text` | `#F1F0FF` | Primary text |
| `--color-text-muted` | `rgba(241, 240, 255, 0.6)` | Secondary text |
| `--color-blue` | `#4571E1` | Primary accent |
| `--color-green` | `#71E3BA` | Secondary accent |
| `--color-pink` | `#DE9AE9` | Tertiary accent |

### Typography

| Font | Usage |
|------|-------|
| **Inter** | Body text, paragraphs, UI elements |
| **Space Grotesk** | Headings, titles, display text |

### Key Design Patterns

#### Glassmorphism Cards

```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}
```

#### Gradient Text

```css
.gradient-text {
  background: linear-gradient(to right, #4571E1, #71E3BA, #4571E1);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: textGradient 8s linear infinite;
}
```

#### Noise Overlay

```css
.bg-noise {
  position: fixed;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,...");
  mix-blend-mode: overlay;
}
```

## File Structure

```
ReFi-DAO-Website/
├── site/                          # Main site
│   ├── pages/
│   │   ├── index.html            # Homepage
│   │   ├── about.html            # About page
│   │   ├── local-nodes.html      # Node map page
│   │   ├── community.html        # Community page
│   │   └── resources-hub.html    # Resources landing
│   ├── styles/
│   │   ├── design-tokens.css     # Variables
│   │   ├── base.css              # Reset, base
│   │   ├── components.css        # Components
│   │   ├── navigation.css        # Topbar
│   │   └── utilities.css         # Helpers
│   ├── scripts/
│   │   ├── main.js               # Main logic
│   │   └── navigation.js         # Nav behavior
│   └── assets/                   # Images, logos
├── refi-node-map/                # Integrated map
│   ├── nodes/                    # Node data
│   ├── assets/                   # Map assets
│   ├── script.js                 # Map logic
│   └── style.css                 # Map styles
├── content/                      # Quartz content
├── quartz/                       # Quartz framework
├── docs/                         # Project docs
├── .github/workflows/            # CI/CD
├── ARCHITECTURE.md               # Architecture ref
├── DEPLOYMENT.md                 # Deploy guide
└── package.json                  # Dependencies
```

## Implementation Phases

### Phase 1: Foundation & Architecture ✅

- [x] Create site/ directory structure
- [x] Set up dual build system (main site + Quartz)
- [x] Configure GitHub Actions workflows
- [x] Extract design tokens from refi-node-map

### Phase 2: Navigation & Header ✅

- [x] Adapt Navigation component with glassmorphism
- [x] Implement responsive mobile menu
- [x] Add dropdown functionality
- [x] Fixed topbar with scroll effects

### Phase 3: Homepage Development ✅

- [x] Hero section with animated ring
- [x] Gradient text headlines
- [x] Interactive node map preview
- [x] Resource cards grid
- [x] Join CTA section

### Phase 4: Node Map Integration ✅

- [x] Extract refi-node-map as component
- [x] Create /local-nodes page
- [x] Integrate tour functionality
- [x] Add filtering and sorting UI

### Phase 5: Additional Pages ✅

- [x] About page (mission, network structure)
- [x] Community page (initiatives, Regen Coordination, ReFi Med)
- [x] Resources Hub landing page
- [x] Media dropdown in navigation

### Phase 6: Documentation ✅

- [x] Create ARCHITECTURE.md
- [x] Create DEPLOYMENT.md
- [x] Update README.md
- [x] Create this development plan

### Phase 7: Styling & Polish ✅

- [x] Responsive design (mobile-first)
- [x] Animations and transitions
- [x] Accessibility improvements
- [x] Utility CSS classes

### Phase 8: Deployment ✅

- [x] GitHub Pages workflow
- [x] Netlify configuration
- [x] Vercel configuration
- [x] Production build script

## Technical Stack

### Main Site

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic markup |
| CSS3 | Custom properties, Grid, Flexbox |
| Vanilla JavaScript | No framework dependencies |
| GitHub Actions | CI/CD |
| GitHub Pages | Hosting |

### Documentation Site

| Technology | Purpose |
|------------|---------|
| Quartz 4 | Static site generator |
| Markdown | Content format |
| TypeScript | Configuration |
| GitHub Pages | Hosting (subdomain) |

## Success Criteria

- [x] Modern, interactive homepage with refi-node-map styling
- [x] Fully integrated node map on `/local-nodes` page
- [x] Community page with network initiatives
- [x] Media dropdown in navigation
- [x] Responsive navigation with glassmorphism
- [x] ARCHITECTURE.md created
- [x] Mobile-responsive design
- [x] Cross-browser compatibility
- [x] GitHub Pages deployment
- [ ] Performance: Lighthouse score > 90
- [ ] Custom domain configuration (refidao.com)
- [ ] docs.refidao.com subdomain live

## Future Enhancements

### Short-term

- [ ] Custom domain setup (refidao.com)
- [ ] Docs subdomain (docs.refidao.com)
- [ ] SEO optimization (meta tags, structured data)
- [ ] Performance optimization (image compression, lazy loading)

### Medium-term

- [ ] Newsletter signup integration
- [ ] Community forum integration
- [ ] Node application form
- [ ] Initiative submission form

### Long-term

- [ ] User authentication for members
- [ ] Dashboard for node coordinators
- [ ] Analytics integration
- [ ] Localization (multi-language)

## Deployment

### GitHub Pages (Current)

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
```

The workflow:
1. Builds the main site
2. Transforms paths for GitHub Pages
3. Creates 404 page
4. Deploys to GitHub Pages

### Alternative Platforms

| Platform | Config File | Notes |
|----------|-------------|-------|
| Netlify | `netlify.toml` | Clean URLs, redirects |
| Vercel | `vercel.json` | Edge functions available |

## References

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Detailed site architecture
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment instructions
- [refi-node-map](https://github.com/ReFiDAO/refi-node-map) - Original map component

---

*Last updated: January 2026*
*Document owner: ReFi DAO Development Team*
