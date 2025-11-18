#!/usr/bin/env node

/**
 * Airtable Export Utility
 * 
 * Helps export data from Airtable for migration to NocoDB.
 * 
 * Usage: 
 *   node scripts/airtable-export.js
 * 
 * Requires Airtable API key and base IDs in environment variables:
 *   AIRTABLE_API_KEY=your_api_key
 *   AIRTABLE_BASE_IDS=base1,base2,base3
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = join(__dirname, '../docs/migrations/airtable-exports');

/**
 * Export all tables from an Airtable base
 */
async function exportBase(apiKey, baseId) {
  try {
    console.log(`\n📊 Exporting base: ${baseId}`);
    
    // List all tables in the base
    const tablesResponse = await fetch(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!tablesResponse.ok) {
      throw new Error(`Failed to fetch tables: ${tablesResponse.statusText}`);
    }
    
    const tablesData = await tablesResponse.json();
    const tables = tablesData.tables || [];
    
    console.log(`   Found ${tables.length} tables`);
    
    const baseExport = {
      baseId,
      baseName: baseId, // Can be updated manually
      exportedAt: new Date().toISOString(),
      tables: []
    };
    
    // Export each table
    for (const table of tables) {
      console.log(`   📋 Exporting table: ${table.name}`);
      
      const tableData = await exportTable(apiKey, baseId, table.id, table.name);
      baseExport.tables.push(tableData);
    }
    
    return baseExport;
  } catch (error) {
    console.error(`❌ Error exporting base ${baseId}:`, error.message);
    throw error;
  }
}

/**
 * Export a single table from Airtable
 */
async function exportTable(apiKey, baseId, tableId, tableName) {
  const records = [];
  let offset = null;
  
  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
    if (offset) {
      url.searchParams.set('offset', offset);
    }
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch records: ${response.statusText}`);
    }
    
    const data = await response.json();
    records.push(...data.records);
    offset = data.offset || null;
    
    console.log(`      📄 Fetched ${records.length} records...`);
  } while (offset);
  
  // Convert to CSV format
  const csv = convertToCSV(records);
  
  return {
    tableId,
    tableName,
    recordCount: records.length,
    records: records,
    csv: csv
  };
}

/**
 * Convert Airtable records to CSV
 */
function convertToCSV(records) {
  if (records.length === 0) return '';
  
  // Get all field names from first record
  const fields = Object.keys(records[0].fields || {});
  
  // Create header row
  const header = fields.join(',');
  
  // Create data rows
  const rows = records.map(record => {
    return fields.map(field => {
      const value = record.fields[field];
      
      if (value === null || value === undefined) {
        return '';
      }
      
      // Handle arrays (multiple select, attachments, etc.)
      if (Array.isArray(value)) {
        return `"${value.join('; ')}"`;
      }
      
      // Handle objects (attachments, etc.)
      if (typeof value === 'object') {
        return `"${JSON.stringify(value)}"`;
      }
      
      // Escape quotes and wrap in quotes
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
  });
  
  return [header, ...rows].join('\n');
}

/**
 * Main export function
 */
async function exportAllBases() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseIds = process.env.AIRTABLE_BASE_IDS?.split(',') || [];
  
  if (!apiKey) {
    console.error('❌ Error: AIRTABLE_API_KEY environment variable not set');
    console.error('\nUsage:');
    console.error('  export AIRTABLE_API_KEY=your_api_key');
    console.error('  export AIRTABLE_BASE_IDS=base1,base2,base3');
    console.error('  node scripts/airtable-export.js');
    process.exit(1);
  }
  
  if (baseIds.length === 0) {
    console.error('❌ Error: AIRTABLE_BASE_IDS environment variable not set');
    console.error('\nUsage:');
    console.error('  export AIRTABLE_BASE_IDS=base1,base2,base3');
    console.error('  node scripts/airtable-export.js');
    process.exit(1);
  }
  
  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  console.log('🚀 Starting Airtable export...');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`📊 Bases to export: ${baseIds.length}`);
  
  const exports = [];
  
  for (const baseId of baseIds) {
    try {
      const baseExport = await exportBase(apiKey, baseId.trim());
      exports.push(baseExport);
      
      // Save individual base export
      const baseFilename = `base-${baseId}.json`;
      const baseFilepath = join(OUTPUT_DIR, baseFilename);
      writeFileSync(baseFilepath, JSON.stringify(baseExport, null, 2), 'utf-8');
      
      // Save CSV files for each table
      for (const table of baseExport.tables) {
        const csvFilename = `base-${baseId}_table-${table.tableName.replace(/[^a-z0-9]/gi, '-')}.csv`;
        const csvFilepath = join(OUTPUT_DIR, csvFilename);
        writeFileSync(csvFilepath, table.csv, 'utf-8');
        console.log(`      💾 Saved CSV: ${csvFilename}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to export base ${baseId}:`, error.message);
      // Continue with other bases
    }
  }
  
  // Create summary export
  const summary = {
    exportedAt: new Date().toISOString(),
    totalBases: exports.length,
    totalTables: exports.reduce((sum, base) => sum + base.tables.length, 0),
    totalRecords: exports.reduce((sum, base) => 
      sum + base.tables.reduce((tableSum, table) => tableSum + table.recordCount, 0), 0
    ),
    bases: exports.map(base => ({
      baseId: base.baseId,
      tableCount: base.tables.length,
      recordCount: base.tables.reduce((sum, table) => sum + table.recordCount, 0),
      tables: base.tables.map(table => ({
        name: table.tableName,
        recordCount: table.recordCount
      }))
    }))
  };
  
  const summaryFilepath = join(OUTPUT_DIR, 'export-summary.json');
  writeFileSync(summaryFilepath, JSON.stringify(summary, null, 2), 'utf-8');
  
  console.log('\n✨ Export complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   Bases exported: ${summary.totalBases}`);
  console.log(`   Tables exported: ${summary.totalTables}`);
  console.log(`   Records exported: ${summary.totalRecords}`);
  console.log(`\n📁 Files saved to: ${OUTPUT_DIR}`);
  console.log(`   - export-summary.json (overview)`);
  console.log(`   - base-*.json (full data)`);
  console.log(`   - base-*_table-*.csv (CSV exports)`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exportAllBases().catch(error => {
    console.error('\n❌ Export failed:', error);
    process.exit(1);
  });
}

export { exportAllBases, exportBase, exportTable };

