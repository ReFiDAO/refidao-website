# ReFi DAO Website Deployment Guide

This guide covers deployment options for both the **main site** (`refidao.com`) and the **documentation site** (`docs.refidao.com`).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    refidao.com                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Main Site (HTML/CSS/JS)                        │   │
│  │  - Homepage, About, Local Nodes, etc.           │   │
│  │  - Deployed to: Netlify / Vercel / GitHub Pages │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  docs.refidao.com                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Documentation Site (Quartz)                    │   │
│  │  - Knowledge base, guides, references           │   │
│  │  - Deployed to: GitHub Pages (separate repo)    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Main Site Deployment

### Option 1: Netlify (Recommended)

**Automatic Deployment:**

1. Connect your GitHub repository to Netlify
2. Netlify will auto-detect the `netlify.toml` configuration
3. Every push to `main` triggers a new deployment

**Manual Setup:**

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Select your GitHub repository
4. Configure build settings:
   - **Build command:** `npm run build:main`
   - **Publish directory:** `dist`
5. Click "Deploy site"

**Custom Domain:**

1. Go to Site settings → Domain management
2. Add custom domain: `refidao.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: @
   Value: your-site.netlify.app
   ```

### Option 2: Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect `vercel.json`
4. Click "Deploy"

**Custom Domain:**

1. Go to Project Settings → Domains
2. Add `refidao.com`
3. Configure DNS as instructed

### Option 3: GitHub Pages

**Using GitHub Actions:**

The workflow at `.github/workflows/deploy-main.yml` handles this automatically.

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to `main` branch

**Custom Domain:**

1. Create `CNAME` file in `dist/` with: `refidao.com`
2. Configure DNS:
   ```
   Type: A
   Name: @
   Values:
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
   ```

---

## Documentation Site Deployment

The documentation site uses Quartz and is built separately.

### GitHub Pages Setup

1. **Create a separate repository** (optional but recommended):
   - `ReFi-DAO/docs` for `docs.refidao.com`

2. **Configure Quartz** (`quartz.config.ts`):
   ```typescript
   const config: QuartzConfig = {
     configuration: {
       pageTitle: "ReFi DAO Documentation",
       baseUrl: "docs.refidao.com",
       // ... other settings
     }
   }
   ```

3. **Enable GitHub Pages:**
   - Go to Repository Settings → Pages
   - Source: GitHub Actions

4. **Configure DNS:**
   ```
   Type: CNAME
   Name: docs
   Value: refi-dao.github.io
   ```

### Manual Build

```bash
# Build documentation
npm run build:docs

# Preview locally
npm run serve:docs
```

---

## Environment Variables

### For GitHub Actions

Set these in Repository Settings → Secrets and variables → Actions:

| Variable | Description | Required For |
|----------|-------------|--------------|
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token | Netlify deploy |
| `NETLIFY_SITE_ID` | Your Netlify site ID | Netlify deploy |
| `VERCEL_TOKEN` | Vercel personal access token | Vercel deploy |
| `VERCEL_ORG_ID` | Vercel organization ID | Vercel deploy |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel deploy |

---

## Build Commands Reference

```bash
# Build main site for production
npm run build:main

# Build documentation site
npm run build:docs

# Preview main site locally
npm run dev

# Preview docs locally
npm run serve:docs
```

---

## File Structure After Build

```
dist/
├── index.html
├── about.html
├── local-nodes.html
├── community.html
├── resources-hub.html
├── 404.html
├── _redirects
├── styles/
│   ├── main.css
│   ├── design-tokens.css
│   ├── base.css
│   ├── components.css
│   ├── navigation.css
│   └── utilities.css
├── assets/
│   ├── favicon.png
│   ├── ReFi_DAO_Logo_White.svg
│   └── ...
└── refi-node-map/
    ├── assets/
    ├── nodes/
    ├── style.css
    └── script.js
```

---

## DNS Configuration Summary

For `refidao.com` (main site on Netlify):

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | your-site.netlify.app |
| CNAME | www | your-site.netlify.app |

For `docs.refidao.com` (documentation on GitHub Pages):

| Type | Name | Value |
|------|------|-------|
| CNAME | docs | refi-dao.github.io |

---

## Troubleshooting

### Build Failures

1. Check Node.js version (requires ≥20)
2. Ensure all dependencies are installed: `npm ci`
3. Check for path issues in HTML files

### 404 on Page Refresh

Ensure your hosting provider supports the redirects:
- Netlify: Check `_redirects` or `netlify.toml`
- Vercel: Check `vercel.json` rewrites
- GitHub Pages: Uses client-side routing

### Asset Loading Issues

1. Verify asset paths are correct for production
2. Check browser console for 404 errors
3. Ensure CORS headers are set for cross-origin assets

---

## Continuous Deployment

Both workflows trigger on:

- **Main Site:** Changes to `site/`, `assets/`, `refi-node-map/`
- **Documentation:** Changes to `content/`, `quartz/`, `quartz.config.ts`

To deploy manually:

1. Go to Actions tab in GitHub
2. Select the workflow
3. Click "Run workflow"

---

## Support

For deployment issues, contact the ReFi DAO development team or open an issue in the repository.
