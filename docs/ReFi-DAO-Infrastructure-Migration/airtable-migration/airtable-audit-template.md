# Airtable Migration Audit Template

Use this template to document each Airtable base before migration to NocoDB.

## Base Information

**Base Name:** [Name of Airtable base]  
**Base ID:** [Airtable base ID]  
**Purpose:** [What this base is used for]  
**Owner:** [Who manages this base]  
**Last Updated:** [Date]

## Tables

### Table 1: [Table Name]

**Purpose:** [What this table stores]

**Fields:**
| Field Name | Field Type | Description | Required | Default Value | Options/Formula |
|------------|------------|-------------|----------|---------------|-----------------|
| Field 1 | Text | Description | Yes/No | - | - |
| Field 2 | Number | Description | Yes/No | 0 | Formula: ... |
| Field 3 | Select | Description | Yes/No | - | Option1, Option2 |

**Record Count:** [Number of records]

**Relationships:**
- Links to: [Other table names]
- Linked from: [Other table names]

**Views:**
- [View Name] - [Description] - [Filters/Sorting]

**Formulas:**
- [Formula Name]: `[Formula code]` - [What it calculates]

**Automations:**
- [Automation Name] - [Description] - [Trigger] - [Action]

**Integrations:**
- [Integration Name] - [How it's used] - [API endpoints]

**Migration Notes:**
- [Any special considerations]
- [Data quality issues]
- [Dependencies]

---

### Table 2: [Table Name]

[Repeat structure above]

---

## Migration Checklist

- [ ] All tables documented
- [ ] All fields documented
- [ ] Relationships mapped
- [ ] Formulas documented
- [ ] Automations documented
- [ ] Integrations documented
- [ ] Data exported to CSV
- [ ] Data quality verified
- [ ] Migration plan created

## NocoDB Mapping

### Table Mapping

| Airtable Table | NocoDB Table | Notes |
|----------------|--------------|-------|
| Table 1 | Table 1 | Direct mapping |
| Table 2 | Table 2 | Needs field adjustments |

### Field Type Mapping

| Airtable Type | NocoDB Type | Notes |
|---------------|-------------|-------|
| Text | Single Line Text | Direct |
| Long text | Long Text | Direct |
| Number | Number | Direct |
| Date | Date | Direct |
| Select | Single Select | Direct |
| Multiple select | Multi Select | Direct |
| Link | Link to Another Record | Needs setup |
| Formula | Formula | May need adjustment |

## Integration Updates Required

- [ ] Prosperity Pass API endpoints
- [ ] Website references
- [ ] Automation scripts
- [ ] Other integrations

---

**Audit Date:** [Date]  
**Audited By:** [Name]  
**Status:** [In Progress/Complete]

