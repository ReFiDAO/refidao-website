# Testing & Validation Guide

## Overview

This guide covers comprehensive testing of the migrated Ghost instance before DNS cutover.

## Prerequisites

- Railway Ghost deployment: https://ghost-production-616f.up.railway.app
- Access to Ghost admin
- Browser DevTools access
- Multiple devices/browsers for testing

## Phase 1: Content Testing

### Task 1.1: Post Verification

1. **Check Post Count**
   ```bash
   node verify-migration.js
   ```
   - Should show 243/243 posts ✅

2. **Spot Check Random Posts**
   - Visit 10-20 random posts
   - Verify content renders correctly
   - Check formatting (headings, lists, links)
   - Verify images load (after image migration)

3. **Check Post URLs/Slugs**
   - Verify URLs match expected format
   - Check slugs are correct
   - Test post pagination

### Task 1.2: Image Verification

1. **Check Feature Images**
   ```bash
   node check-image-status.js
   ```
   - Verify images point to new domain
   - Check image accessibility

2. **Test Image Loading**
   ```bash
   node test-image-access.js
   ```
   - Should show images accessible
   - Fix any 404 errors

3. **Visual Inspection**
   - Visit posts with images
   - Verify images display correctly
   - Check image sizing and alignment

### Task 1.3: Author & Tag Verification

1. **Check Authors**
   - Visit author pages
   - Verify author profiles
   - Check author post counts

2. **Check Tags**
   - Visit tag pages
   - Verify tag post counts
   - Check tag descriptions

## Phase 2: RSS Feed Testing

### Task 2.1: RSS Feed Access

```bash
node test-rss-feed.js
```

1. **Manual Test**
   - Visit: https://ghost-production-616f.up.railway.app/rss/
   - Verify feed loads
   - Check feed format (XML)

2. **RSS Reader Test**
   - Add feed to RSS reader (Feedly, etc.)
   - Verify feed parses correctly
   - Check recent posts appear

3. **Feed Content**
   - Verify all posts in feed
   - Check post titles and descriptions
   - Verify post links work

## Phase 3: Functionality Testing

### Task 3.1: Search Functionality

1. **Test Search**
   - Use search bar on site
   - Search for keywords
   - Verify results appear
   - Check search relevance

2. **Search Performance**
   - Test search speed
   - Check for errors
   - Verify pagination works

### Task 3.2: Navigation

1. **Menu Items**
   - Test all navigation links
   - Verify links work
   - Check active states

2. **Breadcrumbs**
   - Verify breadcrumb navigation
   - Check hierarchy

### Task 3.3: Pagination

1. **Post Pagination**
   - Test pagination on homepage
   - Test pagination on tag pages
   - Test pagination on author pages
   - Verify page numbers work

## Phase 4: Performance Testing

### Task 4.1: Page Load Times

1. **Homepage**
   - Test homepage load time
   - Target: < 3 seconds
   - Check Lighthouse score

2. **Post Pages**
   - Test post page load times
   - Check image loading
   - Verify lazy loading works

3. **Tools**
   - Use Google PageSpeed Insights
   - Use Lighthouse
   - Use WebPageTest

### Task 4.2: Image Performance

1. **Image Optimization**
   - Check image sizes
   - Verify image formats (WebP, etc.)
   - Test image CDN (if configured)

2. **Lazy Loading**
   - Verify images load on scroll
   - Check performance impact

## Phase 5: Cross-Browser Testing

### Task 5.1: Desktop Browsers

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Task 5.2: Mobile Browsers

Test on:
- [ ] iOS Safari
- [ ] Chrome Mobile
- [ ] Firefox Mobile

### Task 5.3: Responsive Design

Test breakpoints:
- [ ] Mobile (320px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)

## Phase 6: SEO & Analytics

### Task 6.1: SEO Verification

1. **Meta Tags**
   - Check meta descriptions
   - Verify Open Graph tags
   - Check Twitter Card tags

2. **Structured Data**
   - Verify JSON-LD schema
   - Check breadcrumb schema
   - Test with Google Rich Results

3. **Canonical URLs**
   - Verify canonical tags
   - Check for duplicate content

### Task 6.2: Analytics

1. **Google Analytics**
   - Verify tracking code loads
   - Test events fire
   - Check real-time data

2. **Other Analytics**
   - Verify Plausible (if used)
   - Check other tracking

## Phase 7: Email & Notifications

### Task 7.1: Email Configuration

1. **Test Email Delivery**
   - Send test email from Ghost
   - Verify email arrives
   - Check email formatting

2. **Newsletter**
   - Test newsletter signup
   - Verify confirmation emails
   - Check subscription management

## Testing Checklist

### Content
- [ ] All 243 posts migrated
- [ ] Images loading correctly
- [ ] Authors present
- [ ] Tags present
- [ ] Post formatting correct

### Functionality
- [ ] RSS feed working
- [ ] Search working
- [ ] Navigation working
- [ ] Pagination working

### Performance
- [ ] Page load < 3 seconds
- [ ] Images optimized
- [ ] Lighthouse score > 90

### Cross-Browser
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works
- [ ] Mobile works

### SEO
- [ ] Meta tags present
- [ ] Open Graph working
- [ ] Canonical URLs correct

## Running Tests

```bash
# Content verification
node verify-migration.js

# Image status
node check-image-status.js
node test-image-access.js

# RSS feed
node test-rss-feed.js
```

## Notes

- Document any issues found
- Fix critical issues before DNS cutover
- Keep testing log for reference
