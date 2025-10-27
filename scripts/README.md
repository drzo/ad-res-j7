# Scripts Directory

This directory contains automation scripts for maintaining the ad-res-j7 repository.

## Evidence Completeness Validation

### `validate_evidence_completeness.py` and `validate-evidence-completeness.js`
**Phase 3 - Advanced QA (Line 150 from Repository_Status_and_Critical_Evidence_Collection.md)**

Validates evidence completeness and links each aspect to the underlying revelation:
- Dan & Kay Shopify platform was paid by Dan & Jax UK company RegimA Zone Ltd
- RWD ZA actually has no revenue stream of its own

**Usage:**
```bash
# Python version
python3 scripts/validate_evidence_completeness.py

# JavaScript/Node version
node scripts/validate-evidence-completeness.js

# Or via npm
npm run validate-evidence-completeness
npm run validate-evidence-completeness-py
```

**Features:**
- Validates Phase 1 Critical Evidence (80% threshold)
- Validates Phase 2 High Priority Evidence (60% threshold)
- Validates Revenue Stream Evidence linking to core revelation (100% threshold)
- Checks linkage to RegimA Zone Ltd payment structure
- Generates comprehensive validation reports
- Provides actionable recommendations

**Evidence Categories Validated:**
1. **Phase 1 Critical**: JF-RP1, JF-RP2, JF-DLA1-3, JF-PA1-4, JF-BS1, JF5 agreements, UK tax, Chesno fraud, 8-year restoration
2. **Phase 2 High Priority**: System access logs, correspondence, IT invoices, historical model, Rynette's access, director exclusion
3. **Revenue Stream Evidence**: Shopify payments, RegimA Zone Ltd UK company docs, RWD ZA revenue analysis, Dan & Kay platform, UK-SA payment flows

**Output:**
- Detailed phase-by-phase completeness report
- Revenue stream linkage analysis (🔗 indicates linkage found)
- Overall completeness percentage
- Actionable recommendations
- JSON report: `evidence_completeness_validation_report.json`

**Exit Codes:**
- `0`: Evidence completeness validation passed
- `1`: Evidence completeness validation failed

## JSON Validation

### `validate_json.py`
Validates all JSON files in the repository for proper formatting and parseability.

**Usage:**
```bash
# Validate all JSON files in the repository
python3 scripts/validate_json.py

# Validate JSON files in a specific directory
python3 scripts/validate_json.py /path/to/directory
```

**Features:**
- Validates JSON syntax and parseability
- Provides detailed error messages for invalid files
- Returns appropriate exit codes for CI/CD integration
- Processes all JSON files recursively

**Output:**
- ✓ Valid JSON files
- ✗ Invalid JSON files with error details
- Summary statistics

## Date Validation

### `validate_dates.py` and `validate_analysis_dates.py`
Validates date consistency across documentation.

**Usage:**
```bash
python3 scripts/validate_dates.py
python3 scripts/validate_analysis_dates.py

# Or via npm
npm run validate-dates
```

## File Path Validation

### `validate_file_paths.js`
Validates all file paths and references in documentation.

**Usage:**
```bash
node scripts/validate_file_paths.js

# Or via npm
npm run validate-file-paths
```

## Cross-Reference Validation

### `validate_cross_references.py`
Validates cross-references between documents.

**Usage:**
```bash
python3 scripts/validate_cross_references.py
```

## Requirements

- Python 3.x (for Python scripts)
- Node.js (for JavaScript scripts)
- Standard libraries only (no external dependencies required)

## Exit Codes

- `0`: Validation passed
- `1`: Validation failed

## Integration

These scripts can be integrated into:
- Pre-commit hooks
- GitHub Actions workflows
- Automated testing pipelines
- Manual quality assurance processes
- Court submission readiness checks

## Related Documentation

- `../todo/Repository_Status_and_Critical_Evidence_Collection.md` - Evidence requirements and roadmap
- `../JSON_VALIDATION_DOCUMENTATION.md` - JSON validation processes and best practices
- `../evidence/README.md` - Evidence organization and structure