# ReFi DAO Website Architecture

> **Version:** 2.0 (Website Revamp)  
> **Last Updated:** January 2026  
> **Status:** Implementation Phase

This document provides a comprehensive overview of the ReFi DAO website architecture following the revamp from Quartz-only to a dual-site structure.

---

## Table of Contents

1. [Overview](#overview)
2. [Site Structure](#site-structure)
3. [Navigation Architecture](#navigation-architecture)
4. [Design System](#design-system)
5. [Component Library](#component-library)
6. [Page Structure](#page-structure)
7. [Integration Points](#integration-points)
8. [Deployment Architecture](#deployment-architecture)
9. [Validation Checklist](#validation-checklist)

---

## Overview

### Architecture Philosophy

The ReFi DAO website follows a **dual-site architecture**:

1. **Main Site** (`refidao.com`) — Modern, interactive HTML/CSS/JS pages with the refi-node-map design language
2. **Documentation Site** (`docs.refidao.com`) — Quartz-based searchable documentation

This separation allows for:
- **Visual Impact**: Hero sections, animations, and interactive elements on the main site
- **Content Depth**: Full documentation, search, and tag systems on the docs site
- **Independent Deployment**: Different build and deployment pipelines
- **Unified Design**: Shared design tokens ensure visual consistency

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Vanilla JS (no framework) | Simplicity, performance, no build complexity for main site |
| CSS Custom Properties | Consistent theming, easy maintenance |
| refi-node-map integration | Proven component, unified visual language |
| Media as dropdown (not page) | Simplifies navigation, external content links |
| Railway for main site | Advanced hosting, better performance |
| GitHub Pages for docs | Simple static hosting, integrated with Quartz |

---

## Site Structure

### Directory Layout

```
ReFi-DAO-Website/
├── site/                          # Main site (NEW)
│   ├── pages/
│   │   ├── index.html             # Homepage
│   │   ├── about.html             # About page
│   │   ├── local-nodes.html       # Node map integration
│   │   ├── community.html         # Community landing
│   │   └── resources-hub.html     # Resources landing
│   ├── styles/
│   │   ├── design-tokens.css      # Color, spacing, typography
│   │   ├── base.css               # Reset, utilities
│   │   ├── components.css         # Reusable components
│   │   ├── navigation.css         # Nav-specific styles
│   │   └── main.css               # Import aggregator
│   ├── scripts/
│   │   ├── main.js                # Core functionality
│   │   └── navigation.js          # Nav component
│   └── assets/                    # Site-specific assets
│
├── refi-node-map/                 # Node map component (EXISTING)
│   ├── index.html                 # Standalone version
│   ├── style.css                  # Map styles
│   ├── script.js                  # Map functionality
│   └── nodes/                     # Node data
│
├── content/                       # Quartz content (EXISTING)
│   ├── index.md
│   ├── about/
│   ├── community/
│   ├── media/
│   └── resources-hub/
│
├── quartz/                        # Quartz framework (EXISTING)
├── quartz.config.ts               # Quartz configuration
├── quartz.layout.ts               # Quartz layout
│
├── assets/                        # Shared assets
├── ARCHITECTURE.md                # This document
└── package.json
```

---

## Navigation Architecture

### Primary Navigation Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]   About ▾   Local Nodes   Community ▾   Media ▾        │
│           Resources   Forum ↗                    [Join CTA]    │
└─────────────────────────────────────────────────────────────────┘
```

### Navigation Items

| Item | Type | Target | Notes |
|------|------|--------|-------|
| **About** | Dropdown | Internal | Mission, Network Structure, Team |
| **Local Nodes** | Direct Link | `/local-nodes` | Full map page |
| **Community** | Dropdown | Internal | Network Initiatives, Regen Coordination, ReFi Med |
| **Media** | Dropdown | External | Blog (blog.refidao.com), Podcast |
| **Resources** | Direct Link | `/resources-hub` | Landing page → docs.refidao.com |
| **Forum** | External Link | forum.refidao.com | External Discourse |

### Dropdown Menus

#### About Dropdown
- Mission & Vision → `/about`
- Network Structure → `/about#network-structure`
- Team → `/about#team`

#### Community Dropdown
- Network Initiatives → `/community/network-initiatives`
- *(divider)*
- Regen Coordination → `/community/regen-coordination`
- ReFi Mediterranean → `/community/refi-mediterranean`

#### Media Dropdown
- ReFi Blog → `blog.refidao.com` ↗
- ReFi Podcast → `podcast.refidao.com` ↗

### Mobile Navigation

- Hamburger menu toggle
- Full-screen overlay
- Accordion-style submenus
- Sticky CTA button

---

## Design System

### Color Palette

```css
/* Backgrounds */
--color-bg: #172027;
--color-bg-deep: #11181d;
--color-bg-deeper: #0b1015;

/* Text */
--color-text: #F1F0FF;
--color-text-muted: rgba(241, 240, 255, 0.6);

/* Accents */
--color-blue: #4571E1;
--color-green: #71E3BA;
--color-pink: #DE9AE9;
--color-yellow: #FFFA7E;

/* Borders */
--color-border: rgba(255, 255, 255, 0.08);
--color-border-hover: rgba(255, 255, 255, 0.12);
--color-border-active: rgba(113, 227, 186, 0.5);
```

### Typography

```css
/* Font Families */
--font-sans: 'Inter', sans-serif;
--font-heading: 'Space Grotesk', sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;

/* Font Sizes */
--text-hero: clamp(3rem, 8vw, 6rem);
--text-4xl: 2.5rem;
--text-2xl: 1.5rem;
--text-xl: 1.25rem;
--text-lg: 1.125rem;
--text-base: 0.875rem;
```

### Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Visual Elements

1. **Glassmorphism**
   ```css
   background: rgba(255, 255, 255, 0.03);
   backdrop-filter: blur(20px);
   border: 1px solid rgba(255, 255, 255, 0.08);
   ```

2. **Gradient Text**
   ```css
   background: linear-gradient(to right, #4571E1, #71E3BA, #4571E1);
   background-size: 200% auto;
   -webkit-background-clip: text;
   animation: textGradient 8s linear infinite;
   ```

3. **Noise Overlay**
   - SVG-based fractal noise
   - Mix-blend-mode: overlay
   - Opacity: 0.035

---

## Component Library

### Core Components

| Component | File | Description |
|-----------|------|-------------|
| `glass-card` | `components.css` | Glassmorphism container |
| `btn` | `components.css` | Button variants (primary, ghost, outline) |
| `pill-badge` | `components.css` | Category/status badges |
| `hero` | `components.css` | Hero section with ring animation |
| `modal` | `components.css` | Dialog overlay |
| `nav` | `navigation.css` | Navigation with dropdowns |
| `node-card` | `components.css` | Node display card |
| `stat-card` | `components.css` | Statistics display |

### Animation Classes

- `.fade-in-up` — Fade in from bottom
- `.fade-in-delay-1/2/3` — Staggered delays
- `.gradient-text` — Animated gradient text

### JavaScript Modules

| Module | Purpose |
|--------|---------|
| `Navigation` | Desktop dropdowns, mobile menu, scroll behavior |
| `ScrollAnimations` | Intersection observer animations |
| `StaggeredGrid` | Grid item reveal animations |
| `SmoothScroll` | Anchor link smooth scrolling |
| `CounterAnimation` | Number counting animation |
| `ParallaxEffect` | Scroll-based parallax |

---

## Page Structure

### Homepage (`/`)

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVIGATION                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    HERO SECTION                             │
│          [Ring Animation Background]                        │
│          ReFi DAO Badge                                     │
│          "A network society to regenerate the earth"        │
│          [Explore] [Find Nodes]                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    MAP PREVIEW                              │
│          Section header + Map image + CTA                   │
├─────────────────────────────────────────────────────────────┤
│                    STATS GRID                               │
│          [85+ Nodes] [45+ Countries] [5000+ Members]        │
├─────────────────────────────────────────────────────────────┤
│                    WHAT WE DO                               │
│          6x Feature cards (Sense-making, Education...)      │
├─────────────────────────────────────────────────────────────┤
│                    EXPLORE RESOURCES                        │
│          3x Resource cards (Hub, Community, Media)          │
├─────────────────────────────────────────────────────────────┤
│                    CTA SECTION                              │
│          "Join the Network" + 3 action buttons              │
├─────────────────────────────────────────────────────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

### Local Nodes (`/local-nodes`)

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVIGATION                           │
├─────────────────────────────────────────────────────────────┤
│                    HERO WITH MAP                            │
│          [Ring Animation Background]                        │
│          "ReFi Local Nodes"                                 │
│          [Interactive World Map]                            │
│          [Map pins, Tour, HUD]                              │
├─────────────────────────────────────────────────────────────┤
│                    NODE GRID                                │
│          [Filter pills] [Sort dropdown]                     │
│          [Node cards grid - 4 columns]                      │
├─────────────────────────────────────────────────────────────┤
│                    JOIN CTA                                 │
├─────────────────────────────────────────────────────────────┤
│                        FOOTER                               │
├─────────────────────────────────────────────────────────────┤
│                    NODE MODAL (dialog)                      │
└─────────────────────────────────────────────────────────────┘
```

### About (`/about`)

- Mission section
- Network Structure (3 cards: Global, Local Nodes, Initiatives)
- Values (4 icons)
- Team section
- CTA

### Community (`/community`)

- Network Initiatives (3 cards)
- Regen Coordination (description + CTA)
- ReFi Mediterranean (description + CTA)
- Local Nodes preview (stats + map link)
- Guilds & Working Groups (2 cards)

### Resources Hub (`/resources-hub`)

- Onboarding guides (3 cards)
- Core documents (link list)
- Toolkits (3 cards)
- Full docs CTA → docs.refidao.com

---

## Integration Points

### refi-node-map Integration

The node map is integrated as a component within the site:

```html
<!-- In local-nodes.html -->
<link rel="stylesheet" href="../../refi-node-map/style.css">
<script src="../../refi-node-map/nodes/nodes-data.js"></script>
<script src="../../refi-node-map/script.js"></script>
```

Key integration points:
- Map styles are loaded alongside main site styles
- Node data (nodes-data.js) loads before map script
- Map HTML structure is embedded in the hero section
- Modal dialogs work independently

### Quartz Documentation

- Deployed to `docs.refidao.com` subdomain
- Links from main site open in new tabs
- Consistent branding through Quartz theme customization
- Search functionality handled by Quartz

### External Services

| Service | Domain | Purpose |
|---------|--------|---------|
| Blog | blog.refidao.com | Ghost-based blog |
| Forum | forum.refidao.com | Discourse community |
| Docs | docs.refidao.com | Quartz documentation |

---

## Deployment Architecture

### Main Site (refidao.com)

```
┌─────────────────┐     ┌─────────────────┐
│   GitHub Repo   │────▶│    Railway      │
│   (push to main)│     │  (Static Host)  │
└─────────────────┘     └─────────────────┘
                               │
                               ▼
                        refidao.com
```

**Build Process:**
1. Push to main branch
2. GitHub Actions trigger
3. Railway auto-deploys static files
4. CDN cache invalidation

### Docs Site (docs.refidao.com)

```
┌─────────────────┐     ┌─────────────────┐
│   GitHub Repo   │────▶│  GitHub Pages   │
│   (push to main)│     │  (Quartz Build) │
└─────────────────┘     └─────────────────┘
                               │
                               ▼
                       docs.refidao.com
```

**Build Process:**
1. Push to main branch
2. GitHub Actions run Quartz build
3. Output to gh-pages branch
4. GitHub Pages serves content

### GitHub Actions Workflows

#### `deploy-main.yml`
```yaml
name: Deploy Main Site
on:
  push:
    branches: [main]
    paths:
      - 'site/**'
      - 'refi-node-map/**'
      - 'assets/**'
```

#### `deploy-docs.yml`
```yaml
name: Deploy Docs
on:
  push:
    branches: [main]
    paths:
      - 'content/**'
      - 'quartz/**'
      - 'quartz.config.ts'
```

---

## Validation Checklist

### Pre-Launch

- [ ] All pages load without console errors
- [ ] Navigation works on desktop and mobile
- [ ] refi-node-map integration functional
- [ ] External links open in new tabs
- [ ] Mobile menu opens/closes correctly
- [ ] Scroll animations trigger correctly
- [ ] Counter animations work
- [ ] Forms submit correctly (if any)
- [ ] Meta tags present on all pages
- [ ] Favicon appears correctly

### Design Verification

- [ ] Typography matches design system
- [ ] Colors match design tokens
- [ ] Spacing is consistent
- [ ] Glassmorphism effects render correctly
- [ ] Gradient text animates
- [ ] Noise overlay visible but subtle
- [ ] Ring animation on hero sections

### Responsive Testing

- [ ] Mobile (320px-480px)
- [ ] Tablet (768px-1024px)
- [ ] Desktop (1024px+)
- [ ] Large screens (1440px+)

### Accessibility

- [ ] Skip links present
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader tested

### Performance

- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] CSS/JS minified
- [ ] No render-blocking resources
- [ ] Lazy loading implemented

### SEO

- [ ] Meta descriptions on all pages
- [ ] Open Graph tags present
- [ ] Twitter card tags present
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Canonical URLs set

### Cross-Browser

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

## Future Considerations

1. **Component Framework**: Consider migrating to Astro for better DX while keeping static output
2. **CMS Integration**: Potential headless CMS for non-technical content updates
3. **i18n**: Multi-language support for global community
4. **Analytics**: Enhanced tracking with Plausible or similar privacy-focused tool
5. **PWA**: Service worker for offline access to key pages

---

*This document should be updated as the architecture evolves. Last significant update: January 2026 (Initial dual-site architecture).*
