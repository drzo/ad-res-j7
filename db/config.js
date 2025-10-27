require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const databaseUrl = process.env.DATABASE_URL;

// Detect if using Neon database by checking the hostname
// Neon databases have URLs like: postgres://user:pass@ep-xxx.region.neon.tech/dbname
// Standard PostgreSQL: postgres://user:pass@localhost:5432/dbname
let isNeonDatabase = false;
try {
  const url = new URL(databaseUrl);
  isNeonDatabase = url.hostname.includes('neon.tech') || 
                   url.hostname.endsWith('.neon.tech') ||
                   url.protocol === 'neon:';
} catch (e) {
  // If URL parsing fails, fall back to string matching
  isNeonDatabase = databaseUrl.includes('neon.tech') || 
                   databaseUrl.startsWith('neon://');
}

let pool, db;

if (isNeonDatabase) {
  // Use Neon serverless driver for Neon databases
  const { Pool: NeonPool, neonConfig } = require('@neondatabase/serverless');
  const { drizzle: neonDrizzle } = require('drizzle-orm/neon-serverless');
  const ws = require('ws');
  
  neonConfig.webSocketConstructor = ws;
  pool = new NeonPool({ connectionString: databaseUrl });
  db = neonDrizzle({ client: pool });
} else {
  // Use standard pg driver for regular PostgreSQL databases
  const { Pool: PgPool } = require('pg');
  const { drizzle: pgDrizzle } = require('drizzle-orm/node-postgres');
  
  pool = new PgPool({ connectionString: databaseUrl });
  db = pgDrizzle({ client: pool });
}

module.exports = { db, pool };