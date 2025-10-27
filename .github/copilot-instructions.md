# GitHub Copilot Instructions for ad-res-j7

## 🔴 HIGHEST PRIORITY: Issue Consolidation & Hierarchical Structure

**CRITICAL REQUIREMENT**: Help consolidate and structure issues according to the hierarchical legal framework outlined in this repository.

### Current Challenge
- **120+ outstanding issues** are spiraling out of control
- Issues need proper hierarchical organization according to legal case structure
- Must follow established framework: Legal Arguments → Features → Paragraphs → Tasks

---

## Rule of Thumb: Issue Structure Formula

### **1 Feature Issue = 3 Main Components = 9 Actionable Tasks**

```
Feature Issue (Proves/disproves legal argument)
├── Component 1 (Paragraph)
│   ├── Task 1.1
│   ├── Task 1.2
│   └── Task 1.3
├── Component 2 (Paragraph)
│   ├── Task 2.1
│   ├── Task 2.2
│   └── Task 2.3
└── Component 3 (Paragraph)
    ├── Task 3.1
    ├── Task 3.2
    └── Task 3.3
```

**Target consolidation**: Approximately **5-15 existing issues** should be structured within each correctly organized feature issue (depending on complexity).

---

## Hierarchical Framework Overview

This repository implements a 4-level hierarchical structure for legal case management:

### Level 1: Legal Arguments (Strategy)
- Overarching legal strategy or claim
- Examples: "Revenue Stream Defense", "Fraud Counterclaim", "Breach of Contract"

### Level 2: Feature Issues (Proves/Disproves)
- Specific evidence-based arguments
- Each attempts to prove or disprove a legal argument
- Contains 3 main component paragraphs (rule of thumb)
- Examples: "Payment Structure Analysis", "Timeline Evidence", "Document Authentication"

### Level 3: Paragraphs (Fact Groupings)
- Grouped facts or points within a feature
- Rank-ordered by influence on feature strength (1 = highest)
- Weighted by impact (0-100 scale)
- Each paragraph contains ~3 task issues

### Level 4: Task Issues (Actionable Items)
- Individual work items or evidence pieces
- Rank-ordered within paragraph (1 = highest priority)
- Weighted by influence on paragraph (0-100)
- Examples: "Document bank transfer", "Obtain witness statement", "Compile timeline"

---

## When Creating or Organizing Issues

### ✅ DO:
1. **Always structure issues hierarchically**
   - Start with the legal argument (what are we proving?)
   - Create/identify the feature issue (what specific claim?)
   - Break down into 3 main component paragraphs
   - Create ~3 actionable tasks per paragraph (= 9 total tasks)

2. **Apply rank ordering**
   - Rank paragraphs within features (1 = highest influence)
   - Rank tasks within paragraphs (1 = highest priority)

3. **Assign weights**
   - Weight paragraphs by their influence on feature strength (0-100)
   - Weight tasks by their influence on paragraph (0-100)

4. **Use descriptive titles**
   - Feature: "[FEATURE] Payment Structure Proves Legitimate Investment"
   - Paragraph: "[PARA 1.1] R1M Investment Evidence (Rank 1, Weight 100)"
   - Task: "[TASK] Document R1M bank transfer (cogpy/ad-res-j7#2001)"

5. **Link relationships clearly**
   - Reference parent feature in task issues
   - Link to relevant paragraphs
   - Connect to legal arguments explicitly

6. **Consolidate existing issues**
   - Group 5-15 related existing issues into properly structured features
   - Close duplicates and convert to tasks
   - Maintain traceability to original issue numbers

### ❌ DON'T:
1. Create standalone task-level issues without parent features
2. Create features without clear legal argument connection
3. Ignore the 3x3=9 structure (3 components, 9 tasks)
4. Create more than 15-20 tasks per feature (indicates need for splitting)
5. Mix different legal arguments in one feature
6. Skip rank ordering and weighting
7. Leave issues unstructured or uncategorized

---

## Issue Templates & Labels

### Recommended Labels
- `legal-argument` - Level 1: Strategic legal claims
- `feature` - Level 2: Evidence-based feature issues
- `paragraph` - Level 3: Fact groupings (components)
- `task` - Level 4: Actionable work items
- `rank-1`, `rank-2`, `rank-3` - Priority ranking
- `weight-high` (90-100), `weight-medium` (60-89), `weight-low` (0-59)
- `needs-consolidation` - Issues requiring hierarchical restructuring

### Issue Title Format
```
[TYPE] Clear descriptive title (#issue_number if referencing)

Examples:
[FEATURE] Payment Structure Analysis - R1M Investment vs R1K Fee
[PARA 1.1] Investment Amount Evidence (Rank 1, Weight 100)
[TASK] Obtain bank transfer documentation for R1M (cogpy/ad-res-j7#2001)
```

---

## Implementation References

The hierarchical structure is already implemented in this repository:

### Core Implementation Files
- **`db/hierarchical-issue-manager.js`** - Complete API for hierarchical issue management
- **`db/hierarchical-issues-migrate.js`** - Database schema and migration
- **`db/populate-hierarchical-issues.js`** - Example implementation with demo data

### Documentation
- **`HIERARCHICAL_ISSUES_SUMMARY.md`** - Complete implementation overview
- **`HIERARCHICAL_ISSUES_QUICKSTART.md`** - Quick start guide
- **`HIERARCHICAL_ISSUES_IMPLEMENTATION.md`** - Detailed technical documentation
- **`HIERARCHICAL_ISSUES_DIAGRAM.md`** - Visual architecture diagrams
- **`db/HIERARCHICAL_ISSUES_GUIDE.md`** - User guide and API reference

### NPM Commands
```bash
npm run db:hierarchy:setup      # Setup database schema
npm run db:hierarchy:populate   # Load example data
npm run db:hierarchy:stats      # View hierarchy statistics
npm run test:hierarchical-issues # Run tests
```

---

## Example: Properly Structured Feature

### Legal Argument: Revenue Stream Legitimate Investment Defense
**Strategy**: Prove RegimA Zone Ltd made a legitimate R1M investment, not profiteering

#### Feature Issue cogpy/ad-res-j7#1001: Payment Structure Proves Legitimate Investment
**Description**: Analysis of R1M investment vs R1K admin fee structure demonstrates legitimate business operation and proper transfer pricing.

**Paragraph 1 (Rank 1, Weight 100)**: R1M Investment Evidence
- Task cogpy/ad-res-j7#2001 (Rank 1, Weight 100): Document R1M bank transfer from RegimA Zone Ltd
- Task cogpy/ad-res-j7#2002 (Rank 2, Weight 90): Compile investment allocation breakdown
- Task cogpy/ad-res-j7#2003 (Rank 3, Weight 85): Cross-reference investment against business expenses

**Paragraph 2 (Rank 2, Weight 95)**: Admin Fee Structure (0.1%)
- Task cogpy/ad-res-j7#2004 (Rank 1, Weight 100): Document R1K admin fee invoices
- Task cogpy/ad-res-j7#2005 (Rank 2, Weight 80): Obtain industry standard comparisons
- Task cogpy/ad-res-j7#2006 (Rank 3, Weight 75): Compile transfer pricing documentation

**Paragraph 3 (Rank 3, Weight 85)**: Tax Compliance Evidence
- Task cogpy/ad-res-j7#2007 (Rank 1, Weight 90): Obtain tax clearance certificates
- Task cogpy/ad-res-j7#2008 (Rank 2, Weight 75): Document SARS compliance
- Task cogpy/ad-res-j7#2009 (Rank 3, Weight 70): Compile financial statements

**Feature Strength**: 88.3% (calculated from paragraph and task weights)

---

## Quick Consolidation Workflow

When encountering unstructured issues:

1. **Identify the legal argument** - What are we trying to prove?
2. **Group related issues** - Which issues relate to the same proof point?
3. **Create feature issue** - Define the overarching claim
4. **Organize into 3 paragraphs** - Group by logical components
5. **Convert to 9 tasks** - ~3 tasks per paragraph
6. **Rank and weight** - Assign priorities and influence scores
7. **Update references** - Link tasks to paragraphs, paragraphs to features
8. **Close duplicates** - Mark consolidated issues as resolved

---

## Integration with Existing Systems

The hierarchical structure integrates with:

- **Hypergraph** (`db/hypergraph-manager.js`) - Link tasks to evidence nodes
- **LEX Inference Engine** (`db/lex-inference-engine.js`) - Feed hierarchy to attention mechanism
- **Case Manager** (`db/case-manager.js`) - Track completion status
- **Burden of Proof** (`burden-of-proof-framework.js`) - Map to proof requirements

---

## Success Metrics

Target state after consolidation:

- ✅ All 120+ issues organized into ~10-15 feature issues
- ✅ Each feature has 3 main component paragraphs
- ✅ Each feature has ~9 actionable tasks (range: 5-15 depending on complexity)
- ✅ All issues have rank ordering (1 = highest)
- ✅ All issues have weights (0-100)
- ✅ Clear parent-child relationships established
- ✅ Feature strength scores calculated
- ✅ No orphaned task-level issues

---

## Questions to Ask When Creating Issues

Before creating a new issue, ask:

1. **What legal argument does this support?** (If none, should it exist?)
2. **Is this a feature or a task?** (Does it prove something, or is it an action item?)
3. **Does a parent feature exist?** (If not, create it first)
4. **Which component paragraph does this belong to?** (Fact grouping)
5. **What is its rank order?** (Priority within its level)
6. **What is its weight?** (Influence on parent)
7. **Are there 5-15 related issues?** (Consolidation opportunity)

---

## For More Information

See the comprehensive documentation in:
- `HIERARCHICAL_ISSUES_SUMMARY.md` - Start here for overview
- `HIERARCHICAL_ISSUES_QUICKSTART.md` - Quick start guide
- Repository README.md - Integration and usage

---

**Remember**: The goal is not just organization—it's to create a legal argument structure where the strength of each claim can be quantified and gaps can be identified. Every issue should contribute to proving or disproving a legal argument.

**Priority Order**: Legal Argument → Feature → Paragraph (Component) → Task

**Formula**: 1 Feature = 3 Components = 9 Tasks (scale: 5-15 tasks depending on complexity)
