# Issue Consolidation Guide

## Problem

The repository had **648 open issues** - far exceeding the target of **10-15 properly structured feature issues**. This explosion was caused by automated workflows (`todo-to-issues.yml` and `create-issues-from-repository-items.yml`) that created individual issues from every subsection in todo files, resulting in:

- Hundreds of small, fragmented issues
- Duplicate and overlapping tasks
- Loss of hierarchical structure
- Difficult to manage and prioritize
- Not aligned with legal framework (Legal Arguments → Features → Paragraphs → Tasks)

## Solution

### 1. Disabled Problematic Workflows

The following workflows have been disabled to prevent further issue creation:

- `.github/workflows/todo-to-issues.yml.disabled`
- `.github/workflows/create-issues-from-repository-items.yml.disabled`

These workflows will not run until re-enabled. To re-enable them (after fixing), rename them back to `.yml`.

### 2. Consolidation Script

Use the consolidation script to clean up auto-generated issues:

```bash
# Step 1: Generate a report of what will be consolidated
node scripts/consolidate-issues-to-hierarchy.js report

# Step 2: Preview what will be closed (dry run)
node scripts/consolidate-issues-to-hierarchy.js dry-run

# Step 3: Actually close the issues (requires confirmation)
echo "I confirm closing auto-generated issues" > CONFIRM_CLOSE_ISSUES.txt
node scripts/consolidate-issues-to-hierarchy.js execute
```

### 3. Proper Hierarchical Structure

Issues should follow this structure (see `HIERARCHICAL_ISSUES_SUMMARY.md`):

```
Legal Argument
├── Feature Issue #1001 (Proves/Disproves)
│   ├── Paragraph 1 (Rank 1, Weight 100) - Most influential
│   │   ├── Task #2001 (Rank 1, Weight 100)
│   │   ├── Task #2002 (Rank 2, Weight 90)
│   │   └── Task #2003 (Rank 3, Weight 85)
│   ├── Paragraph 2 (Rank 2, Weight 95)
│   │   ├── Task #2004 (Rank 1, Weight 100)
│   │   ├── Task #2005 (Rank 2, Weight 80)
│   │   └── Task #2006 (Rank 3, Weight 75)
│   └── Paragraph 3 (Rank 3, Weight 85)
│       ├── Task #2007 (Rank 1, Weight 90)
│       ├── Task #2008 (Rank 2, Weight 75)
│       └── Task #2009 (Rank 3, Weight 70)
```

**Rule of thumb**: 1 Feature = 3 Paragraphs = 9 Tasks (range: 5-15 tasks depending on complexity)

## What Gets Closed

The consolidation script identifies and closes issues that are:

1. **Auto-generated** - Created by workflows from todo files
2. **Fragmented** - Very short titles (< 30 chars) or descriptive phrases
3. **Duplicates** - Multiple issues for the same work
4. **Non-hierarchical** - Not following the proper structure

### Identification Criteria

Issues are marked for closure if they have:

- Labels: `todo`, `enhancement` (from auto-generation)
- Body contains: "Generated automatically from todo files" or "Created from repository item"
- Body contains: "Source File:" (from todo parser)
- Title contains: "Priority 1", "Priority 2", "PARA_", etc.
- Very short titles (likely fragments)

### What Gets Kept

Issues are preserved if they:

- Have hierarchical labels: `feature`, `legal-argument`, `hierarchical`, `paragraph`, `task`
- Use proper title format: `[FEATURE]`, `[PARA]`, `[TASK]`
- Are manually created important issues
- Part of the proper hierarchical structure

## Expected Results

After consolidation:

- **Before**: 648 fragmented issues
- **After**: 10-15 feature issues (each with 3 paragraphs and ~9 tasks)
- **Reduction**: ~630+ issues closed
- **Structure**: Proper hierarchical organization

## Database vs GitHub Issues

The hierarchical structure is managed in the database (`db/hierarchical-issue-manager.js`):

- Database tracks the logical hierarchy
- GitHub issues are created from the database structure
- Use `npm run db:hierarchy:populate` to populate the database
- Use `scripts/create-github-issues.js` to create GitHub issues from database

## Preventing Future Duplication

1. **Do not re-enable** `todo-to-issues.yml` without fixing it first
2. **Use hierarchical structure** - Always create issues within the proper framework
3. **Review before creating** - Check if a feature issue already exists
4. **Follow the 3x3=9 rule** - 3 paragraphs per feature, 3 tasks per paragraph
5. **Use proper labels** - `feature`, `paragraph`, `task`, `hierarchical`

## Creating New Issues

### For Features

```bash
# Use the hierarchical issue manager
node db/hierarchical-issue-manager.js create-feature \
  --number 1005 \
  --title "Feature Title" \
  --description "What this proves/disproves" \
  --argument-id 1
```

### For Tasks

```bash
# Use the hierarchical issue manager
node db/hierarchical-issue-manager.js create-task \
  --number 2020 \
  --title "Task Title" \
  --feature-id 3 \
  --paragraph-id 5 \
  --rank 1 \
  --weight 100
```

## Monitoring

Check the status anytime:

```bash
# View hierarchy statistics
npm run db:hierarchy:stats

# List feature issues
gh issue list --label feature

# List all hierarchical issues
gh issue list --label hierarchical
```

## Troubleshooting

### "Still too many issues after consolidation"

Some manually created issues may need review. Run:

```bash
node scripts/consolidate-issues-to-hierarchy.js report
```

Review the `issues_to_keep` section and manually consolidate if needed.

### "Accidentally closed an important issue"

Reopen it:

```bash
gh issue reopen <issue-number>
```

Then add the `hierarchical` label to prevent future closure:

```bash
gh issue edit <issue-number> --add-label hierarchical
```

### "Need to modify the consolidation criteria"

Edit `scripts/consolidate-issues-to-hierarchy.js` and adjust the `identifyAutoGeneratedIssues()` method.

## References

- `HIERARCHICAL_ISSUES_SUMMARY.md` - Complete framework overview
- `HIERARCHICAL_ISSUES_QUICKSTART.md` - Quick start guide
- `db/HIERARCHICAL_ISSUES_GUIDE.md` - Database API guide
- `.github/copilot-instructions.md` - Copilot instructions for maintaining structure

---

**Last Updated**: 2025-10-27

**Status**: Workflows disabled, consolidation script ready for use
