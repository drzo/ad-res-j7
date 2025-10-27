#!/usr/bin/env node

const { db, pool } = require('./config');
const { sql } = require('drizzle-orm');

/**
 * Migration script for hierarchical issue structure
 * Adds support for feature-level issues, paragraphs, and legal arguments
 */
async function migrateHierarchicalIssues() {
  console.log('🔄 Migrating database for hierarchical issue structure...\n');

  try {
    // Add new columns to issues table
    console.log('📊 Updating issues table...');
    await db.execute(sql`
      ALTER TABLE issues 
      ADD COLUMN IF NOT EXISTS issue_type VARCHAR(50) DEFAULT 'task',
      ADD COLUMN IF NOT EXISTS parent_issue_id INTEGER,
      ADD COLUMN IF NOT EXISTS rank_order INTEGER,
      ADD COLUMN IF NOT EXISTS weight INTEGER
    `);
    console.log('  ✅ Issues table updated');

    // Create legal_arguments table
    console.log('\n📚 Creating legal_arguments table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS legal_arguments (
        id SERIAL PRIMARY KEY,
        argument_name VARCHAR(255) NOT NULL,
        description TEXT,
        argument_type VARCHAR(100),
        strategy TEXT,
        status VARCHAR(50) DEFAULT 'active',
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✅ Legal arguments table created');

    // Create issue_paragraphs table
    console.log('\n📝 Creating issue_paragraphs table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS issue_paragraphs (
        id SERIAL PRIMARY KEY,
        feature_issue_id INTEGER NOT NULL,
        paragraph_number INTEGER NOT NULL,
        title VARCHAR(255),
        content TEXT,
        rank_order INTEGER NOT NULL,
        weight INTEGER NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (feature_issue_id) REFERENCES issues(id) ON DELETE CASCADE
      )
    `);
    console.log('  ✅ Issue paragraphs table created');

    // Create issue_argument_links table
    console.log('\n🔗 Creating issue_argument_links table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS issue_argument_links (
        id SERIAL PRIMARY KEY,
        issue_id INTEGER NOT NULL,
        argument_id INTEGER NOT NULL,
        link_type VARCHAR(50),
        strength INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
        FOREIGN KEY (argument_id) REFERENCES legal_arguments(id) ON DELETE CASCADE
      )
    `);
    console.log('  ✅ Issue-argument links table created');

    // Create paragraph_issue_links table
    console.log('\n🔗 Creating paragraph_issue_links table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS paragraph_issue_links (
        id SERIAL PRIMARY KEY,
        paragraph_id INTEGER NOT NULL,
        issue_id INTEGER NOT NULL,
        rank_order INTEGER NOT NULL,
        weight INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (paragraph_id) REFERENCES issue_paragraphs(id) ON DELETE CASCADE,
        FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
      )
    `);
    console.log('  ✅ Paragraph-issue links table created');

    // Create indexes for better query performance
    console.log('\n⚡ Creating indexes...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_issues_parent ON issues(parent_issue_id);
      CREATE INDEX IF NOT EXISTS idx_issues_type ON issues(issue_type);
      CREATE INDEX IF NOT EXISTS idx_issues_rank ON issues(rank_order);
      CREATE INDEX IF NOT EXISTS idx_paragraphs_feature ON issue_paragraphs(feature_issue_id);
      CREATE INDEX IF NOT EXISTS idx_paragraphs_rank ON issue_paragraphs(rank_order);
      CREATE INDEX IF NOT EXISTS idx_issue_arg_links ON issue_argument_links(issue_id, argument_id);
      CREATE INDEX IF NOT EXISTS idx_para_issue_links ON paragraph_issue_links(paragraph_id, issue_id);
    `);
    console.log('  ✅ Indexes created');

    console.log('\n✨ Migration complete!\n');
    console.log('New capabilities:');
    console.log('  ✅ Feature-level issues can group task-level issues');
    console.log('  ✅ Paragraphs can organize issues within features');
    console.log('  ✅ Rank ordering and weighting for influence tracking');
    console.log('  ✅ Link issues to legal arguments/strategies');
    console.log('  ✅ Hierarchical queries supported\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateHierarchicalIssues()
    .then(() => {
      console.log('🎉 Migration successful!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Migration error:', error);
      process.exit(1);
    });
}

module.exports = migrateHierarchicalIssues;
