#!/usr/bin/env node

const { db } = require('./config');
const { sql } = require('drizzle-orm');

async function createTables() {
  console.log('Creating database tables...');
  
  try {
    // Create case_documents table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS case_documents (
        id SERIAL PRIMARY KEY,
        case_number VARCHAR(50) NOT NULL,
        document_type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        file_path VARCHAR(500),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created case_documents table');

    // Create evidence_records table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS evidence_records (
        id SERIAL PRIMARY KEY,
        case_number VARCHAR(50) NOT NULL,
        evidence_type VARCHAR(100) NOT NULL,
        description TEXT,
        file_path VARCHAR(500),
        source VARCHAR(255),
        date_collected TIMESTAMP,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created evidence_records table');

    // Create issues table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        issue_number INTEGER UNIQUE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        priority VARCHAR(20),
        status VARCHAR(50) DEFAULT 'open',
        labels JSONB,
        assignee VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);
    console.log('✅ Created issues table');

    // Create test_results table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS test_results (
        id SERIAL PRIMARY KEY,
        test_type VARCHAR(100) NOT NULL,
        total_tests INTEGER NOT NULL,
        passed INTEGER NOT NULL,
        failed INTEGER NOT NULL,
        success_rate INTEGER NOT NULL,
        errors JSONB,
        results JSONB,
        run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created test_results table');

    // Create affidavit_amendments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS affidavit_amendments (
        id SERIAL PRIMARY KEY,
        section_number VARCHAR(50),
        paragraph_number VARCHAR(50),
        original_text TEXT,
        amended_text TEXT,
        justification TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created affidavit_amendments table');

    console.log('\n🎉 All tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

createTables();