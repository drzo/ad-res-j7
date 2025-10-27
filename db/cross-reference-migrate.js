#!/usr/bin/env node

const { db, pool } = require('./config');
const { sql } = require('drizzle-orm');

/**
 * Migration script for cross-reference integration
 * Adds support for linking issues to documents, evidence, and annexures
 * This prevents issue combinatorial explosion by allowing multiple issues
 * to reference the same underlying evidence/documents
 */
async function migrateCrossReferences() {
  console.log('🔄 Migrating database for cross-reference integration...\n');

  try {
    // Create issue_cross_references table
    console.log('🔗 Creating issue_cross_references table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS issue_cross_references (
        id SERIAL PRIMARY KEY,
        issue_id INTEGER NOT NULL,
        reference_type VARCHAR(100) NOT NULL,
        reference_id VARCHAR(500) NOT NULL,
        reference_path VARCHAR(1000),
        reference_title VARCHAR(500),
        reference_section VARCHAR(255),
        relationship_type VARCHAR(100),
        notes TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_issue 
          FOREIGN KEY (issue_id) 
          REFERENCES issues(id) 
          ON DELETE CASCADE
      )
    `);
    console.log('  ✅ Issue cross-references table created');

    // Create indexes for performance
    console.log('\n📑 Creating indexes for cross-references...');
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_cross_ref_issue_id 
      ON issue_cross_references(issue_id)
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_cross_ref_type 
      ON issue_cross_references(reference_type)
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_cross_ref_reference_id 
      ON issue_cross_references(reference_type, reference_id)
    `);
    
    console.log('  ✅ Indexes created');

    // Create cross_reference_consolidations table for tracking consolidation opportunities
    console.log('\n🔍 Creating cross_reference_consolidations table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS cross_reference_consolidations (
        id SERIAL PRIMARY KEY,
        reference_type VARCHAR(100) NOT NULL,
        reference_id VARCHAR(500) NOT NULL,
        issue_count INTEGER NOT NULL,
        issue_ids JSONB NOT NULL,
        consolidation_status VARCHAR(50) DEFAULT 'detected',
        recommended_action TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        resolved_at TIMESTAMP
      )
    `);
    console.log('  ✅ Cross-reference consolidations table created');

    console.log('\n✅ Cross-reference migration completed successfully!\n');
    
    // Show statistics
    console.log('📊 Cross-Reference Schema Summary:');
    console.log('  - issue_cross_references: Links issues to evidence/docs/annexures');
    console.log('  - cross_reference_consolidations: Tracks consolidation opportunities');
    console.log('  - 3 indexes created for performance');
    console.log('\nReference Types Supported:');
    console.log('  - document: Case documents and affidavits');
    console.log('  - evidence: Evidence records and exhibits');
    console.log('  - annexure: Annexure files');
    console.log('  - paragraph: Legal paragraphs (AD/JF)');
    console.log('  - timeline_event: Timeline events');
    console.log('  - analysis: Analysis documents');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateCrossReferences()
    .then(() => {
      console.log('\n🎉 Migration complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Migration error:', error);
      process.exit(1);
    });
}

module.exports = { migrateCrossReferences };
