# Comprehensive Evidence Index Usage Guide

## Overview

The Comprehensive Evidence Index is a complete catalog of all files in the ad-res-j7 repository (Case 2025-137857). It provides multiple ways to locate and reference evidence, documentation, and supporting materials.

## Index Files

The index is available in two formats:

1. **COMPREHENSIVE_EVIDENCE_INDEX.md** - Human-readable Markdown format
   - Best for browsing and visual navigation
   - Includes formatted tables and statistics
   - Located at repository root

2. **COMPREHENSIVE_EVIDENCE_INDEX.json** - Machine-readable JSON format
   - Best for programmatic access and automation
   - Contains complete metadata for all files
   - Located at repository root

## How to Use the Index

### Finding Evidence by Code

**Use Case:** You need to find all files related to a specific evidence code (e.g., JF5, JF-DLA1, JAX)

**Steps:**
1. Open `COMPREHENSIVE_EVIDENCE_INDEX.md`
2. Navigate to the "Evidence Code References" section
3. Find your evidence code and note how many files reference it
4. Search the document for that code to find specific files
5. Or use the "Complete File Listing by Category" section and search (Ctrl+F) for the code

**Example:**
```
Evidence Code: JF5
Files with code: 26
Search results show locations like:
- FINAL_AFFIDAVIT_PACKAGE/ANNEXURES/JF05/...
- jax-response/evidence-attachments/JF5-...
```

### Finding Files by Type

**Use Case:** You need all files of a certain type (Evidence, Analysis, Affidavits, etc.)

**Steps:**
1. Open `COMPREHENSIVE_EVIDENCE_INDEX.md`
2. Navigate to "Statistics Overview" → "Files by Category"
3. Note the file count for your category
4. Scroll to "Complete File Listing by Category"
5. Find your category section for a complete list

**Categories Available:**
- Documents (570+ files)
- Jax Response (300+ files)
- Evidence (276+ files)
- Configuration/Data (176+ files)
- Scripts/Tools (134+ files)
- Analysis (115+ files)
- Images (68+ files)
- Affidavit (14+ files)
- Email Correspondence (12+ files)
- Spreadsheets (11+ files)
- Others

### Finding Files by Directory

**Use Case:** You need to understand what's in a specific directory

**Steps:**
1. Open `COMPREHENSIVE_EVIDENCE_INDEX.md`
2. Navigate to "Directory Structure Index"
3. Find your directory (directories are sorted alphabetically)
4. View the complete file listing with sizes

**Example:**
```
### `FINAL_AFFIDAVIT_PACKAGE/ANNEXURES/JF01/` (2 files, 95.38 KB)
- Re_ The RegimA Group results and Computer Expense analysis.eml (63.18 KB)
- Re_ belongs to regimA.eml (31.40 KB)
```

### Finding Large Files

**Use Case:** You need to identify files consuming significant storage

**Steps:**
1. Open `COMPREHENSIVE_EVIDENCE_INDEX.json`
2. Parse the JSON and sort by `size_bytes`
3. Or review the statistics sections in the Markdown file

**Programmatic Example:**
```python
import json

with open('COMPREHENSIVE_EVIDENCE_INDEX.json') as f:
    data = json.load(f)

# Sort files by size
large_files = sorted(data['files'], 
                    key=lambda x: x['size_bytes'], 
                    reverse=True)[:10]

for f in large_files:
    print(f"{f['size_human']}: {f['path']}")
```

### Finding Files by Extension

**Use Case:** You need all PDF files, or all JSON files, etc.

**Steps:**
1. Open `COMPREHENSIVE_EVIDENCE_INDEX.md`
2. Navigate to "Top File Extensions"
3. Note the count for your extension
4. Use "Complete File Listing by Category" and filter by extension

**Or use JSON:**
```python
import json

with open('COMPREHENSIVE_EVIDENCE_INDEX.json') as f:
    data = json.load(f)

# Find all PDFs
pdf_files = [f for f in data['files'] if f['extension'] == '.pdf']
print(f"Found {len(pdf_files)} PDF files")
```

## Repository Statistics

The index provides comprehensive statistics:

- **Total Files**: 1,700+ files cataloged
- **Total Size**: ~170 MB
- **File Categories**: 14 distinct categories
- **File Extensions**: 23 different types
- **Top-Level Directories**: 33+ directories
- **Evidence Codes**: 9+ codes tracked

## Regenerating the Index

The index is automatically maintained but can be manually regenerated:

```bash
cd /home/runner/work/ad-res-j7/ad-res-j7
python scripts/generate_comprehensive_evidence_index.py
```

**When to Regenerate:**
- After adding new evidence files
- After reorganizing directory structure
- After deleting or archiving files
- Before major case milestones or submissions

## Integration with Other Indices

The Comprehensive Evidence Index complements other repository indices:

- **ANNEXURES_INDEX.md** - Detailed court annexure descriptions
- **FORENSIC_EVIDENCE_INDEX.md** - Forensic analysis evidence tracking
- **Documentation Catalog** (`docs/README.md`) - Legal document index
- **EVIDENCE_MAPPING.json** - Paragraph-to-evidence mappings

## Advanced Usage

### Cross-Referencing Evidence

Combine the Comprehensive Evidence Index with EVIDENCE_MAPPING.json:

```python
import json

# Load both indices
with open('COMPREHENSIVE_EVIDENCE_INDEX.json') as f:
    file_index = json.load(f)

with open('EVIDENCE_MAPPING.json') as f:
    evidence_map = json.load(f)

# Find all files for a specific evidence code
code = 'JF5'
files = [f for f in file_index['files'] if code in f['evidence_codes']]

# Cross-reference with evidence mapping
for f in files:
    print(f"File: {f['path']}")
    print(f"Size: {f['size_human']}")
    print(f"Category: {f['category']}")
```

### Evidence Collection Verification

Use the index to verify evidence collection completeness:

```python
import json

with open('COMPREHENSIVE_EVIDENCE_INDEX.json') as f:
    data = json.load(f)

# Check evidence codes
required_codes = ['JF1', 'JF2', 'JF3', 'JF4', 'JF5', 'JF6', 'JF7', 'JF8', 'JF9', 'JF10']
present_codes = data['statistics']['evidence_codes_count'].keys()

for code in required_codes:
    count = data['statistics']['evidence_codes_count'].get(code, 0)
    status = '✅' if count > 0 else '❌'
    print(f"{status} {code}: {count} files")
```

## Support and Updates

- **Documentation**: This guide and the index itself
- **Script**: `scripts/generate_comprehensive_evidence_index.py`
- **Issues**: Report problems via GitHub issues
- **Updates**: Run the script to regenerate after changes

## Best Practices

1. **Always use the latest version** - Regenerate before important tasks
2. **Reference by evidence code** - Use standardized codes for consistency
3. **Check multiple indices** - Cross-reference with specialized indices
4. **Document file additions** - Update evidence codes in file paths/names
5. **Maintain organization** - Keep files in appropriate category directories

## Quick Reference Table

| Task | Best Method | Index File |
|------|-------------|------------|
| Find specific evidence code | Search by code | Markdown |
| Browse by category | Category sections | Markdown |
| List directory contents | Directory index | Markdown |
| Programmatic access | JSON parsing | JSON |
| Find large files | Size sorting | JSON |
| Count file types | Extension stats | Both |
| Evidence verification | Code statistics | Both |
| Repository overview | Statistics section | Markdown |

---

**Last Updated:** October 21, 2025  
**Index Version:** 1.0  
**Repository:** cogpy/ad-res-j7  
**Case:** 2025-137857
