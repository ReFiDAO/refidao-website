# ReFi DAO Website

Official website for ReFi DAO - A network society to regenerate the earth.

🌐 **Live Site:** https://refidao.github.io/ReFi-DAO-Website/

## Architecture Overview

The ReFi DAO website uses a **dual architecture**:

```
refidao.com (Main Site)
├── Modern interactive pages (HTML/CSS/JS)
│   ├── Homepage (hero + animated ring + glassmorphism)
│   ├── About (mission, network structure)
│   ├── Local Nodes (integrated refi-node-map)
│   ├── Community (initiatives, Regen Coordination, ReFi Med)
│   └── Resources Hub (landing page)
│
└── docs.refidao.com (Future)
    └── Quartz-based documentation site
```

### Design System

The site uses a cohesive design system extracted from `refi-node-map`:

- **Colors:** Dark theme (`#172027`), accent blues/greens (`#4571E1`, `#71E3BA`)
- **Typography:** Inter (body), Space Grotesk (headings)
- **Effects:** Glassmorphism, gradient text, noise texture overlays
- **Components:** Glass cards, animated buttons, responsive navigation

## Project Structure

```
ReFi-DAO-Website/
├── site/                      # Main site source
│   ├── pages/                 # HTML pages
│   │   ├── index.html        # Homepage
│   │   ├── about.html        # About page
│   │   ├── local-nodes.html  # Interactive node map
│   │   ├── community.html    # Community page
│   │   └── resources-hub.html
│   ├── styles/               # CSS architecture
│   │   ├── design-tokens.css # Colors, typography, spacing
│   │   ├── base.css          # Reset, base styles
│   │   ├── components.css    # Reusable components
│   │   ├── navigation.css    # Topbar & mobile menu
│   │   └── utilities.css     # Utility classes
│   ├── scripts/              # JavaScript
│   │   ├── main.js
│   │   └── navigation.js
│   └── assets/               # Images, logos
├── refi-node-map/            # Integrated node map component
│   ├── nodes/                # Node data and profiles
│   ├── assets/               # Map assets
│   ├── script.js             # Map functionality
│   └── style.css             # Map styles
├── content/                  # Quartz documentation content
├── quartz/                   # Quartz framework
├── docs/                     # Project documentation
│   └── WEBSITE-DEVELOPMENT-PLAN.md
├── .github/workflows/        # CI/CD
│   └── deploy.yml           # GitHub Pages deployment
├── ARCHITECTURE.md           # Site architecture reference
├── DEPLOYMENT.md             # Deployment guide
├── netlify.toml              # Netlify configuration
└── vercel.json               # Vercel configuration
```

## Development

### Prerequisites

- Node.js v20+ (v22 recommended)
- npm v10.9.2+

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the main site locally:**
   ```bash
   # Using Python (simple)
   cd . && python3 -m http.server 8080
   # Then visit: http://localhost:8080/site/pages/index.html
   
   # Or using npm serve
   npm run dev
   ```

3. **Start Quartz docs (for content editing):**
   ```bash
   npx quartz build --serve
   ```

### Build for Production

```bash
# Build main site
npm run build:main

# Build Quartz docs
npm run build:docs
```

## Deployment

### GitHub Pages (Current)

The site automatically deploys to GitHub Pages via GitHub Actions:

- **Trigger:** Push to `main` branch
- **Workflow:** `.github/workflows/deploy.yml`
- **URL:** https://refidao.github.io/ReFi-DAO-Website/

### Alternative Deployment Options

| Platform | Configuration | Command |
|----------|--------------|---------|
| Netlify | `netlify.toml` | Connect repo, auto-detects |
| Vercel | `vercel.json` | Connect repo, auto-detects |

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Key Features

### Interactive Node Map

The Local Nodes page integrates `refi-node-map` with:
- Interactive dot-map visualization
- Tour mode for exploring nodes
- Node filtering and sorting
- Profile modals with rich content

### Responsive Design

- Mobile-first approach
- Hamburger menu for mobile navigation
- Touch-friendly interactions
- Optimized for all screen sizes

### Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Site structure, components, design decisions |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deployment guides for all platforms |
| [docs/WEBSITE-DEVELOPMENT-PLAN.md](docs/WEBSITE-DEVELOPMENT-PLAN.md) | Master development plan and roadmap |

## Migration Status

- ✅ Main site architecture (site/)
- ✅ Design system implementation
- ✅ Navigation with glassmorphism
- ✅ Homepage with animated ring
- ✅ Local Nodes with refi-node-map
- ✅ About, Community, Resources Hub pages
- ✅ GitHub Pages deployment
- 🚧 docs.refidao.com subdomain setup
- ⏳ Custom domain configuration

## Related Repositories

- **refi-node-map:** Integrated into this repository
- **Quartz:** Documentation framework (upstream)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

[Add license information]

## Contact

- **Website:** https://refidao.com
- **Email:** community@refidao.com
- **Twitter:** [@ReFiDAOist](https://twitter.com/ReFiDAOist)
- **Discord:** [ReFi DAO Discord](https://discord.gg/refidao)
