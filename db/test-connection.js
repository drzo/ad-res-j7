#!/usr/bin/env node

const { db, pool } = require('./config');
const { sql } = require('drizzle-orm');

async function testConnection() {
  console.log('Testing PostgreSQL database connection...\n');
  
  try {
    // Test basic connection
    const result = await db.execute(sql`SELECT NOW() as current_time, version() as db_version`);
    
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    console.log('Database version:', result.rows[0].db_version);
    
    // Test environment variables
    console.log('\n📊 Database Configuration:');
    console.log('- Database:', process.env.PGDATABASE);
    console.log('- Host:', process.env.PGHOST);
    console.log('- Port:', process.env.PGPORT);
    console.log('- User:', process.env.PGUSER);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();