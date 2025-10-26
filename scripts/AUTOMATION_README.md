# Hierarchical Issues - Automation Scripts & GitHub Actions

## Overview

This directory contains automation scripts and GitHub Actions workflows for implementing and populating the hierarchical issue framework.

## Quick Start

### Using GitHub Actions

1. **Navigate to Actions tab** in your repository
2. **Select "Hierarchical Issues - Setup and Population"** workflow
3. **Click "Run workflow"**
4. **Choose an action:**
   - `setup` - Run database migration only
   - `populate` - Populate issues (requires setup first)
   - `setup-and-populate` - Complete setup and population
   - `demo` - Run quick demo
   - `stats` - Show hierarchy statistics

### Using NPM Scripts

```bash
# Setup database schema
npm run db:hierarchy:setup

# Populate with demo data
npm run db:hierarchy:populate

# View statistics
npm run db:hierarchy:stats

# Parse .hi files
npm run hierarchy:parse grammars/example_hierarchy.hi

# List available templates
npm run hierarchy:list-templates

# Batch populate all templates
npm run hierarchy:batch-populate
```

## Scripts

### 1. `parse-hierarchy-file.js`

Parses hierarchical issue definition files (`.hi` format) and populates database.

**Usage:**
```bash
node scripts/parse-hierarchy-file.js <file.hi>

# With database population
DATABASE_URL=<url> node scripts/parse-hierarchy-file.js grammars/example_hierarchy.hi
```

**Features:**
- Parses `.hi` syntax files
- Generates AST (saved to `hierarchy-ast.json`)
- Populates database if `DATABASE_URL` is set
- Outputs statistics

**Example:**
```bash
npm run hierarchy:parse grammars/example_hierarchy.hi
```

### 2. `create-github-issues.js`

Creates GitHub Issues from hierarchical database structure.

**Usage:**
```bash
# Dry run (preview only)
node scripts/create-github-issues.js dry-run [argumentId]

# Create issues (requires GITHUB_TOKEN)
GITHUB_TOKEN=<token> node scripts/create-github-issues.js create [argumentId]
```

**Features:**
- Generates GitHub Issues from database hierarchy
- Creates argument, feature, and task issues
- Links related issues
- Supports dry-run mode

**Example:**
```bash
# Preview issues for argument ID 1
npm run hierarchy:create-issues
```

### 3. `batch-populate.js`

Batch populate multiple hierarchical structures using predefined templates.

**Usage:**
```bash
# List available templates
node scripts/batch-populate.js list-templates

# Populate specific templates
node scripts/batch-populate.js populate revenue-stream-defense bad-faith-litigation

# Populate from custom JSON
node scripts/batch-populate.js populate custom-template.json

# Populate all templates
node scripts/batch-populate.js populate-all
```

**Features:**
- Predefined templates for common legal arguments
- Custom template support (JSON files)
- Batch processing
- Detailed statistics report

**Available Templates:**
- `revenue-stream-defense` - R1M investment defense argument
- `bad-faith-litigation` - Strategic delay counterclaim

**Example:**
```bash
# Populate all predefined templates
npm run hierarchy:batch-populate
```

## GitHub Actions Workflow

### Workflow: `hierarchical-issues.yml`

Located at: `.github/workflows/hierarchical-issues.yml`

**Triggers:** Manual workflow dispatch

**Actions Available:**
1. **Setup** - Run database migration
2. **Populate** - Populate hierarchical issues
3. **Setup and Populate** - Complete setup
4. **Demo** - Run quick demo
5. **Stats** - Show statistics

**Jobs:**

#### `setup-database`
- Runs database migration
- Creates all necessary tables
- Uploads migration logs

#### `populate-issues`
- Populates hierarchical issues from code
- Generates statistics
- Creates population report

#### `run-demo`
- Executes demo workflow
- Captures output
- Uploads demo data

#### `show-stats`
- Displays hierarchy statistics
- Saves statistics to artifact

#### `parse-grammar-files`
- Parses `.hi` grammar files
- Generates issues from definitions
- Uploads parsed data

#### `test-hierarchy`
- Runs test suite
- Validates hierarchy structure
- Uploads test results

**Inputs:**
- `action` - Action to perform (setup/populate/demo/stats)
- `case_number` - Case number (default: 2025-137857)

**Secrets Required:**
- `DATABASE_URL` - PostgreSQL connection string

**Example:**
```yaml
# In your workflow or manually
with:
  action: 'setup-and-populate'
  case_number: '2025-137857'
```

## Template JSON Format

Custom templates can be defined in JSON:

```json
{
  "argument": {
    "name": "Custom Legal Argument",
    "description": "Description of the argument",
    "type": "defense",
    "strategy": "Overall strategy"
  },
  "features": [
    {
      "number": 1001,
      "title": "Feature Title",
      "description": "Feature description",
      "priority": "critical",
      "paragraphs": [
        {
          "number": 1,
          "title": "Paragraph Title",
          "content": "Paragraph content",
          "rank": 1,
          "weight": 100,
          "tasks": [
            {
              "number": 2001,
              "title": "Task title",
              "rank": 1,
              "weight": 100,
              "priority": "critical"
            }
          ]
        }
      ]
    }
  ]
}
```

Save as `custom-argument.json` and use:
```bash
node scripts/batch-populate.js populate custom-argument.json
```

## Integration with Database

All scripts integrate with the `HierarchicalIssueManager`:

```javascript
const HierarchicalIssueManager = require('../db/hierarchical-issue-manager');
const manager = new HierarchicalIssueManager();

// Use manager methods
await manager.createLegalArgument(...);
await manager.createFeatureIssue(...);
await manager.createParagraph(...);
await manager.createTaskIssue(...);
```

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string

Optional:
- `GITHUB_TOKEN` - For creating GitHub Issues
- `GITHUB_REPOSITORY` - Owner/repo for issue creation

## Output Files

Scripts generate various output files:

- `hierarchy-ast.json` - Parsed AST from `.hi` files
- `parsed-stats.json` - Parsing statistics
- `batch-populate-report.json` - Batch population report
- `hierarchy-stats.txt` - Current hierarchy statistics

## Workflow Artifacts

GitHub Actions upload artifacts:

- `migration-logs` - Database migration logs (7 days)
- `population-report` - Population statistics (30 days)
- `demo-output` - Demo execution results (7 days)
- `hierarchy-statistics` - Current stats (30 days)
- `parsed-hierarchy` - Parsed grammar files (7 days)
- `test-results` - Test execution results (30 days)

## Error Handling

All scripts include error handling:

```javascript
try {
  await operation();
  console.log('✅ Success');
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
```

Check exit codes:
- `0` - Success
- `1` - Error occurred

## Testing

Test the scripts before production use:

```bash
# Test parsing
npm run hierarchy:parse grammars/example_hierarchy.hi

# Test population (dry run)
npm run hierarchy:create-issues

# Test batch populate with single template
node scripts/batch-populate.js populate revenue-stream-defense
```

## Continuous Integration

Add to your CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
- name: Setup Hierarchical Issues
  run: npm run db:hierarchy:setup
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}

- name: Test Hierarchy
  run: npm run test:hierarchical-issues
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Troubleshooting

**Issue:** `DATABASE_URL not set`
- **Solution:** Set the environment variable before running scripts

**Issue:** Parse errors in `.hi` files
- **Solution:** Validate syntax using the grammar documentation in `grammars/README.md`

**Issue:** GitHub API rate limits
- **Solution:** Use authentication token, implement backoff

**Issue:** Migration fails
- **Solution:** Check database permissions, ensure tables don't exist

## Next Steps

1. **Setup Database:** Run `npm run db:hierarchy:setup`
2. **Populate Data:** Run `npm run db:hierarchy:populate`
3. **Verify:** Check `npm run db:hierarchy:stats`
4. **Create Issues:** Use GitHub Actions workflow

## Resources

- [Main Documentation](../HIERARCHICAL_ISSUES_QUICKSTART.md)
- [API Reference](../db/HIERARCHICAL_ISSUES_GUIDE.md)
- [Grammar Guide](../grammars/README.md)
- [Technical Architecture](../HIERARCHICAL_TECHNICAL_ARCHITECTURE.md)

## License

Part of the Hierarchical Issue Framework for Case 2025-137857
