#!/usr/bin/env node

const { db, pool } = require('./config');
const { sql } = require('drizzle-orm');

async function testConnection() {
  console.log('Testing PostgreSQL database connection...\n');
  
  // Show configuration (hide password)
  const dbUrl = process.env.DATABASE_URL || '';
  const safeUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log('📊 Using DATABASE_URL:', safeUrl || '(not set)');
  console.log('');
  
  try {
    // Test basic connection
    const result = await db.execute(sql`SELECT NOW() as current_time, version() as db_version`);
    
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    console.log('Database version:', result.rows[0].db_version);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Ensure PostgreSQL is running');
    console.error('2. Check DATABASE_URL in .env file');
    console.error('3. Verify user has correct permissions');
    console.error('4. See db/README.md for setup instructions');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();