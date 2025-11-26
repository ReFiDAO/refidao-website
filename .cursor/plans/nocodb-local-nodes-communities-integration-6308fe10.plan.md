<!-- 6308fe10-f257-458a-a65d-bb057d0c6ce0 31147dba-7e03-4fae-ad0f-b07f9bf3e2d4 -->
# NocoDB Integration Plan - Local Nodes & Communities

## Goal

Integrate NocoDB database to manage Local Nodes and Communities (Network Initiatives) data for the ReFi DAO website. Replace static JSON files with dynamic build-time data fetching from NocoDB API, enabling easier content management while maintaining the static site architecture.

## Overview

**Status:** Planning

**Integration:** NocoDB API → Quartz Static Site Generator

**Timeline:** 2-3 weeks

**Integration Point:** Part of Airtable Migration Plan Phase 1

### Current State

- **Data Source:** Static JSON file (`content/community/local-nodes.json`)
- **Data Management:** Manual file edits
- **Limitations:** No easy way to update node data, no admin interface, requires code changes for updates

### Target State

- **Data Source:** NocoDB database (self-hosted)
- **Data Management:** Web-based admin interface
- **Integration:** Build-time API fetching (similar to RSS feed integration)
- **Benefits:** Easy content updates, version control, API access, admin interface

## Integration Architecture

### Data Flow

```
NocoDB Database → Build Script → JSON/Markdown Files → Quartz Build → Static Site
```

### Approach

1. **Build-Time Fetching:** Similar to RSS feed integration (`scripts/fetch-rss.js`)
2. **Generate Static Files:** Fetch from NocoDB API and generate JSON/markdown files
3. **GitHub Actions:** Optional scheduled updates via GitHub Actions
4. **Manual Trigger:** `npm run fetch-nocodb` command for manual updates

## Implementation Plan

### Phase 1: NocoDB Database Setup

#### 1.1 Database Schema Design

**Local Nodes Table:**

- `id` (Text, Unique)
- `name` (Text)
- `country` (Text)
- `countryCode` (Text)
- `region` (Single Select: North America, South America, Europe, Africa, Asia)
- `city` (Text, Optional)
- `status` (Single Select: active, inactive, pending)
- `latitude` (Number)
- `longitude` (Number)
- `description` (Long Text, Optional)
- `leaders` (Text, Optional - comma-separated)
- `website` (URL, Optional)
- `twitter` (URL, Optional)
- `telegram` (URL, Optional)
- `eventsCalendar` (URL, Optional)
- `focusAreas` (Multi Select, Optional)
- `foundedDate` (Date, Optional)
- `lastUpdated` (Date, Auto)

**Network Initiatives Table:**

- `id` (Text, Unique)
- `name` (Text)
- `type` (Single Select: Guild, Working Group, Media Initiative, Tooling Project)
- `status` (Single Select: active, inactive, pending)
- `description` (Long Text)
- `website` (URL, Optional)
- `twitter` (URL, Optional)
- `telegram` (URL, Optional)
- `focusAreas` (Multi Select, Optional)
- `leaders` (Text, Optional - comma-separated)
- `foundedDate` (Date, Optional)
- `lastUpdated` (Date, Auto)

**Communities Table (Optional - for future expansion):**

- Unified table for both Local Nodes and Network Initiatives
- `type` field to distinguish between them

#### 1.2 NocoDB Project Setup

**Tasks:**

- [ ] Deploy NocoDB instance (Railway/Render) - can share with main Airtable migration
- [ ] Create workspace: "ReFi DAO Communities"
- [ ] Create project: "Local Nodes & Communities"
- [ ] Create tables: Local Nodes, Network Initiatives
- [ ] Configure field types and relationships
- [ ] Set up views (by region, by status, etc.)
- [ ] Import existing data from `local-nodes.json`
- [ ] Set up access permissions (read-only for API, admin for content managers)

**Reference:** See `docs/ReFi-DAO-Infrastructure-Migration/airtable-migration/nocodb-migration-guide.md`

### Phase 2: Build Script Development

#### 2.1 Create NocoDB Fetch Script

**File:** `scripts/fetch-nocodb.js`

**Functionality:**

- Fetch Local Nodes data from NocoDB API
- Fetch Network Initiatives data from NocoDB API
- Transform data to match existing JSON structure
- Generate `content/community/local-nodes.json`
- Generate `content/community/network-initiatives.json` (new)
- Generate individual markdown files for each node (optional)
- Handle errors gracefully
- Support incremental updates

**API Integration:**

- Use NocoDB REST API
- Authentication via API token
- Fetch all records from tables
- Transform to website format

**Tasks:**

- [ ] Create `scripts/fetch-nocodb.js`
- [ ] Implement NocoDB API client
- [ ] Add data transformation logic
- [ ] Generate JSON output files
- [ ] Add error handling and logging
- [ ] Test with NocoDB instance
- [ ] Add to `package.json` scripts

#### 2.2 Environment Configuration

**Environment Variables:**

```bash
NOCODB_API_URL=https://your-nocodb-instance.com/api/v1/db
NOCODB_API_TOKEN=your_api_token
NOCODB_PROJECT_ID=project_id
NOCODB_LOCAL_NODES_TABLE_ID=table_id
NOCODB_NETWORK_INITIATIVES_TABLE_ID=table_id
```

**Tasks:**

- [ ] Document environment variables
- [ ] Add to `.env.example` (if using)
- [ ] Configure GitHub Actions secrets (for CI/CD)

### Phase 3: Website Integration

#### 3.1 Update Content Files

**Files to Update:**

- `content/community/local-nodes.md` - Update to reference JSON data
- `content/community/network-initiatives.md` - Update to reference JSON data
- `content/community/index.md` - Update community metrics

**Tasks:**

- [ ] Update markdown files to use fetched JSON data
- [ ] Ensure JSON structure matches existing format
- [ ] Test page rendering with new data source
- [ ] Update any hardcoded node lists

#### 3.2 Build Process Integration

**Update `package.json`:**

```json
{
  "scripts": {
    "fetch-nocodb": "node scripts/fetch-nocodb.js",
    "build": "npm run fetch-nocodb && npm run fetch-rss && npx quartz build"
  }
}
```

**Tasks:**

- [ ] Update build script to include NocoDB fetch
- [ ] Test build process end-to-end
- [ ] Ensure build fails gracefully if NocoDB is unavailable

#### 3.3 GitHub Actions Integration (Optional)

**File:** `.github/workflows/fetch-nocodb.yml`

**Functionality:**

- Scheduled runs (daily/weekly)
- Manual trigger support
- Fetch from NocoDB
- Commit updated JSON files
- Trigger site rebuild

**Tasks:**

- [ ] Create GitHub Actions workflow
- [ ] Configure schedule
- [ ] Set up secrets
- [ ] Test workflow execution

### Phase 4: Data Migration

#### 4.1 Import Existing Data

**Source:** `content/community/local-nodes.json`

**Tasks:**

- [ ] Export current JSON data
- [ ] Transform to NocoDB format
- [ ] Import into Local Nodes table
- [ ] Verify data integrity
- [ ] Test API returns correct data

#### 4.2 Network Initiatives Data

**Tasks:**

- [ ] Extract Network Initiatives data from markdown files
- [ ] Create initial records in NocoDB
- [ ] Verify data structure
- [ ] Test API access

### Phase 5: Documentation & Training

#### 5.1 Documentation

**Files to Create/Update:**

- `docs/ReFi-DAO-Infrastructure-Migration/nocodb-integration-guide.md` - Integration guide
- `docs/ReFi-DAO-Infrastructure-Migration/README.md` - Update with NocoDB integration
- `docs/nocodb-admin-guide.md` - Admin user guide for content managers

**Tasks:**

- [ ] Create integration documentation
- [ ] Document NocoDB admin interface usage
- [ ] Create data entry guidelines
- [ ] Update main migration README
- [ ] Document API endpoints and usage

#### 5.2 Team Training

**Tasks:**

- [ ] Train content managers on NocoDB interface
- [ ] Create quick reference guide
- [ ] Document common workflows
- [ ] Set up access permissions

## Technical Details

### NocoDB API Usage

**Base URL:** `https://your-nocodb-instance.com/api/v1/db`

**Authentication:**

```
Headers:
X-NocoDB-API-Token: <api-token>
```

**Endpoints:**

- `GET /tables/{tableId}/records` - Fetch all records
- `POST /tables/{tableId}/records` - Create record
- `PATCH /tables/{tableId}/records/{recordId}` - Update record
- `DELETE /tables/{tableId}/records/{recordId}` - Delete record

**Query Parameters:**

- `limit` - Number of records per page
- `offset` - Pagination offset
- `where` - Filter conditions
- `sort` - Sort order

### Data Transformation

**NocoDB Format → Website JSON Format:**

- Map NocoDB fields to JSON structure
- Handle optional fields
- Transform coordinates to nested object
- Format dates appropriately
- Handle multi-select fields

### Error Handling

**Scenarios to Handle:**

- NocoDB API unavailable
- Authentication failures
- Invalid data format
- Network timeouts
- Partial data updates

**Fallback Strategy:**

- Use cached/last known good JSON file
- Log errors for debugging
- Continue build with existing data
- Alert on persistent failures

## Integration with Existing Plans

### Airtable Migration Plan

This integration is part of the broader Airtable migration:

- **Phase 1:** Complete migration to NocoDB (includes Local Nodes/Communities)
- **Shared Infrastructure:** Same NocoDB instance can host multiple projects
- **Timeline:** Can proceed in parallel with main Airtable migration

### Website Migration Plan

This enhances Website Migration Phase 4:

- **Enhancement:** Dynamic data fetching for community pages
- **Dependency:** NocoDB must be deployed first
- **Timeline:** Can proceed after NocoDB deployment

## Success Criteria

### Phase 1 Success

- [ ] NocoDB instance deployed and accessible
- [ ] Database schema created
- [ ] Access permissions configured
- [ ] Existing data imported successfully

### Phase 2 Success

- [ ] Fetch script working correctly
- [ ] Data transformation accurate
- [ ] JSON files generated correctly
- [ ] Error handling robust

### Phase 3 Success

- [ ] Website pages render correctly
- [ ] Data displays accurately
- [ ] Build process includes NocoDB fetch
- [ ] No breaking changes to existing functionality

### Phase 4 Success

- [ ] All existing data migrated
- [ ] Network Initiatives data added
- [ ] Data integrity verified
- [ ] API returns correct data

### Phase 5 Success

- [ ] Documentation complete
- [ ] Team trained on NocoDB
- [ ] Admin guide available
- [ ] Integration documented

## Timeline

**Phase 1: Database Setup** - 3-5 days

- NocoDB deployment: 1 day
- Schema design: 1 day
- Data import: 1 day
- Testing: 1-2 days

**Phase 2: Build Script** - 3-5 days

- Script development: 2-3 days
- Testing: 1-2 days

**Phase 3: Website Integration** - 2-3 days

- Content updates: 1 day
- Build integration: 1 day
- Testing: 1 day

**Phase 4: Data Migration** - 1-2 days

- Data import: 1 day
- Verification: 1 day

**Phase 5: Documentation** - 2-3 days

- Documentation: 2 days
- Training: 1 day

**Total Timeline:** 2-3 weeks

## Files to Create/Modify

### New Files

- `scripts/fetch-nocodb.js` - NocoDB fetch script
- `docs/ReFi-DAO-Infrastructure-Migration/nocodb-integration-guide.md` - Integration guide
- `docs/nocodb-admin-guide.md` - Admin user guide
- `.github/workflows/fetch-nocodb.yml` - GitHub Actions workflow (optional)

### Modified Files

- `package.json` - Add fetch-nocodb script
- `content/community/local-nodes.json` - Generated file (keep in git for fallback)
- `content/community/network-initiatives.json` - New generated file
- `content/community/local-nodes.md` - Update to use JSON data
- `content/community/network-initiatives.md` - Update to use JSON data
- `docs/ReFi-DAO-Infrastructure-Migration/README.md` - Update with integration info
- `docs/ReFi-DAO-Infrastructure-Migration/airtable-migration/airtable-migration.plan.md` - Reference this integration

## Dependencies

### Prerequisites

- NocoDB instance deployed (can share with Airtable migration)
- NocoDB API access configured
- Access to existing JSON data for migration

### Enables

- Easy content management for Local Nodes
- Easy content management for Network Initiatives
- API access for future integrations
- Foundation for other community data management

## Cost Impact

### Additional Costs

- **NocoDB:** Already included in Airtable migration ($5-10/month)
- **No additional hosting costs** - uses existing NocoDB instance

### Savings

- **Time savings:** Reduced manual file editing
- **Maintainability:** Easier content updates
- **Scalability:** Foundation for future data management

## Next Steps

1. Review and approve this plan
2. Deploy NocoDB instance (if not already done for Airtable migration)
3. Design database schema
4. Begin Phase 1 implementation
5. Test integration end-to-end
6. Migrate existing data
7. Train team on NocoDB admin interface

## Cross-References

- **Airtable Migration Plan:** `docs/ReFi-DAO-Infrastructure-Migration/airtable-migration/airtable-migration.plan.md`
- **NocoDB Migration Guide:** `docs/ReFi-DAO-Infrastructure-Migration/airtable-migration/nocodb-migration-guide.md`
- **Website Migration Plan:** `docs/ReFi-DAO-Infrastructure-Migration/website-migration/website-migration.plan.md`
- **Main Migration README:** `docs/ReFi-DAO-Infrastructure-Migration/README.md`

### To-dos

- [ ] Deploy NocoDB instance on Railway/Render (can share with Airtable migration)
- [ ] Design database schema for Local Nodes and Network Initiatives tables
- [ ] Import existing local-nodes.json data into NocoDB
- [ ] Create scripts/fetch-nocodb.js to fetch data from NocoDB API
- [ ] Integrate NocoDB fetch into build process (update package.json)
- [ ] Update content/community markdown files to use fetched JSON data
- [ ] Create GitHub Actions workflow for scheduled NocoDB updates (optional)
- [ ] Create integration guide and admin documentation
- [ ] Train content managers on NocoDB admin interface