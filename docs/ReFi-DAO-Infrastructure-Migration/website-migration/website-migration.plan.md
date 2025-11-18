<!-- website-migration-plan-001 -->
# Website Migration Plan - Softr/Webflow → Quartz

## Goal

Migrate the ReFi DAO website from Softr/Webflow to Quartz static site generator, hosted on GitHub Pages. This migration simplifies functionality while preserving core content, improves performance, eliminates hosting costs, and enables integration with Ghost blog RSS feed.

## Overview

**Status:** Phase 1 Complete, Phase 2-6 Pending  
**Migration:** Softr/Webflow → Quartz Static Site Generator  
**Timeline:** 1-2 weeks remaining  
**Cost Savings:** ~$50/month

### Current State
- **Source:** Softr/Webflow site at refidao.com
- **Phase 1:** ✅ Complete (Webflow fix - removed user accounts, deleted defunct pages, created MVP)
- **Phase 2:** 🚧 In Progress (Content extraction)
- **Phases 3-6:** ⏳ Pending

### Target State
- **Platform:** Quartz static site generator
- **Hosting:** GitHub Pages (free)
- **Domain:** refidao.com (custom domain)
- **Features:** Static content, RSS integration, newsletter signup, improved performance

## Process

### Phase 1: Webflow Fix ✅ COMPLETE

**Completed Tasks:**
- [x] Remove user account/signup functionality
- [x] Delete defunct pages (events, guilds, working groups)
- [x] Preserve core pages (about, media, community)
- [x] Create working MVP site
- [x] Document current state

**Status:** Successfully completed. Site is now a working MVP without authentication requirements.

### Phase 2: Content Extraction 🚧 IN PROGRESS

**Tasks:**
- [ ] Create content inventory spreadsheet
- [ ] Extract homepage content
- [ ] Extract about page content
- [ ] Extract media page content
- [ ] Extract community pages content
- [ ] Download all images and assets
- [ ] Take reference screenshots
- [ ] Document all links

**Reference:** See [website-content-extraction-guide.md](website-content-extraction-guide.md)

### Phase 3: Markdown Conversion

**Tasks:**
- [ ] Convert homepage to Markdown
- [ ] Convert about page to Markdown
- [ ] Convert media page to Markdown
- [ ] Convert community pages to Markdown
- [ ] Organize files in Quartz structure
- [ ] Add frontmatter metadata
- [ ] Fix markdown formatting

**Target Structure:**
```
content/
├── index.md (homepage)
├── about/
│   └── index.md
├── media/
│   └── index.md
└── community/
    ├── index.md
    ├── local-nodes.md
    ├── guilds/
    └── working-groups/
```

### Phase 4: Quartz Site Enhancement

**Tasks:**
- [ ] Set up RSS feed integration (Ghost blog)
- [ ] Integrate newsletter service (Tally/Mailchimp)
- [ ] Add social media embeds
- [ ] Enhance local nodes map (using JSON data)
- [ ] Configure search functionality
- [ ] Set up SEO optimization
- [ ] Update analytics (Plausible)

**Dependencies:**
- Ghost migration must be complete for RSS feed integration
- See [integrations/rss-feed-integration.md](integrations/rss-feed-integration.md)
- See [integrations/newsletter-integration.md](integrations/newsletter-integration.md)

### Phase 5: Design & Styling

**Tasks:**
- [ ] Apply ReFi DAO brand colors
- [ ] Apply typography (Inter font)
- [ ] Create responsive layouts
- [ ] Style components (cards, lists)
- [ ] Ensure accessibility compliance
- [ ] Test across devices

### Phase 6: Deployment

**Tasks:**
- [ ] Final content review
- [ ] Set up GitHub Pages deployment
- [ ] Configure custom domain (refidao.com)
- [ ] Set up DNS (docs.refidao.com subdomain)
- [ ] Test all links and functionality
- [ ] Soft launch with redirect
- [ ] Monitor for issues
- [ ] Full cutover

## Timeline

**Estimated Duration:** 1-2 weeks for remaining phases

- **Phase 2:** 3-5 days (Content extraction)
- **Phase 3:** 2-3 days (Markdown conversion)
- **Phase 4:** 2-3 days (Enhancements)
- **Phase 5:** 2-3 days (Design & styling)
- **Phase 6:** 1-2 days (Deployment)

## Success Criteria

- [ ] All content successfully extracted and converted
- [ ] All pages render correctly in Quartz
- [ ] RSS feed integration working
- [ ] Newsletter signup functional
- [ ] Site loads in <3 seconds
- [ ] All links working
- [ ] Mobile responsive
- [ ] SEO optimized
- [ ] Custom domain configured
- [ ] GitHub Pages deployment successful

## Integration Context

### How This Integrates with Other Migrations

- **Ghost Migration:** RSS feed integration displays latest blog posts on Media page
- **Airtable Migration:** Database integration may display contribution points or member data
- **Notion Migration:** Resources Hub content may be integrated into website

### Key Integration Points

- RSS feed from Ghost blog (`blog.refidao.com/rss/`)
- Newsletter service (Tally.so or Mailchimp)
- Database API endpoints (if needed)
- Notion content sync (if integrated)

## Cost Impact

### Current Cost
- Softr/Webflow: ~$50/month (reduced - local nodes DB only)

### New Cost
- GitHub Pages: $0 (free)
- Domain: Included in existing costs
- **Savings:** ~$50/month

## Dependencies

### Prerequisites
- Phase 1 (Webflow Fix) must be complete ✅
- Content extraction tools and processes ready

### Enables
- Ghost RSS feed integration (after Ghost migration)
- Database integration (after Airtable migration)
- Improved site performance and maintainability

## Outputs to Update

- `content/index.md` - Homepage
- `content/about/index.md` - About page
- `content/media/index.md` - Media page
- `content/community/` - Community pages
- `quartz.config.ts` - Configuration updates
- `.github/workflows/deploy.yml` - Deployment workflow
- `scripts/fetch-rss.js` - RSS integration script

## Cross-References

- **Main README:** [../README.md](../README.md)
- **Ghost Migration:** [../ghost-migration/ghost-migration.plan.md](../ghost-migration/ghost-migration.plan.md) (for RSS integration)
- **Airtable Migration:** [../airtable-migration/airtable-migration.plan.md](../airtable-migration/airtable-migration.plan.md) (for database integration)
- **Migration Guide:** [website-content-extraction-guide.md](website-content-extraction-guide.md)
- **Integration Guides:** [integrations/](integrations/)

### To-dos

- [ ] Phase 2: Content Extraction (8 tasks)
- [ ] Phase 3: Markdown Conversion (7 tasks)
- [ ] Phase 4: Quartz Site Enhancement (7 tasks)
- [ ] Phase 5: Design & Styling (6 tasks)
- [ ] Phase 6: Deployment (8 tasks)

---

**Last Updated:** January 2025  
**Next Review:** Weekly during active migration phases
