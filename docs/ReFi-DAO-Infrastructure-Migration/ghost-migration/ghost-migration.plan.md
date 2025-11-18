<!-- ghost-migration-plan-001 -->
# Ghost Self-Hosting Migration Plan

## Goal

Migrate Ghost CMS from managed hosting ($144/month) to Railway.app or Render.com ($5-20/month). This migration significantly reduces costs while maintaining full functionality and control, and enables RSS feed integration for the website.

## Overview

**Status:** Not Started (Guides Ready)  
**Migration:** Managed Ghost → Railway.app/Render.com  
**Timeline:** 2-3 hours setup + 1-2 hours migration  
**Cost Savings:** ~$120-130/month

### Current State
- **Platform:** Managed Ghost hosting
- **Cost:** $144/month
- **Domain:** blog.refidao.com
- **Status:** Fully functional, ready for migration

### Target State
- **Platform:** Railway.app (recommended) or Render.com
- **Cost:** $5-20/month
- **Domain:** blog.refidao.com (same domain)
- **Benefits:** Self-hosted, full control, significant cost savings

## Process

### Option A: Railway.app (Recommended)

**Why Railway:**
- Easiest deployment process
- Automatic SSL certificates
- Simple database setup
- Good documentation and support

**Steps:**
1. Create Railway account
2. Deploy Ghost template or Docker image
3. Configure environment variables
4. Set up database (MySQL/PostgreSQL)
5. Configure domain and SSL
6. Export content from managed Ghost
7. Import content to Railway Ghost
8. Migrate theme and customizations
9. Update integrations
10. DNS cutover

### Option B: Render.com (Alternative)

**Why Render:**
- Similar ease of deployment
- Good free tier options
- PostgreSQL support
- Reliable infrastructure

**Steps:** Similar to Railway, with Render-specific configuration

## Detailed Tasks

### Setup

- [ ] Create Railway/Render account
- [ ] Deploy Ghost template
- [ ] Configure environment variables
- [ ] Set up database (MySQL/PostgreSQL)
- [ ] Configure domain (blog.refidao.com)
- [ ] Set up SSL certificate

**Reference:** See [ghost-migration-guide.md](ghost-migration-guide.md) for detailed steps

### Content Migration

- [ ] Export content from managed Ghost
- [ ] Download all images/media
- [ ] Import content to Railway Ghost
- [ ] Upload images to new instance
- [ ] Migrate theme
- [ ] Verify all posts render correctly

### Integration Updates

- [ ] Update RSS feed URL in website
- [ ] Update email service (if used)
- [ ] Test all integrations
- [ ] Update API keys/webhooks

### Testing & Cutover

- [ ] Test RSS feed generation
- [ ] Test email notifications
- [ ] Performance testing
- [ ] Backup verification
- [ ] DNS cutover
- [ ] Monitor for errors
- [ ] Cancel managed Ghost subscription

## Timeline

**Estimated Duration:** 4-5 hours total

- **Setup:** 2-3 hours
  - Account creation: 10 minutes
  - Ghost deployment: 30-60 minutes
  - Database setup: 30 minutes
  - Domain configuration: 30 minutes
  - Environment variables: 15 minutes

- **Content Migration:** 1-2 hours
  - Export from managed Ghost: 15 minutes
  - Import to Railway Ghost: 30-60 minutes
  - Theme migration: 15 minutes
  - Verification: 15 minutes

- **Testing & Cutover:** 1 hour
  - Integration testing: 30 minutes
  - DNS cutover: 30 minutes
  - Monitoring: Ongoing

## Success Criteria

- [ ] Ghost successfully deployed on Railway/Render
- [ ] All content migrated correctly
- [ ] RSS feed working: `https://blog.refidao.com/rss/`
- [ ] All posts render correctly
- [ ] Theme applied correctly
- [ ] Images load properly
- [ ] Email notifications working (if configured)
- [ ] Performance acceptable
- [ ] SSL certificate active
- [ ] Managed Ghost subscription cancelled

## Integration Context

### How This Integrates with Other Migrations

- **Website Migration:** Enables RSS feed integration for Media page (Phase 4)
- **Airtable Migration:** No direct dependency
- **Notion Migration:** No direct dependency

### Key Integration Points

- RSS feed URL: `https://blog.refidao.com/rss/`
- Website integration: Latest posts displayed on Media page
- Email service: Newsletter and notification emails
- API endpoints: If used for integrations

## Cost Impact

### Current Cost
- Managed Ghost: $144/month

### New Cost
- Railway/Render: $5-20/month (pay-as-you-go)
- Database: Included or $5-10/month
- **Total:** $5-20/month

### Savings
- **Monthly:** ~$120-130/month
- **Annual:** ~$1,440-1,560/year

### Contribution to Overall Savings
- Largest single cost reduction in infrastructure migration
- Enables free RSS integration for website

## Dependencies

### Prerequisites
- Railway/Render account
- Access to current Ghost admin panel
- Domain DNS access
- Content export capability

### Enables
- RSS feed integration for Website Migration Phase 4
- Reduced infrastructure costs
- Full control over blog hosting

## Outputs to Update

- Railway/Render Ghost instance
- DNS records for blog.refidao.com
- Website RSS feed configuration
- Integration documentation
- Email service configuration (if used)

## Cross-References

- **Main README:** [../README.md](../README.md)
- **Website Migration:** [../website-migration/website-migration.plan.md](../website-migration/website-migration.plan.md) (RSS integration)
- **Migration Guide:** [ghost-migration-guide.md](ghost-migration-guide.md)
- **RSS Integration Guide:** [../website-migration/integrations/rss-feed-integration.md](../website-migration/integrations/rss-feed-integration.md)

### To-dos

- [ ] Setup (6 tasks)
- [ ] Content Migration (6 tasks)
- [ ] Integration Updates (4 tasks)
- [ ] Testing & Cutover (7 tasks)

---

**Last Updated:** January 2025  
**Next Review:** Before starting migration
