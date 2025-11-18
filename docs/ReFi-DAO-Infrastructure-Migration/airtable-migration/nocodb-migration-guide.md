# Airtable to NocoDB Migration Guide

## Overview

This guide covers migrating all Airtable databases to NocoDB (self-hosted), eliminating Airtable costs completely. After migration, we'll evaluate what data should move to Notion.

## Prerequisites

- Access to Airtable workspace
- Railway.app or Render.com account (for hosting NocoDB)
- GitHub account (for database version control)
- API access documentation (for integrations)

## Phase 1: Complete Airtable Migration

### Step 1: Complete Airtable Audit

**Document All Databases:**

1. List every base/workspace in Airtable
2. For each base, document:
   - Table names
   - Field names and types
   - Relationships between tables
   - Views and filters
   - Formulas and automations
   - Integrations (Prosperity Pass, website, etc.)
   - Access permissions

**Export All Data:**

1. Export each table to CSV:
   - Base → Export → CSV
   - Save with descriptive names: `base-name_table-name.csv`
2. Export relationships mapping (document manually)
3. Export formulas (document manually)
4. Document all integrations and API endpoints

**Create Migration Inventory:**

Create a spreadsheet documenting:
- Base name
- Table count
- Record count
- Integration dependencies
- Priority level
- Estimated migration time

### Step 2: Deploy NocoDB

**Option A: Railway.app (Recommended)**

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub" or use NocoDB template
4. Or use Docker:
   - Image: `nocodb/nocodb:latest`
   - Environment variables (see below)

**Option B: Render.com**

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Use Docker image: `nocodb/nocodb:latest`
4. Configure environment variables

**Environment Variables:**

```
NC_DB="pg://host:5432?u=user&p=password&d=database"
NC_AUTH_JWT_SECRET=<generate-random-secret>
NC_SENTRY_DSN="" (optional)
NC_DISABLE_TELE=true
NC_ONE_CLICK=true
```

**Database Setup:**

NocoDB supports multiple database backends:
- **PostgreSQL** (recommended for production)
- **MySQL**
- **SQLite** (for development/testing)

For Railway/Render, use their managed PostgreSQL service.

### Step 3: Configure NocoDB

1. Access NocoDB admin panel
2. Create workspace: "ReFi DAO"
3. Set up authentication (email/password or SSO)
4. Configure access permissions
5. Set up backup schedule

### Step 4: Migrate All Data

**For Each Airtable Base:**

1. **Create Project in NocoDB:**
   - Name: Match Airtable base name
   - Description: Document purpose

2. **Create Tables:**
   - Create table for each Airtable table
   - Match field names and types:
     - Text → Single Line Text
     - Long text → Long Text
     - Number → Number
     - Date → Date
     - Select → Single Select
     - Multiple select → Multi Select
     - Link → Link to Another Record
     - Attachment → Attachment
     - Formula → Formula (recreate in NocoDB)

3. **Import Data:**
   - Use CSV import feature
   - Map columns correctly
   - Handle relationships manually (create links after import)

4. **Recreate Relationships:**
   - Set up Link to Another Record fields
   - Verify relationships work correctly

5. **Recreate Views:**
   - Create views matching Airtable views
   - Set up filters and sorting
   - Configure view types (Grid, Gallery, Form, etc.)

6. **Recreate Formulas:**
   - NocoDB supports formulas similar to Airtable
   - Recreate each formula field
   - Test formula results match Airtable

### Step 5: Set Up GitHub Sync (Optional)

**For SQLite Database:**

1. Set up GitHub Actions workflow
2. Sync database file to GitHub repo
3. Enable version control for database

**Workflow Example:**

```yaml
name: Sync NocoDB Database

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Download database
        run: |
          # Download SQLite file from NocoDB
          # Commit and push changes
```

### Step 6: Update Integrations

**Prosperity Pass Integration:**

1. Update API endpoints to NocoDB REST API
2. NocoDB provides REST API similar to Airtable
3. Update authentication (API tokens)
4. Test all API calls

**Website Integration:**

1. Update any Airtable embeds/widgets
2. Use NocoDB public views or API
3. Update JavaScript/frontend code

**Automation Scripts:**

1. Update any scripts using Airtable API
2. Migrate to NocoDB REST API
3. Test all automations

### Step 7: Team Training

1. **Create Documentation:**
   - NocoDB user guide
   - Database structure documentation
   - API documentation
   - Migration notes

2. **Training Session:**
   - Walk through NocoDB interface
   - Show how to create/edit records
   - Explain views and filters
   - Demonstrate API access

3. **Access Setup:**
   - Create user accounts
   - Set appropriate permissions
   - Share access credentials securely

### Step 8: Testing & Validation

- [ ] All tables migrated
- [ ] All data imported correctly
- [ ] Relationships working
- [ ] Formulas calculating correctly
- [ ] Views displaying properly
- [ ] API endpoints responding
- [ ] Integrations working
- [ ] Team can access and use system

### Step 9: Cutover

1. **Final Airtable Export:**
   - Export all data one final time
   - Store as backup

2. **Switch Integrations:**
   - Update API endpoints
   - Test thoroughly
   - Monitor for errors

3. **Cancel Airtable:**
   - Verify NocoDB is working perfectly
   - Cancel Airtable subscription
   - Update documentation

## Phase 2: Evaluate Notion Integration

### Evaluation Criteria

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

### Evaluation Process

1. **Review Each Database:**
   - Classify by type (transactional vs. documentation)
   - Assess Notion suitability
   - Document decision rationale

2. **Selective Migration:**
   - Migrate selected databases to Notion
   - Set up relations and structure
   - Update links and references
   - Train team on new locations

3. **Final Architecture:**
   - Document final data locations
   - Update integration documentation
   - Create data access guide
   - Optimize workflows

## NocoDB API Documentation

### REST API Endpoints

**Base URL:** `https://your-nocodb-instance.com/api/v1/db`

**Authentication:**
```
Headers:
X-NocoDB-API-Token: <your-api-token>
```

**Common Endpoints:**

- `GET /tables` - List all tables
- `GET /tables/{tableId}/records` - Get records
- `POST /tables/{tableId}/records` - Create record
- `PATCH /tables/{tableId}/records/{recordId}` - Update record
- `DELETE /tables/{tableId}/records/{recordId}` - Delete record

**Full API Docs:** https://docs.nocodb.com/api-reference

## Cost Comparison

**Current:**
- Airtable: ~$50/month (estimated)

**New:**
- NocoDB on Railway/Render: $5-10/month
- Database: Included or $5-10/month

**Savings:** ~$30-40/month

## Migration Checklist

### Phase 1: Complete Migration
- [ ] Airtable audit complete
- [ ] All data exported
- [ ] NocoDB deployed
- [ ] Database configured
- [ ] All tables created
- [ ] All data imported
- [ ] Relationships recreated
- [ ] Formulas recreated
- [ ] Views recreated
- [ ] Integrations updated
- [ ] Team trained
- [ ] Testing complete
- [ ] Airtable cancelled

### Phase 2: Notion Evaluation
- [ ] Databases classified
- [ ] Notion candidates identified
- [ ] Selected databases migrated to Notion
- [ ] Final architecture documented
- [ ] Access guides created

## Timeline Estimate

**Phase 1:**
- Audit: 2-3 days
- Deployment: 1 day
- Migration: 1 week
- Integration updates: 1 week
- Testing: 2-3 days
- **Total: 3-4 weeks**

**Phase 2:**
- Evaluation: 1 week
- Selective migration: 1-2 weeks
- Documentation: 1 week
- **Total: 3-4 weeks**

## Troubleshooting

### Common Issues

1. **Data Import Errors**
   - Check CSV formatting
   - Verify field types match
   - Handle special characters

2. **Relationship Issues**
   - Verify linked records exist
   - Check field types match
   - Recreate links manually if needed

3. **Formula Errors**
   - NocoDB formulas may differ slightly
   - Test each formula individually
   - Consult NocoDB formula docs

4. **API Integration Issues**
   - Verify API tokens
   - Check endpoint URLs
   - Review API documentation

## Support Resources

- NocoDB Docs: https://docs.nocodb.com
- NocoDB Community: https://community.nocodb.com
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

---

**Last Updated:** January 2025  
**Status:** Ready for implementation

