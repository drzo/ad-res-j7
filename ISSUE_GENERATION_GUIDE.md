# GitHub Issue Generation from structured-todo.md

This guide explains how to generate GitHub issues from the structured-todo.md file.

## Overview

The structured-todo.md file contains a hierarchical structure of:
- **12 Legal Arguments** (Level 1: Strategic legal claims)
- **88 Features** (Level 2: Evidence-based proofs)
- **182 Paragraphs** (Level 3: Fact groupings)
- **146 Tasks** (Level 4: Actionable items)

## Process

### Step 1: Parse structured-todo.md to JSON

The first step converts the markdown file to JSON format:

```bash
node scripts/parse-structured-todo-md.js /tmp/structured-todo.md structured-todo.json
```

This creates `structured-todo.json` with the hierarchical data structure.

### Step 2: Generate GitHub Issues

The second step generates issue definitions from the JSON:

```bash
node scripts/generate-hierarchical-issues.js structured-todo.json todo-issues.json
```

This creates `todo-issues.json` containing 146 issue definitions with:
- Titles
- Bodies with hierarchical context
- Labels (priority, rank, weight, legal argument type)
- Metadata for tracking

### Step 3: Create GitHub Issues

The GitHub Actions workflow (`.github/workflows/todo-to-issues.yml`) will:
1. Parse the structured TODO data
2. Generate issue definitions
3. Create actual GitHub issues using the `gh` CLI

You can trigger this manually with:

```bash
gh workflow run todo-to-issues.yml --ref main
```

Or it runs automatically when TODO files are modified.

## File Structure

```
structured-todo.md              # Input: Pre-generated hierarchical TODO
    ↓ (parse-structured-todo-md.js)
structured-todo.json            # Intermediate: JSON format
    ↓ (generate-hierarchical-issues.js)
todo-issues.json                # Output: GitHub issue definitions
    ↓ (GitHub Actions workflow)
GitHub Issues                   # Final: Created in repository
```

## Issue Format

Each generated issue includes:

### Title
```
Create unit tests for markdown parsing logic
```

### Body
- **Task Description**: What needs to be done
- **Hierarchical Context**: 
  - Legal Argument (e.g., "Workflow Validation Tests")
  - Feature Issue (e.g., "Edge Case Testing")
  - Paragraph (e.g., "Tasks with Various Formats")
- **Task Metadata**:
  - Rank Order (1 = highest priority)
  - Weight (influence score 0-100)
  - Priority (critical/high/medium/low)
- **Source Information**: File and line number
- **Acceptance Criteria**: Checklist for completion

### Labels
- `todo` - Identifies as a TODO-generated task
- `task` - Indicates this is a task-level issue
- `hierarchical-task` - Part of hierarchical structure
- `priority: medium` - Priority level
- `rank-1` - Rank within paragraph
- `weight-high` - Influence category (high/medium/low)
- `legal-defense` - Legal argument type

## Statistics

Current structured-todo.md contains:

| Metric | Count |
|--------|-------|
| Total Tasks | 146 |
| Critical Priority | 2 |
| High Priority | 4 |
| Medium Priority | 123 |
| Low Priority | 17 |

### Hierarchical Coverage

- **Legal Arguments**: 12 unique legal arguments
- **Features**: 88 feature issues proving/disproving arguments
- **Paragraphs**: 182 fact groupings (avg 2.07 per feature)
- **Tasks**: 146 actionable items (avg 0.80 per paragraph)

## Manual Testing

To test the issue generation locally without creating issues:

```bash
# Step 1: Parse the markdown
node scripts/parse-structured-todo-md.js /tmp/structured-todo.md structured-todo.json

# Step 2: Generate issue definitions
node scripts/generate-hierarchical-issues.js structured-todo.json todo-issues.json

# Step 3: Review the generated issues
cat todo-issues.json | jq '.summary'
cat todo-issues.json | jq '.issues[0]' # View first issue
```

## Integration with Hierarchical System

The generated issues integrate with:

1. **Hierarchical Issue Manager** (`db/hierarchical-issue-manager.js`)
   - Links tasks to paragraphs, features, and legal arguments
   - Tracks rank ordering and weights
   - Calculates feature strength based on task completion

2. **Hypergraph** (`db/hypergraph-manager.js`)
   - Links tasks to evidence nodes
   - Maps relationships between issues

3. **LEX Inference Engine** (`db/lex-inference-engine.js`)
   - Uses hierarchy for legal attention mechanism
   - Prioritizes based on rank and weight

4. **Burden of Proof Framework** (`burden-of-proof-framework.js`)
   - Maps tasks to proof requirements
   - Tracks evidence collection progress

## Troubleshooting

### Issue: No tasks found
**Solution**: Verify structured-todo.md is in /tmp/ and properly formatted

### Issue: JSON parsing errors
**Solution**: Check that structured-todo.md uses correct markdown syntax

### Issue: Duplicate issues created
**Solution**: Use `force_regenerate=true` in workflow to close and recreate

### Issue: Invalid labels
**Solution**: Labels are validated against GitHub requirements (max 50 chars, alphanumeric)

## References

- [Hierarchical Issues Summary](HIERARCHICAL_ISSUES_SUMMARY.md)
- [Hierarchical Issues Quickstart](HIERARCHICAL_ISSUES_QUICKSTART.md)
- [Issue Consolidation Guide](ISSUE_CONSOLIDATION_GUIDE.md)
- [Copilot Instructions](.github/copilot-instructions.md)
