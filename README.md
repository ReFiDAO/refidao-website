# ReFi DAO Website

Official website for ReFi DAO - A network society to regenerate the earth.

Built with [Quartz](https://quartz.jzhao.xyz/) static site generator.

## About

ReFi DAO is a network society focused on developing strategic services and public goods for the Regenerative Finance ecosystem. Our services include sense-making, education, opportunity development, fundraising support, onboarding and empowerment.

## Development

### Prerequisites

- Node.js v22+ (see `.node-version` for the specific version)
- npm v10.9.2+

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx quartz build --serve
```

The site will be available at `http://localhost:8080`

### Build for Production

```bash
npx quartz build
```

## Project Structure

```
ReFi-DAO-Website/
├── content/                    # Markdown content files
│   ├── index.md               # Homepage
│   ├── about/                 # About ReFi DAO
│   ├── resources-hub/        # Resources Hub (migrated from regencoordination.xyz/refidao)
│   ├── community/
│   │   ├── local-nodes.md    # Interactive map of local nodes
│   │   ├── guilds/           # Online guilds
│   │   └── working-groups/   # Working groups
│   ├── media/                # Media hub
│   └── nodes/                # Links to federated local node repos
├── assets/                    # Static assets
│   ├── images/               # Images
│   └── media/                # Media files
├── quartz/                    # Quartz framework files
├── quartz.config.ts          # Quartz configuration
└── package.json              # Dependencies
```

## Deployment

The site is automatically deployed via GitHub Actions when changes are pushed to the `main` branch.

- **GitHub Pages:** https://refidao.com
- **Repository:** https://github.com/ReFiDAO/ReFi-DAO-Website

## Migration Status

- ✅ Phase 0: Current Website Documentation
- ✅ Phase 0.5: Repository Setup & Organization
- ✅ Phase 1: Webflow Fix (Complete)
- 🚧 Phase 2: Content Extraction & Organization (In Progress)
- ⏳ Phase 3: Feature Implementation (RSS, Newsletter)
- ⏳ Phase 4: Design & Styling
- ⏳ Phase 5: Deployment
- ⏳ Phase 6: Content Migration
- ⏳ Phase 7: SEO & Performance

## Infrastructure Migrations

This repository includes comprehensive migration guides and documentation for ReFi DAO's infrastructure consolidation:

- **Website Migration:** Softr/Webflow → Quartz (in progress)
- **Ghost Migration:** Managed → Railway/Render (guides ready)
- **Airtable Migration:** Paid → NocoDB (guides and scripts ready)
- **Notion Migration:** Regen Coordination → ReFi DAO workspace ✅ Complete

See `docs/ReFi-DAO-Infrastructure-Migration/` for complete migration guides and `MIGRATION-STATUS.md` for progress tracking.

## ReFi DAO 3.0 Planning

**Status:** In Progress  
**Location:** `docs/refi-dao-3.0/`

Comprehensive planning and documentation for ReFi DAO's transition from 2.0 to 3.0, including:

- **Current State Assessment:** Complete status of ReFi DAO 2.0 achievements and infrastructure
- **Closure Checklist:** Tasks needed to complete ReFi DAO 2.0 transition
- **Vision & Strategic Models:** Five alternative strategic models for network validation
- **Implementation Plan:** Step-by-step roadmap with network validation process

**Key Documents:**
- [Planning Overview](docs/refi-dao-3.0/README.md)
- [Current State](docs/refi-dao-3.0/current-state.md)
- [Closure Checklist](docs/refi-dao-3.0/closure-checklist.md)
- [Vision & Strategic Models](docs/refi-dao-3.0/vision-strategic-models.md)
- [Implementation Plan](docs/refi-dao-3.0/implementation-plan.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this project.

## License

[Add license information]

## Contact

For questions or contributions, contact us at [community@refidao.com](mailto:community@refidao.com)
