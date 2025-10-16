# AD Response J7 - Case 2025-137857 Analysis

## Project Overview

This is a Node.js-based testing and validation tool for GitHub Actions workflows with PostgreSQL database support. The repository contains comprehensive analysis and documentation for Case 2025-137857, involving Peter Andrew Faucitt (Applicant) vs. Jacqueline Faucitt and Daniel James Faucitt (Respondents) in the High Court of South Africa.

**Purpose:** Legal case documentation management with automated workflow validation for GitHub Actions that convert todo items to issues and maintain file format representations. Now includes PostgreSQL database for tracking documents, evidence, issues, and amendments.

**Type:** Command-line testing tool with database backend (no frontend)

## Project Structure

- **`case_2025_137857/`** - Court case documents and evidence
- **`affidavit_work/`** - Affidavit analysis and drafts
- **`evidence/`** - Bank records, invoices, Shopify reports
- **`jax-dan-response/`** - Response documents and analysis
- **`jax-response/`** - Detailed paragraph-by-paragraph responses organized by priority
- **`docs/`** - Technical and legal documentation
- **`scripts/`** - Utility scripts for issue management
- **`tests/`** - Comprehensive test suite (128 tests)
- **`todo/`** - Todo items that get converted to GitHub issues

## Technology Stack

- **Runtime:** Node.js 20
- **Package Manager:** npm
- **Database:** PostgreSQL (Neon) with Drizzle ORM
- **Dependencies:** glob, @neondatabase/serverless, drizzle-orm, ws, dotenv
- **Testing Framework:** Custom test runner with validation and integration tests
- **Knowledge Graph:** Hypergraph database for relationship modeling

## Running the Project

### Run Tests
```bash
npm test                  # Run all 128 tests (validation + integration)
npm run test:validation   # Run workflow structure tests only
npm run test:integration  # Run functional tests only
npm run test:simple       # Run simple workflow tests
```

### Database Commands
```bash
npm run db:test           # Test database connection
npm run db:migrate        # Create database tables
npm run db:list-issues    # View critical issues
npm run db:list-docs      # List case documents
npm run db:list-evidence  # View evidence records
npm run db:import <dir>   # Import documents from directory
```

### Hypergraph Commands
```bash
npm run db:hypergraph:setup     # Create hypergraph schema
npm run db:hypergraph:populate  # Populate with case data
npm run db:hypergraph:stats     # View graph statistics
npm run db:hypergraph:demo      # Run demo with sample data
```

### Current Status
- **All Tests:** 128/128 passing (100% success rate)
- **Test Coverage:** 
  - 85 validation tests (workflow structure and syntax)
  - 43 integration tests (functional behavior)
- **Database:** 
  - 9 tables (5 case tables + 4 hypergraph tables)
  - 12 critical issues tracked
  - 26 hypergraph nodes, 15 edges, 37 relations

## Automated Workflows

The project validates two main GitHub Actions workflows:

1. **todo-to-issues** - Automatically creates GitHub issues from tasks in the `todo/` folder
2. **file-representations** - Maintains JSON and Markdown file format synchronization

## Recent Changes

**2025-10-15:** Initial Replit setup completed
- Installed Node.js 20 and dependencies
- Configured test runner workflow (console output)
- Verified all 128 tests passing
- Created project documentation

## Development Notes

- This is a testing tool with no web frontend
- The workflow is configured for console output only
- Tests run automatically via the "Test Runner" workflow
- Test results are archived in `test-data/` directory
- Project follows existing file structure and conventions from GitHub import
