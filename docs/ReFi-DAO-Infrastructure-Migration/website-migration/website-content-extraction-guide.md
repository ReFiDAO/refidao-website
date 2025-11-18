# Website Content Extraction Guide

## Overview

This guide covers extracting all content from the current Softr/Webflow site and migrating it to the Quartz static site generator.

## Prerequisites

- Access to current website (refidao.com)
- Access to Softr/Webflow admin (if available)
- Screenshot tool
- Text extraction tools
- Markdown editor

## Content to Extract

### Pages to Extract

1. **Homepage** (`/`)
2. **About** (`/about`)
3. **Media** (`/media`)
4. **Community** (`/community`)
   - Overview
   - Local Nodes
   - Guilds
   - Working Groups
5. **Resources Hub** (already partially migrated)

### Content Types

- Text content
- Images and media files
- Links and references
- Metadata (titles, descriptions)
- Structure and hierarchy

## Extraction Process

### Step 1: Create Content Inventory

Create a spreadsheet tracking:
- Page URL
- Page title
- Content sections
- Images/assets
- Links
- Status (extracted/not extracted)

### Step 2: Extract Text Content

**For Each Page:**

1. **Manual Extraction:**
   - Open page in browser
   - Copy text sections
   - Paste into Markdown file
   - Preserve structure (headings, lists, etc.)

2. **Automated Extraction (if possible):**
   - Use browser DevTools to inspect HTML
   - Extract text content programmatically
   - Clean up HTML tags

3. **Screenshot Reference:**
   - Take full-page screenshots
   - Save in `docs/migrations/screenshots/`
   - Reference in extraction notes

### Step 3: Download Assets

**Images:**
- Right-click → Save image
- Organize by page: `assets/images/{page-name}/`
- Rename descriptively
- Note original URLs

**Media Files:**
- Download videos (if hosted)
- Download PDFs
- Download other media files
- Organize in `assets/media/`

### Step 4: Convert to Markdown

**Markdown Structure:**

```markdown
---
title: "Page Title"
description: "Page description"
---

# Page Title

Content here...

## Section Heading

More content...

![Image Alt Text](assets/images/page-name/image.png)
```

**Quartz Content Structure:**

```
content/
├── index.md (homepage)
├── about/
│   └── index.md
├── media/
│   └── index.md
├── community/
│   ├── index.md
│   ├── local-nodes.md
│   ├── guilds/
│   │   └── index.md
│   └── working-groups/
│       └── index.md
└── resources-hub/ (already exists)
```

### Step 5: Extract Specific Pages

#### Homepage (`content/index.md`)

**Sections to Extract:**
- Hero section text
- Mission statement
- Feature grid (6 items)
- Network structure callout
- Explore section (4 cards)
- Join CTA section

**Current Status:** Already has basic structure, needs content refinement

#### About Page (`content/about/index.md`)

**Sections to Extract:**
1. Mission Statement
2. Ambition section
3. Opportunity of a Just Transition
4. Capital Flows & Coordination
5. Subscription CTA

**Reference:** See `251001 ReFi DAO/website/content-inventory.md` for full content

#### Media Page (`content/media/index.md`)

**Sections to Extract:**
- Header & tagline
- Listen/Watch cards
- Latest content feed (RSS integration)
- Community CTA
- Contributor gallery
- Newsletter sign-up

**Note:** Content feed should integrate with Ghost RSS feed

#### Community Pages

**Local Nodes** (`content/community/local-nodes.md`):
- Extract node descriptions
- Update JSON data file (`content/community/local-nodes.json`)
- Preserve interactive map functionality

**Guilds** (`content/community/guilds/index.md`):
- List of guilds
- Descriptions
- Links

**Working Groups** (`content/community/working-groups/index.md`):
- List of working groups
- Descriptions
- Links

### Step 6: Handle Dynamic Content

**Content Feed:**
- Set up RSS feed integration from Ghost blog
- Use Quartz RSS plugin
- Display latest posts automatically

**Newsletter:**
- Integrate external service (Tally/Mailchimp)
- Add signup form component
- Link to service

**Social Media:**
- Embed social feeds if needed
- Link to social profiles
- Use social media embeds

### Step 7: Update Links

**Internal Links:**
- Update all internal links to Quartz paths
- Use relative paths: `[[about/index]]` or `/about/`
- Test all links work

**External Links:**
- Verify all external links still work
- Update broken links
- Document link changes

### Step 8: Metadata Extraction

**For Each Page:**
- Extract page title
- Extract meta description
- Extract Open Graph images
- Extract keywords (if any)

**Add to Frontmatter:**

```markdown
---
title: "Page Title"
description: "Meta description"
tags: [tag1, tag2]
---
```

## Extraction Tools

### Browser Extensions

- **SingleFile:** Save complete webpage as single HTML file
- **Web Scraper:** Extract structured data
- **Copy All URLs:** Extract all links from page

### Command Line Tools

**wget/curl:**
```bash
# Download entire site (be careful with this)
wget --mirror --convert-links --adjust-extension --page-requisites --no-parent https://refidao.com
```

**Puppeteer/Playwright:**
- Automated browser scripting
- Extract content programmatically
- Take screenshots

### Manual Tools

- Browser DevTools (Inspect Element)
- Text editors (VS Code, etc.)
- Markdown editors

## Content Organization

### File Naming

- Use kebab-case: `local-nodes.md`
- Index files: `index.md` for directories
- Descriptive names: `about-refi-dao.md` not `page1.md`

### Directory Structure

```
content/
├── index.md
├── about/
│   └── index.md
├── media/
│   └── index.md
├── community/
│   ├── index.md
│   ├── local-nodes.md
│   ├── local-nodes.json
│   ├── guilds/
│   │   └── index.md
│   └── working-groups/
│       └── index.md
└── resources-hub/
    └── (already exists)
```

### Asset Organization

```
assets/
├── images/
│   ├── homepage/
│   ├── about/
│   ├── media/
│   └── community/
└── media/
    ├── videos/
    └── pdfs/
```

## Quality Checklist

For each extracted page:

- [ ] All text content extracted
- [ ] Structure preserved (headings, lists)
- [ ] Images downloaded and linked
- [ ] Links updated and tested
- [ ] Metadata added (frontmatter)
- [ ] Markdown formatting correct
- [ ] Screenshot taken for reference
- [ ] Content reviewed for accuracy

## Common Issues

### Missing Content

- Check if content is dynamically loaded (JavaScript)
- Use browser DevTools to inspect
- May need to extract from source code

### Broken Images

- Verify image URLs
- Download and host locally
- Update image paths

### Formatting Issues

- Clean up HTML artifacts
- Fix markdown syntax
- Test rendering in Quartz

## Next Steps After Extraction

1. **Content Review:**
   - Review all extracted content
   - Fix formatting issues
   - Update outdated information

2. **Integration:**
   - Set up RSS feed integration
   - Configure newsletter service
   - Add social media embeds

3. **Enhancement:**
   - Add missing content
   - Improve structure
   - Enhance with Quartz features

4. **Testing:**
   - Build site locally
   - Test all pages
   - Verify all links
   - Check responsive design

## Timeline Estimate

- Content inventory: 1 day
- Text extraction: 2-3 days
- Asset download: 1 day
- Markdown conversion: 2-3 days
- Link updates: 1 day
- Quality review: 1-2 days
- **Total: 1-2 weeks**

## Reference Documents

- `251001 ReFi DAO/website/content-inventory.md` - Full content inventory
- `251001 ReFi DAO/website/website-audit.md` - Page-by-page audit
- `251001 ReFi DAO/website/asset-list.md` - Asset catalog

---

**Last Updated:** January 2025  
**Status:** Ready for implementation

