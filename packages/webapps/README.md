# Webapps Package

This package provides the foundation for building and embedding micro-apps into your Quartz site.

## Contents

- `apps/`: Micro-applications
  - `refi-orbifier/`: ReFi Orbifier - Transform your PFP with the ReFi orb
    - **Repository:** [https://github.com/ReFiDAO/refi-orbifier](https://github.com/ReFiDAO/refi-orbifier)
    - **Type:** Git submodule
    - **Access:** `/apps/refi-orbifier/index.html`

## ReFi Orbifier

A micro-app that allows users to "orbify" their profile picture by removing the background and replacing it with a glowing ReFi orb gradient.

### Features

- API Key Management: Store remove.bg API key in localStorage
- Image Upload: Support drag-and-drop and file browsing (PNG, JPG, WEBP)
- Background Removal: Integration with remove.bg API
- Orbification: Process the background-less image with a radial ReFi gradient
- Export: Download the result as a PNG
- Social Sharing: Quick link to share on X (Twitter)

### Updating the Submodule

To update refi-orbifier to the latest version:

```bash
git submodule update --remote packages/webapps/apps/refi-orbifier
```

### Adding New Apps

To add a new micro-app:

1. Create a new directory under `apps/`
2. Add your app files (index.html, styles, scripts)
3. Link from content pages: `[App Name](/apps/app-name/index.html)`
