<!-- airtable-migration-plan-001 -->
# Airtable Migration Plan - Paid → NocoDB

## Goal

Migrate all Airtable databases to NocoDB (self-hosted), eliminating Airtable costs completely. After complete migration, evaluate what data should move to Notion for better integration with documentation workflows.

## Overview

**Status:** Not Started (Guides & Scripts Ready)  
**Migration:** Paid Airtable → NocoDB (Self-Hosted)  
**Timeline:** 3-4 weeks Phase 1, 3-4 weeks Phase 2  
**Cost Savings:** ~$30-40/month

### Current State
- **Platform:** Paid Airtable subscription
- **Cost:** ~$50/month
- **Usage:** Multiple bases with tables, relationships, formulas, integrations
- **Status:** Fully functional, ready for migration

### Target State
- **Platform:** NocoDB (self-hosted on Railway/Render)
- **Cost:** $5-10/month
- **Phase 1:** All data migrated to NocoDB
- **Phase 2:** Selective migration of appropriate data to Notion

## Process

### Two-Phase Approach

**Phase 1: Complete Migration to NocoDB**
- Migrate everything from Airtable to NocoDB
- Eliminate Airtable costs completely
- Maintain all functionality and integrations
- Timeline: 3-4 weeks

**Phase 2: Notion Evaluation & Selective Migration**
- Evaluate all migrated databases
- Identify documentation-focused data suitable for Notion
- Migrate selected databases to Notion
- Optimize data locations
- Timeline: 3-4 weeks

## Phase 1: Complete Migration to NocoDB

### Audit

**Tasks:**
- [ ] List all Airtable bases/workspaces
- [ ] Document all tables and fields
- [ ] Map relationships between tables
- [ ] Document formulas and automations
- [ ] Document integrations (Prosperity Pass, website)
- [ ] Export all data to CSV
- [ ] Create migration inventory

**Tools:**
- Use [airtable-audit-template.md](airtable-audit-template.md)
- Run export script: `npm run export-airtable`

### Deployment

**Tasks:**
- [ ] Create Railway/Render account (if not exists)
- [ ] Deploy NocoDB
- [ ] Configure database (PostgreSQL recommended)
- [ ] Set up environment variables
- [ ] Configure access permissions
- [ ] Set up authentication

**Reference:** See [nocodb-migration-guide.md](nocodb-migration-guide.md)

### Data Migration

**Tasks:**
- [ ] Create workspace in NocoDB
- [ ] Create projects for each Airtable base
- [ ] Create tables matching Airtable structure
- [ ] Import CSV data
- [ ] Recreate relationships
- [ ] Recreate formulas
- [ ] Recreate views and filters
- [ ] Verify data integrity

### Integration Updates

**Tasks:**
- [ ] Update Prosperity Pass integration
- [ ] Update website references
- [ ] Update automation scripts
- [ ] Test all API endpoints
- [ ] Document new API structure

### Team Training

**Tasks:**
- [ ] Create NocoDB user guide
- [ ] Document database structure
- [ ] Train team on interface
- [ ] Set up access permissions
- [ ] Create usage documentation

### Cutover

**Tasks:**
- [ ] Final Airtable export (backup)
- [ ] Switch integrations to NocoDB
- [ ] Test all workflows
- [ ] Monitor for errors
- [ ] Cancel Airtable subscription

## Phase 2: Notion Evaluation & Selective Migration

### Evaluation

**Tasks:**
- [ ] Review all migrated databases
- [ ] Classify by type (transactional vs. documentation)
- [ ] Identify Notion candidates
- [ ] Document evaluation decisions

**Evaluation Criteria:**

**Move to Notion if:**
- Data is documentation-focused (guides, resources, references)
- Needs to be integrated with Resources Hub
- Team already uses Notion for similar content
- Static/semi-static data (doesn't need frequent updates)
- Doesn't require complex formulas or relationships
- Better suited for collaborative editing

**Keep in NocoDB if:**
- Data is transactional (contribution points, tracking)
- Needs API access for integrations
- Requires complex relationships and formulas
- Frequently updated operational data
- Needs spreadsheet-like interface
- Requires advanced filtering and views

### Selective Migration

**Tasks:**
- [ ] Migrate selected databases to Notion
- [ ] Set up relations and structure
- [ ] Update links and references
- [ ] Train team on new locations

### Finalization

**Tasks:**
- [ ] Document final data locations
- [ ] Update integration documentation
- [ ] Create data access guide
- [ ] Optimize workflows

## Timeline

**Phase 1: Complete Migration**
- Audit: 2-3 days
- Deployment: 1 day
- Migration: 1 week
- Integration updates: 1 week
- Testing: 2-3 days
- **Total: 3-4 weeks**

**Phase 2: Notion Evaluation**
- Evaluation: 1 week
- Selective migration: 1-2 weeks
- Documentation: 1 week
- **Total: 3-4 weeks**

**Overall Timeline:** 6-8 weeks

## Success Criteria

### Phase 1 Success Criteria
- [ ] All Airtable bases audited and documented
- [ ] NocoDB deployed and configured
- [ ] All data migrated successfully
- [ ] All relationships recreated
- [ ] All formulas working correctly
- [ ] All integrations updated and tested
- [ ] Team trained on NocoDB
- [ ] Airtable subscription cancelled

### Phase 2 Success Criteria
- [ ] All databases evaluated
- [ ] Appropriate data migrated to Notion
- [ ] Data locations documented
- [ ] Workflows optimized
- [ ] Team comfortable with final structure

## Integration Context

### How This Integrates with Other Migrations

- **Website Migration:** Database integration may display contribution points or member data
- **Ghost Migration:** No direct dependency
- **Notion Migration:** Phase 2 involves selective migration to Notion

### Key Integration Points

- Prosperity Pass integration (contribution tracking)
- Website API endpoints (if needed)
- Automation scripts
- Team workflows

## Cost Impact

### Current Cost
- Airtable: ~$50/month

### New Cost
- NocoDB on Railway/Render: $5-10/month
- Database: Included or $5-10/month
- **Total:** $5-10/month

### Savings
- **Monthly:** ~$30-40/month
- **Annual:** ~$360-480/year

### Contribution to Overall Savings
- Significant cost reduction
- Enables free/open-source database solution
- Phase 2 may further optimize by using Notion free tier

## Dependencies

### Prerequisites
- Railway/Render account (can share with Ghost migration)
- Access to all Airtable bases
- API access for integrations
- Team availability for training

### Enables
- Database integration for Website Migration (if needed)
- Reduced infrastructure costs
- Full control over database structure
- Potential Notion integration in Phase 2

## Outputs to Update

- NocoDB instance on Railway/Render
- Prosperity Pass integration endpoints
- Website API references
- Automation scripts
- Team documentation
- Database access guides

## Cross-References

- **Main README:** [../README.md](../README.md)
- **Website Migration:** [../website-migration/website-migration.plan.md](../website-migration/website-migration.plan.md) (for database integration)
- **Notion Migration:** [../notion-migration/notion-migration.plan.md](../notion-migration/notion-migration.plan.md) (for Phase 2)
- **Migration Guide:** [nocodb-migration-guide.md](nocodb-migration-guide.md)
- **Audit Template:** [airtable-audit-template.md](airtable-audit-template.md)
- **Export Script:** `scripts/airtable-export.js`

### To-dos

- [ ] Phase 1: Audit (7 tasks)
- [ ] Phase 1: Deployment (6 tasks)
- [ ] Phase 1: Data Migration (8 tasks)
- [ ] Phase 1: Integration Updates (5 tasks)
- [ ] Phase 1: Team Training (5 tasks)
- [ ] Phase 1: Cutover (5 tasks)
- [ ] Phase 2: Evaluation (4 tasks)
- [ ] Phase 2: Selective Migration (4 tasks)
- [ ] Phase 2: Finalization (4 tasks)

---

**Last Updated:** January 2025  
**Next Review:** Before starting Phase 1
