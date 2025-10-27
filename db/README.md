# Database Setup Guide

This directory contains database migration scripts and managers for the ad-res-j7 project.

## Quick Start

### 1. Configure Database Connection

Create a `.env` file in the project root with your PostgreSQL connection details:

```bash
cp .env.example .env
```

Edit `.env` and set your DATABASE_URL:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ad_res_j7
```

### 2. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-client
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 3. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE ad_res_j7;

# Exit
\q
```

### 4. Run Migrations

```bash
# Install dependencies
npm ci

# Run base migration
npm run db:migrate

# Run hierarchical issues migration (optional)
npm run db:hierarchy:setup

# Run hypergraph migration (optional)
npm run db:hypergraph:setup

# Run lex inference migration (optional)
npm run db:lex:setup
```

## Database Configuration

### Connection String Format

```
postgres://[user]:[password]@[host]:[port]/[database]
```

**Default local setup:**
- User: `postgres`
- Password: `postgres`
- Host: `localhost`
- Port: `5432`
- Database: `ad_res_j7`

**CI/Testing (GitHub Actions):**
- User: `testuser`
- Password: `testpass`
- Host: `localhost`
- Port: `5432`
- Database: `testdb`

### Common Issues

#### "role 'root' does not exist"

This error occurs when PostgreSQL tries to connect with a user that doesn't exist. 

**Solution:** Make sure your DATABASE_URL uses a valid PostgreSQL user:
- For local development: Use `postgres` (the default superuser)
- For CI: The workflow configures `testuser` automatically
- Never use `root` as PostgreSQL user (that's for MySQL)

**Fix:**
```bash
# Edit your .env file
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ad_res_j7
```

#### "DATABASE_URL must be set"

**Solution:** Create a `.env` file in the project root:
```bash
cp .env.example .env
```

## Available Scripts

### Core Database
- `npm run db:test` - Test database connection
- `npm run db:migrate` - Run base schema migration

### Hierarchical Issues
- `npm run db:hierarchy:setup` - Setup hierarchical issues schema
- `npm run db:hierarchy:stats` - Show hierarchy statistics
- `npm run db:hierarchy:demo` - Run demo
- `npm run db:hierarchy:populate` - Populate hierarchical issues

### Hypergraph
- `npm run db:hypergraph:setup` - Setup hypergraph schema
- `npm run db:hypergraph:stats` - Show hypergraph statistics
- `npm run db:hypergraph:demo` - Run demo
- `npm run db:hypergraph:populate` - Populate hypergraph data

### Lex Inference Engine
- `npm run db:lex:setup` - Setup lex inference schema
- `npm run db:lex:demo` - Run lex demo
- `npm run db:lex:analyze` - Run lex analysis

### Case Management
- `npm run db:list-docs` - List all case documents
- `npm run db:list-issues` - List all issues
- `npm run db:list-evidence` - List all evidence
- `npm run db:import` - Import case data

## Schema Overview

The database contains multiple schemas for different aspects of the legal case:

1. **Base Schema** (`migrate.js`)
   - `case_documents` - Legal documents and filings
   - `evidence_records` - Evidence items
   - `issues` - Case issues and tasks
   - `test_results` - Test execution results
   - `affidavit_amendments` - Affidavit changes

2. **Hierarchical Issues** (`hierarchical-issues-migrate.js`)
   - `legal_arguments` - Legal argument structures
   - `issue_paragraphs` - Issue paragraph content
   - `issue_argument_links` - Links between issues and arguments
   - `paragraph_issue_links` - Links between paragraphs and issues

3. **Hypergraph** (`hypergraph-migrate.js`)
   - `hypergraph_nodes` - Entity nodes
   - `hypergraph_edges` - Relationship edges
   - `hypergraph_relations` - Node-edge relationships
   - `hypergraph_patterns` - Query patterns

4. **Lex Inference** (`lex-inference-migrate.js`)
   - Legal reasoning and attention mechanisms
   - Transformer-based legal analysis

## GitHub Actions CI

The GitHub Actions workflows automatically configure PostgreSQL:

```yaml
services:
  postgres:
    image: postgres:15
    env:
      POSTGRES_USER: testuser
      POSTGRES_PASSWORD: testpass
      POSTGRES_DB: testdb
    ports: ['5432:5432']

env:
  DATABASE_URL: postgres://testuser:testpass@localhost:5432/testdb
```

No additional configuration is needed for CI runs.
