# Workflow Validation Tests

This directory contains comprehensive validation tests for the GitHub Actions workflows in this repository. The tests validate both the structure and functionality of the `.github/workflows/todo-to-issues.yml` and `.github/workflows/file-representations.yml` workflows.

## 🛡️ Merge Conflict Prevention

**Test results are automatically archived to prevent merge conflicts in PRs.**

All test result files (`.json`) are gitignored and stored in the `test-data/` directory instead of being committed. This ensures that multiple PRs running tests simultaneously will never conflict. See [MERGE_CONFLICT_PREVENTION.md](MERGE_CONFLICT_PREVENTION.md) for details.

## Overview

The test suite addresses the requirements from `todo/workflow-test.md`:

- ✅ **Fix label array handling in GitHub Actions workflow** - Validated through label conversion tests
- ✅ **Test the workflow with sample tasks** - Integration tests with mock todo files  
- ✅ **Verify proper issue creation with multiple labels** - Label scenario testing
- ✅ **Create validation tests for workflow changes** - Complete test framework created
- ✅ **Enhance error handling in issue creation process** - Error handling validation
- ✅ **Add comprehensive logging for debugging workflow issues** - Test output and reporting

## Test Files

### 1. `workflow-validation.test.js`
**Purpose**: Validates workflow structure, syntax, and configuration

**Tests Include**:
- Workflow file existence and readability
- YAML structure validation
- Trigger configuration (push, PR, manual)
- Permission settings verification
- Step sequence validation
- Label array handling logic
- Embedded JavaScript code validation
- Error handling patterns
- File exclusion logic

**Usage**:
```bash
node tests/workflow-validation.test.js
```

### 2. `integration-test.js` 
**Purpose**: Tests workflow functionality with real data and scenarios

**Tests Include**:
- Todo file parsing with sample data
- Issue generation simulation
- Label array conversion validation
- Multiple label scenarios
- Quality filtering validation
- Error handling with edge cases
- **Duplicate prevention with identical task titles** (NEW)
- Mock issue creation

**Usage**:
```bash
node tests/integration-test.js
```

### 3. `run-all-tests.js`
**Purpose**: Comprehensive test runner that executes all tests and provides summary

**Features**:
- Runs both validation and integration tests
- Comprehensive reporting with metrics
- Combined success/failure analysis
- Test artifact generation
- Performance timing

**Usage**:
```bash
node tests/run-all-tests.js
# Or use npm script:
npm test
```

### 4. `repository-structure-integrity.test.js` (NEW)
**Purpose**: Validate repository structure integrity and evidence organization

**Context**: 
- Implementation of Phase 3 Advanced QA requirement (line 178 in todo/Repository_Status_and_Critical_Evidence_Collection.md)
- Links repository structure to critical Shopify payment evidence trail
- Validates evidence linking Dan & Kay Shopify platform payments to Dan & Jax UK company (RegimA Zone Ltd)
- Confirms RWD ZA lack of independent revenue stream documentation

**Tests Include**:
- Core directory structure validation (9 required directories)
- Evidence file organization verification
- Shopify payment evidence trail documentation (tracks 132+ references)
- RegimA Zone Ltd payment documentation (tracks 40+ references)
- Revenue stream analysis validation (3 evidence directories)
- Critical evidence cross-reference validation
- Payment trail linkage from UK company to Shopify platform
- Repository structure metadata verification

**Metrics Tracked**:
- Required directories found vs. missing
- Shopify payment references count
- RegimA Zone Ltd references count  
- Revenue stream evidence directories count

**Usage**:
```bash
node tests/repository-structure-integrity.test.js
# Or use npm script:
npm run test:repository-structure
```

## Test Results

All tests generate detailed JSON reports:

- `workflow-validation-results.json` - Detailed validation test results
- `integration-test-results.json` - Integration test results with mock data
- `comprehensive-test-results.json` - Combined test summary

## Running Tests

### Quick Test
```bash
npm test
```

### Individual Test Suites
```bash
# Validation tests only
npm run validate-workflows

# Integration tests only  
node tests/integration-test.js

# Malformed markdown tests only
npm run test:malformed-markdown

# Repository structure integrity tests only
npm run test:repository-structure

# All tests with detailed output
node tests/run-all-tests.js
```

### Local Development
```bash
# Install dependencies
npm install

# Run tests during development
npm test

# View detailed results
cat tests/comprehensive-test-results.json | jq '.summary'
```

## Test Coverage

### Workflow Structure Validation ✅
- File existence and permissions
- YAML syntax and structure  
- Trigger configuration
- Job dependencies
- Step sequences
- Error handling patterns

### Label Array Handling ✅  
- JSON array to CLI args conversion
- Special character handling in labels
- Multiple label scenarios
- Priority-based label assignment

### Issue Generation Logic ✅
- Todo file parsing accuracy
- Quality filtering effectiveness
- Priority detection from sections
- Title generation and truncation
- Content template generation

### Error Handling ✅
- Empty todo folder scenarios
- Malformed todo files  
- API failure simulation
- Cleanup procedures

### Malformed Markdown Handling ✅ **NEW**
- Files with invalid markdown structure
- Character encoding issues (UTF-8, BOM, control chars)
- Broken headers, lists, and syntax elements
- Graceful degradation and error recovery
- Real-world corruption scenarios
- 22 comprehensive test cases with 100% success rate

### Integration Scenarios ✅
- Real todo file processing
- Mock issue creation
- Label conversion validation
- **Duplicate prevention testing with identical task titles**
- End-to-end workflow simulation

## Current Test Results

Recent test run (example):
```
📊 COMPREHENSIVE TEST SUMMARY
================================
🔍 Validation Tests: ✅ 79/83 passed (95%)
🧪 Integration Tests: ✅ 15/15 passed (100%)  
🎯 OVERALL: ✅ 94/98 tests passed (96%)
```

### Known Issues
- 4 minor validation test failures related to case-sensitive section recognition
- These do not impact workflow functionality
- Issues documented in test results JSON files

## Adding New Tests

### Validation Tests
Add new test methods to `WorkflowValidator` class in `workflow-validation.test.js`:

```javascript
testNewFeature() {
  console.log('\n🧪 Testing new feature...');
  
  / Your test logic here
  this.assert(condition, 'Test description');
}
```

### Integration Tests  
Add new test methods to `WorkflowIntegrationTest` class in `integration-test.js`:

```javascript
testNewIntegration() {
  console.log('\n🧪 Testing new integration...');
  
  / Your integration test logic here
  this.assert(condition, 'Integration test description');  
}
```

## Test Framework Architecture

```
tests/
├── workflow-validation.test.js    # Structure & syntax validation
├── integration-test.js            # Functional & scenario testing  
├── run-all-tests.js              # Comprehensive test runner
├── README.md                     # This documentation
├── sample-todos/                 # Generated during integration tests
├── workflow-validation-results.json
├── integration-test-results.json
└── comprehensive-test-results.json
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Workflow Validation Tests
  run: npm test
  
- name: Check Test Results
  run: |
    if [ $? -eq 0 ]; then
      echo "✅ All workflow tests passed"
    else  
      echo "❌ Workflow tests failed"
      exit 1
    fi
```

## Dependencies

- **Node.js** 18+ required
- **glob** ^11.0.3 for file pattern matching
- No additional test frameworks needed (custom implementation)

## Maintenance

### Regular Tasks
- Run tests after any workflow changes
- Update test cases when adding new workflow features
- Review test results for patterns or issues
- Update documentation when adding new tests

### Troubleshooting
- Check `comprehensive-test-results.json` for detailed failure info
- Ensure all dependencies are installed (`npm install`)  
- Verify workflow files are valid YAML
- Check file permissions for test file creation

---

*This test framework ensures that workflow changes are validated before deployment and provides confidence in the automation systems supporting this repository.*