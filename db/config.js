const { Pool, neonConfig } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const ws = require('ws');
require('dotenv').config();

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?\n\n" +
    "For local development, create a .env file with:\n" +
    "  DATABASE_URL=postgres://postgres:postgres@localhost:5432/ad_res_j7\n\n" +
    "See .env.example for more details.",
  );
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

module.exports = { db, pool };