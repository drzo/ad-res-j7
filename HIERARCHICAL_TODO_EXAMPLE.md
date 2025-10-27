# Hierarchical TODO Preprocessing - Quick Example

## 📝 Write a TODO File

Create `todo/example.md`:

```markdown
# Payment Structure Defense

## Revenue Stream Analysis

This feature proves the legitimate investment structure.

### Investment Evidence

Primary evidence of the R1M investment from RegimA Zone Ltd.

- Document R1M bank transfer from RegimA Zone Ltd
- Gather investment allocation breakdown
- Compile financial statements showing investment

### Admin Fee Structure

Evidence of the minimal 0.1% admin fee structure.

- Document R1K admin fee invoices
- Obtain industry standard comparisons for admin fees
- Compile transfer pricing documentation
```

## 🔄 Run the Preprocessing Pipeline

### Step 1: Parse Hierarchically

```bash
node scripts/parse-todo-hierarchically.js todo structured-todo.json
```

**Output**:
```
🧠 Hierarchical TODO Parser

Applying 4-level hierarchy: Legal Argument → Feature → Paragraph → Task

📂 Scanning todo for TODO files...
Found 1 todo files

📄 Processing: todo/example.md
  ✅ Parsed successfully

📊 Hierarchical Structure Summary:

  Legal Arguments: 1
  Feature Issues:  1
  Paragraphs:      2
  Task Issues:     6

📈 Statistics:

  Avg Paragraphs per Feature: 2.00
  Avg Tasks per Paragraph:    3.00
  Avg Tasks per Feature:      6.00

✅ Structured output written to structured-todo.json
```

### Step 2: Generate Issues

```bash
node scripts/generate-hierarchical-issues.js structured-todo.json todo-issues.json
```

**Output**:
```
🏗️  Hierarchical Issue Generator

🔄 Generating hierarchical issues from structured TODO data...

Processing:
  - 1 legal arguments
  - 1 features
  - 2 paragraphs
  - 6 tasks

✅ Generated 6 issues

📊 Issue Generation Summary:

  Total Issues: 6

  Priority Distribution:
    Critical: 0
    High:     6
    Medium:   0
    Low:      0

  Hierarchical Coverage:
    Legal Arguments: 1
    Features:        1
    Paragraphs:      2

✅ Generated output written to todo-issues.json
```

## 📊 Inspect the Structured Output

### View Metadata

```bash
jq '.metadata' structured-todo.json
```

```json
{
  "generated_at": "2024-10-27T22:00:00.000Z",
  "parser_version": "1.0.0",
  "schema_version": "1.0",
  "total_arguments": 1,
  "total_features": 1,
  "total_paragraphs": 2,
  "total_tasks": 6
}
```

### View Hierarchy

```bash
jq '.hierarchy.legal_arguments' structured-todo.json
```

```json
[
  {
    "id": "arg_1",
    "name": "Payment Structure Defense",
    "description": "Legal argument extracted from todo/example.md",
    "type": "defense",
    "strategy": "Prove legitimate business structure",
    "source": "todo/example.md"
  }
]
```

### View a Sample Issue

```bash
jq '.issues[0]' todo-issues.json
```

```json
{
  "title": "Document R1M bank transfer from RegimA Zone Ltd",
  "body": "## 📋 Task Description\n\nDocument R1M bank transfer from RegimA Zone Ltd\n\n## 🏗️ Hierarchical Context\n\n**Legal Argument:** Payment Structure Defense\n- Type: defense\n- Strategy: Prove legitimate business structure\n\n**Feature Issue:** Revenue Stream Analysis\n- Priority: high\n- Feature ID: `feature_1`\n\n**Paragraph:** Investment Evidence\n- Paragraph Number: 1\n- Rank Order: 1 (1 = highest influence)\n- Weight: 100/100\n- Paragraph ID: `para_1`\n\n## 📊 Task Metadata\n\n- **Task Rank:** 1 (1 = highest priority within paragraph)\n- **Task Weight:** 100/100 (influence on paragraph)\n- **Priority:** high\n- **Task ID:** `task_1`",
  "labels": [
    "todo",
    "task",
    "hierarchical-task",
    "priority: high",
    "rank-1",
    "weight-high",
    "legal-defense"
  ],
  "metadata": {
    "task_id": "task_1",
    "paragraph_id": "para_1",
    "paragraph_rank": 1,
    "paragraph_weight": 100,
    "feature_id": "feature_1",
    "feature_title": "Revenue Stream Analysis",
    "argument_id": "arg_1",
    "argument_name": "Payment Structure Defense",
    "task_rank": 1,
    "task_weight": 100,
    "priority": "high"
  }
}
```

## 🔥 What You Get

### Before (Flat Structure)
```
❌ "Document bank transfer" - no context
❌ "Gather documentation" - no priority
❌ "Compile statements" - no relationships
```

### After (Hierarchical Structure)
```
✅ Task: "Document R1M bank transfer"
   ↳ Paragraph: "Investment Evidence" (Rank 1, Weight 100)
   ↳ Feature: "Revenue Stream Analysis" (Priority: high)
   ↳ Legal Argument: "Payment Structure Defense" (Type: defense)
   
✅ Labels: hierarchical-task, priority: high, rank-1, weight-high, legal-defense
✅ Full traceability to source file and line number
✅ Quantified influence on parent levels
```

## 🎯 Key Benefits

1. **Maximal Coherence**: Every task traces to a legal argument
2. **Automated Consolidation**: Related tasks grouped under features
3. **Quantified Strength**: Weights enable calculating argument strength
4. **Meta-Data Rich**: Rank, weight, priority, full hierarchy

## 🚀 GitHub Actions Integration

When you push TODO changes to `main`, the workflow automatically:

1. **Parses** TODOs into hierarchical structure
2. **Generates** issues with full metadata
3. **Creates** GitHub issues with labels
4. **Tracks** relationship to legal arguments

No manual work needed! Just write hierarchical TODOs and push.

## 📚 Learn More

- **Full Documentation**: `HIERARCHICAL_TODO_PREPROCESSING.md`
- **Parser Implementation**: `scripts/parse-todo-hierarchically.js`
- **Generator Implementation**: `scripts/generate-hierarchical-issues.js`
- **Test Suite**: `tests/hierarchical-todo-workflow.test.js`

## 🧪 Run Tests

```bash
npm run test:hierarchical-workflow
```

All 7 tests should pass with 100% success rate!
