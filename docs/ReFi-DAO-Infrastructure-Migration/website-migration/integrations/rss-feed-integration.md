# RSS Feed Integration Guide

## Overview

This guide covers integrating the Ghost blog RSS feed into the Quartz website to display latest blog posts on the Media page.

## RSS Feed Source

**Ghost Blog RSS Feed:** `https://blog.refidao.com/rss/`

Once Ghost is migrated to Railway/Render, the RSS feed will be available at this URL.

## Integration Options

### Option 1: Quartz RSS Plugin (Recommended)

Quartz has built-in RSS support. We can:

1. **Fetch RSS feed at build time**
2. **Generate static content pages** from RSS items
3. **Display latest posts** on Media page

### Option 2: Client-Side RSS Fetch

Use JavaScript to fetch and display RSS feed on the client side:

**Pros:**
- Always shows latest content
- No rebuild needed

**Cons:**
- Requires JavaScript
- May have CORS issues
- Slower initial load

### Option 3: GitHub Actions RSS Sync

Use GitHub Actions to periodically fetch RSS feed and generate markdown files:

**Pros:**
- Content version-controlled
- No client-side JavaScript needed
- Fast loading

**Cons:**
- Requires periodic updates
- Not real-time

## Recommended Implementation

### Step 1: Create RSS Fetch Script

Create `scripts/fetch-rss.js`:

```javascript
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();
const RSS_URL = 'https://blog.refidao.com/rss/';
const OUTPUT_DIR = path.join(__dirname, '../content/media/latest-posts');

async function fetchRSS() {
  try {
    const feed = await parser.parseURL(RSS_URL);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Generate markdown files for latest 10 posts
    feed.items.slice(0, 10).forEach((item, index) => {
      const slug = item.link.split('/').pop().replace(/\.html$/, '');
      const filename = `${index + 1}-${slug}.md`;
      
      const frontmatter = `---
title: "${item.title}"
date: "${item.pubDate}"
link: "${item.link}"
description: "${item.contentSnippet?.substring(0, 200) || ''}"
---

${item.content || item.contentSnippet || ''}

[Read more →](${item.link})
`;
      
      fs.writeFileSync(
        path.join(OUTPUT_DIR, filename),
        frontmatter
      );
    });
    
    console.log(`✅ Fetched ${feed.items.length} items, saved latest 10`);
  } catch (error) {
    console.error('Error fetching RSS:', error);
    process.exit(1);
  }
}

fetchRSS();
```

### Step 2: Add to package.json

```json
{
  "scripts": {
    "fetch-rss": "node scripts/fetch-rss.js",
    "build": "npm run fetch-rss && npx quartz build"
  },
  "dependencies": {
    "rss-parser": "^3.13.0"
  }
}
```

### Step 3: Create GitHub Actions Workflow

Create `.github/workflows/fetch-rss.yml`:

```yaml
name: Fetch RSS Feed

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  fetch-rss:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: Install dependencies
        run: npm install
      
      - name: Fetch RSS feed
        run: npm run fetch-rss
      
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add content/media/latest-posts/
          git diff --staged --quiet || git commit -m "Update latest blog posts from RSS feed"
          git push
```

### Step 4: Update Media Page

Update `content/media/index.md` to include latest posts:

```markdown
## Latest Content

{{ latest_posts }}

> View all posts at [blog.refidao.com](https://blog.refidao.com)
```

Or create a component that lists latest posts from the `latest-posts/` directory.

## Alternative: Simple RSS Display Component

If we want a simpler approach, create a Quartz component that fetches and displays RSS:

Create `quartz/components/RSSFeed.tsx`:

```typescript
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const RSSFeed: QuartzComponent = ({ cfg, fileData, allFiles }: QuartzComponentProps) => {
  // Fetch RSS feed and display latest posts
  // This would need to be implemented based on Quartz's component system
  return (
    <div class="rss-feed">
      <h3>Latest from the Blog</h3>
      {/* RSS items displayed here */}
    </div>
  )
}

export default (() => RSSFeed) satisfies QuartzComponentConstructor
```

## Testing

1. **Test RSS Feed:**
   ```bash
   curl https://blog.refidao.com/rss/
   ```

2. **Test Script:**
   ```bash
   npm run fetch-rss
   ```

3. **Verify Generated Files:**
   Check `content/media/latest-posts/` directory

4. **Test Build:**
   ```bash
   npm run build
   ```

## Troubleshooting

### RSS Feed Not Available

- Verify Ghost is deployed and accessible
- Check RSS feed URL is correct
- Verify Ghost RSS is enabled in settings

### CORS Issues

- Use server-side fetching (GitHub Actions)
- Or configure CORS on Ghost instance

### Build Errors

- Check RSS feed is accessible
- Verify markdown formatting
- Check file paths are correct

## Next Steps

1. Wait for Ghost migration to complete
2. Verify RSS feed URL
3. Implement chosen integration method
4. Test thoroughly
5. Deploy

---

**Last Updated:** January 2025  
**Status:** Ready for implementation after Ghost migration

