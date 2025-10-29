# Automated Cross-Reference Checking System - Quick Reference

## What It Does

Links all evidence to two core revelations:
1. **Dan & Kay Shopify platform was paid by Dan & Jax UK company RegimA Zone Ltd**
2. **RWD ZA has no independent revenue stream of its own**

## Quick Start

```bash
# Run basic check
npm run test:automated-cross-reference

# Generate full report
npm run validate-cross-references

# Run with verbose output
python3 scripts/automated_cross_reference_checker.py --verbose

# Run unit tests
npm run test:automated-cross-reference-unit
```

## What It Checks

### 4 Core Revelations

1. **Shopify Platform Payment** (55 docs)
   - RegimA Zone Ltd (UK) owned and paid for platform
   - Evidence: JF02, JF08, JF-ITS1

2. **RWD No Revenue** (15 docs)
   - RWD ZA has no independent revenue stream
   - Evidence: JF02, JF-DLA1, JF-DLA2, JF-DLA3

3. **Platform Cost Non-payment** (18 docs)
   - RWD never compensated platform owner
   - Evidence: JF02, JF-ITS1, JF-BS1

4. **Unjust Enrichment** (16 docs)
   - R2.94M-R6.88M from platform use without compensation
   - Evidence: JF02, JF-DLA1, JF-DLA2, JF-DLA3

### 8 Critical Files Validated

- `jax-response/AD/1-Critical/RWD_REVENUE_INTEGRITY_ANALYSIS.md` ✅
- `jax-response/AD/1-Critical/PARA_7_9-7_11.md` ✅
- `jax-response/AD/1-Critical/PARA_7_7-7_8.md` ✅
- `jax-response/AD/1-Critical/PARA_7_6.md` ✅
- `jax-response/revenue-theft/README.md` ⚠️
- `jax-response/README.md` ⚠️
- `FINAL_ANSWERING_AFFIDAVIT_ABRIDGED.md` ✅
- `FINAL_ANSWERING_AFFIDAVIT_COMPLETE.md` ⚠️

### 7 Directories Scanned

- `jax-response/AD` (16.5% coverage)
- `jax-response/revenue-theft` (55.0% coverage)
- `jax-response/financial-flows` (0.0% coverage)
- `jax-response/family-trust` (0.0% coverage)
- `jax-response/analysis-output` (20.6% coverage)
- `FINAL_AFFIDAVIT_PACKAGE/ANNEXURES` (14.9% coverage)
- `evidence` (12.1% coverage)

## Output Interpretation

### Success Indicators

✅ **Complete references** - File references 2+ core revelations
⚠️  **Missing references** - File references <2 revelations (warning only)
❌ **Validation failed** - Critical errors in file structure

### Coverage Metrics

- **High (>40%)**: Excellent cross-referencing
- **Medium (20-40%)**: Good cross-referencing
- **Low (<20%)**: May need attention

### Current Status

- **Total Errors**: 0
- **Total Warnings**: 3
- **Status**: ⚠️ PASSED WITH WARNINGS

## Files Generated

- `cross_reference_validation_report.json` - Full JSON report (gitignored)

## Key Evidence Links

All evidence must link back to the fundamental revelation:

**RegimA Zone Ltd (UK)** paid for Shopify platform since July 2023:
- Platform costs: R140K-R280K over 28 months
- RWD issued invoices for sales on this platform
- **RWD NEVER compensated the platform owner**
- Unjust enrichment: R2.94M-R6.88M

**RWD ZA** has no independent revenue:
- Holds no stock or inventory
- Cannot generate revenue independently
- All "revenue" from invoices for sales on Daniel's platform
- Systematic appropriation without compensation

## Documentation

Full docs: `docs/AUTOMATED_CROSS_REFERENCE_SYSTEM.md`

## Help

```bash
python3 scripts/automated_cross_reference_checker.py --help
```
