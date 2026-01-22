# Complete Ghost Migration to Railway

## Current State Analysis

### What's Working

- Railway Ghost + MySQL deployment is **online** (just activated)
- Live site: https://blog.refidao.com/ is serving content
- Railway project ID: `e826dec7-c9e6-44cf-bc0c-77df53289e97`
- Ghost Admin API key available: `6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f`

### What Exists in Repository

- [ghost-migration-guide.md](docs/ReFi-DAO-Infrastructure-Migration/ghost-migration/ghost-migration-guide.md) - General migration guide
- [ghost-migration.plan.md](docs/ReFi-DAO-Infrastructure-Migration/ghost-migration/ghost-migration.plan.md) - Original plan (outdated)
- `ReFi DAO Nov 18 2025.json` (42MB) - Ghost export file
- `node_modules/` with `jsonwebtoken` and `form-data` packages (for API scripts)

### What Was Previously Completed (from session history)

- Content import (posts, authors, tags)
- 223/251 images uploaded via API
- 8 posts had image references updated
- Various migration scripts created (but deleted)

### What Still Needs Verification/Completion

- Current deployment state (verify all content is there)
- Theme migration
- Settings and navigation
- DNS configuration
- Full testing and validation

---

## Phase 0: Setup Railway CLI Locally

### Task 0.1: Install Railway CLI

```bash
curl -fsSL https://railway.com/install.sh | sh
```

### Task 0.2: Link to Project

```bash
railway login
railway link -p e826dec7-c9e6-44cf-bc0c-77df53289e97
```

### Task 0.3: Verify Connection

```bash
railway status
railway logs
```

---

## Phase 1: Verify Current Deployment State

### Task 1.1: Test Ghost Admin Access

1. Access Ghost Admin: https://ghost-production-616f.up.railway.app/ghost
2. Verify login works
3. Check if initial setup is complete

### Task 1.2: Verify Content Migration

Run API checks to confirm:

- Post count matches export (should be ~100 posts)
- Tags are present (should be ~12 tags)
- Authors are present
- Images are loading in posts

### Task 1.3: Create Verification Script

Create a script to compare current state with export file:

```javascript
// verify-migration.js
// Check posts, tags, authors, and images against export
```

### Task 1.4: Document Current State

Create a status report documenting:

- What content exists
- What images are working
- What's missing

---

## Phase 2: Complete Image Migration (if needed)

### Task 2.1: Check Image Status

1. Visit several posts on the live site
2. Check if images are loading
3. Identify any broken image references

### Task 2.2: Re-create Image Scripts (if needed)

If images are missing, recreate:

- `extract-image-urls.js` - Extract URLs from export
- `download-ghost-images.js` - Download images
- `upload-ghost-images.js` - Upload to Railway Ghost (with JWT auth)
- `update-image-references.js` - Update post references

### Task 2.3: Run Image Migration (if needed)

```bash
node extract-image-urls.js "ReFi DAO Nov 18 2025.json"
node download-ghost-images.js
node upload-ghost-images.js
node update-image-references.js --dry-run
node update-image-references.js
```

---

## Phase 3: Theme Migration

### Task 3.1: Document Current Theme

1. Visit https://blog.refidao.com/
2. Take screenshots for reference
3. Note theme name and customizations

### Task 3.2: Export Theme from Old Instance (if available)

1. Access old Ghost admin (if still accessible)
2. Go to Settings → Design
3. Download theme ZIP

### Task 3.3: Import Theme to Railway Ghost

1. Go to https://ghost-production-616f.up.railway.app/ghost
2. Navigate to Settings → Design
3. Upload theme ZIP
4. Activate theme

### Task 3.4: Verify Theme

- Check homepage layout
- Check post pages
- Test responsive design (mobile/tablet/desktop)

---

## Phase 4: Settings & Configuration

### Task 4.1: General Settings

Configure in Ghost Admin:

- Site title: "ReFi DAO"
- Site description
- Site logo and icon
- Publication language
- Timezone

### Task 4.2: Navigation Menu

Recreate navigation structure:

- Roundups
- Deep Dives
- Event Retros
- Podcasts
- ReFi Radar
- Community Stories

### Task 4.3: Social Accounts

Configure social links:

- Portal link
- Contact link
- Any other social profiles

### Task 4.4: Code Injection

Add to Settings → Code Injection:**Site Header:**

- Analytics (Google Analytics, Plausible, etc.)
- Any custom tracking

**Site Footer:**

- Any custom scripts

### Task 4.5: Integrations

Set up integrations in Ghost Admin:

- Custom integrations
- Webhooks (if any)
- API keys for external services

---

## Phase 5: Testing & Validation

### Task 5.1: Content Testing

- [ ] All posts render correctly
- [ ] Images load properly
- [ ] Post formatting is correct
- [ ] Search functionality works
- [ ] Pagination works

### Task 5.2: RSS Feed Testing

Test: https://ghost-production-616f.up.railway.app/rss/

- Verify feed loads
- Check feed content
- Test in RSS reader

### Task 5.3: Performance Testing

- Check page load times
- Test from multiple locations
- Verify CDN/caching (if configured)

### Task 5.4: Cross-Browser Testing

Test on:

- Chrome
- Firefox
- Safari
- Mobile browsers

---

## Phase 6: DNS Cutover

### Task 6.1: Pre-Cutover Checklist

Verify before DNS change:

- [ ] All content migrated
- [ ] Theme applied
- [ ] Settings configured
- [ ] RSS feed working
- [ ] Performance acceptable

### Task 6.2: DNS Configuration

1. Get Railway's domain from project settings
2. Update DNS records for blog.refidao.com:

- Add CNAME record pointing to Railway domain
- Or update A record as needed

### Task 6.3: SSL Certificate

Railway auto-provisions SSL. Verify:

- HTTPS works
- Certificate is valid
- HTTP redirects to HTTPS

### Task 6.4: Post-Cutover Verification

After DNS propagation:

- Test https://blog.refidao.com
- Verify RSS: https://blog.refidao.com/rss/
- Check all functionality

---

## Phase 7: Cleanup & Documentation

### Task 7.1: Cancel Old Managed Ghost

1. Export final backup from old instance
2. Verify new instance is stable
3. Cancel subscription

### Task 7.2: Update Documentation

Update files:

- [ghost-migration.plan.md](docs/ReFi-DAO-Infrastructure-Migration/ghost-migration/ghost-migration.plan.md) - Mark as complete
- Create final migration report

### Task 7.3: Archive Migration Files

Keep for reference:

- Export JSON file
- Any scripts created
- Configuration notes

---

## Files to Create

| File | Purpose ||------|---------|| `verify-migration.js` | Check current deployment state || `CURRENT-STATUS.md` | Document current migration state || `extract-image-urls.js` | Extract image URLs (if needed) || `download-ghost-images.js` | Download images (if needed) || `upload-ghost-images.js` | Upload images with JWT auth (if needed) || `update-image-references.js` | Update post image URLs (if needed) |---

## Environment Variables Reference

For Ghost on Railway:

```javascript
NODE_ENV=production
url=https://blog.refidao.com
database__client=mysql
database__connection__host=${{MySQL.MYSQL_HOST}}
database__connection__port=${{MySQL.MYSQL_PORT}}
database__connection__user=${{MySQL.MYSQL_USER}}
database__connection__password=${{MySQL.MYSQL_PASSWORD}}
database__connection__database=${{MySQL.MYSQL_DATABASE}}
```

---

## Success Criteria

- [ ] Ghost running on Railway with all content
- [ ] All images loading correctly
- [ ] Theme matches original
- [ ] Navigation menu configured
- [ ] RSS feed working
- [ ] DNS pointing to Railway
- [ ] SSL certificate active