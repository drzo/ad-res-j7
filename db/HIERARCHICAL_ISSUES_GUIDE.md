# Hierarchical Issue Structure for Legal Arguments

## Overview

This system implements a hierarchical structure for organizing legal issues where:

1. **Legal Arguments** group related **Feature-level Issues**
2. **Feature Issues** contain **Paragraphs** ranked by influence
3. **Paragraphs** contain **Task Issues** ranked by influence
4. Each level uses **rank ordering** and **weights** to track influence strength

## Architecture

```
Legal Argument
  ├── Feature Issue #1 (proves/supports argument)
  │   ├── Paragraph 1 (Rank 1, Weight 100) - Highest influence
  │   │   ├── Task Issue #1 (Rank 1, Weight 100)
  │   │   ├── Task Issue #2 (Rank 2, Weight 90)
  │   │   └── Task Issue #3 (Rank 3, Weight 85)
  │   ├── Paragraph 2 (Rank 2, Weight 95)
  │   │   └── Task Issues...
  │   └── Paragraph 3 (Rank 3, Weight 85)
  │       └── Task Issues...
  └── Feature Issue #2 (proves/supports argument)
      └── Paragraphs...
          └── Task Issues...
```

## Database Schema

### Tables

1. **legal_arguments** - Legal strategies/arguments
2. **issues** - Both feature and task level issues
   - `issue_type`: 'feature' or 'task'
   - `parent_issue_id`: Links tasks to features
   - `rank_order`: Rank within parent (1 = highest)
   - `weight`: Influence weight (0-100)
3. **issue_paragraphs** - Paragraphs within features
   - `rank_order`: Paragraph rank by influence
   - `weight`: Impact on feature strength (0-100)
4. **issue_argument_links** - Links issues to arguments
5. **paragraph_issue_links** - Links tasks to paragraphs

## Setup

### 1. Run Migration

```bash
npm run db:hierarchy:setup
```

This creates all necessary tables, columns, and indexes.

### 2. Populate Demo Data

```bash
npm run db:hierarchy:populate
```

This creates a comprehensive example with:
- 2 legal arguments
- 3 feature issues
- 7 paragraphs
- 13 task issues

All with proper rank ordering and weights.

## Usage

### Using the HierarchicalIssueManager

```javascript
const HierarchicalIssueManager = require('./db/hierarchical-issue-manager');
const manager = new HierarchicalIssueManager();

// 1. Create a legal argument
const argument = await manager.createLegalArgument(
  'Revenue Stream Defense',
  'Prove legitimate investment structure',
  'defense',
  'Show R1M investment vs R1K admin fee'
);

// 2. Create a feature issue under the argument
const feature = await manager.createFeatureIssue(
  1001,  // issue number
  'Payment Structure Analysis',
  'Detailed analysis of payment flows',
  'critical',
  argument.id
);

// 3. Create paragraphs within the feature
const paragraph = await manager.createParagraph(
  feature.id,
  1,      // paragraph number
  'Investment Evidence',
  'RegimA Zone Ltd invested R1M...',
  1,      // rank order (1 = highest influence)
  100     // weight (0-100)
);

// 4. Create task issues under the paragraph
const task = await manager.createTaskIssue(
  2001,  // issue number
  'Document bank transfers',
  'Obtain R1M transfer records',
  feature.id,     // parent feature
  paragraph.id,   // parent paragraph
  1,              // rank within paragraph
  100,            // weight/influence on paragraph
  'critical'
);

// 5. Query the hierarchy
const hierarchy = await manager.getArgumentHierarchy(argument.id);
// Returns complete tree: argument → features → paragraphs → tasks

// 6. Calculate feature strength
const strength = await manager.calculateFeatureStrength(feature.id);
// Returns 0-100 based on paragraph and task weights
```

## Key Methods

### Legal Arguments
- `createLegalArgument(name, description, type, strategy)`
- `getLegalArgument(id)`
- `listLegalArguments(status)`

### Feature Issues
- `createFeatureIssue(number, title, description, priority, argumentId)`
- `getFeatureTaskIssues(featureId)` - Get all tasks under feature
- `getArgumentFeatures(argumentId)` - Get all features for argument

### Paragraphs
- `createParagraph(featureId, number, title, content, rank, weight)`
- `getFeatureParagraphs(featureId)` - Ordered by rank
- `getParagraphWithIssues(paragraphId)` - Get paragraph + tasks

### Task Issues
- `createTaskIssue(number, title, description, featureId, paragraphId, rank, weight, priority)`

### Hierarchical Queries
- `getArgumentHierarchy(argumentId)` - Complete tree structure
- `calculateFeatureStrength(featureId)` - Aggregate strength (0-100)
- `getTopParagraphs(featureId, limit)` - Highest weighted paragraphs
- `getTopParagraphIssues(paragraphId, limit)` - Highest weighted tasks

### Updates
- `updateIssueRank(issueId, newRank)`
- `updateIssueWeight(issueId, newWeight)`
- `updateParagraphRank(paragraphId, newRank, newWeight)`

## Ranking and Weighting System

### Rank Order
- **Lower numbers = Higher rank** (1 is the highest)
- Indicates **relative importance** within a group
- Used for **ordering** when displaying hierarchies

### Weights (0-100)
- **Higher numbers = Greater influence**
- Represents **degree of impact** on parent strength
- Used for **calculating aggregate strength**

### Feature Strength Calculation

The `calculateFeatureStrength()` method computes an aggregate score:

1. For each paragraph:
   - Get all linked task issues
   - Calculate average task weight
   - Multiply paragraph weight by average task weight
2. Sum all paragraph contributions
3. Normalize to 0-100 scale

Example:
```
Paragraph 1 (Weight 100): Tasks avg 95 → Contribution: 100 * 0.95 = 95
Paragraph 2 (Weight 90):  Tasks avg 85 → Contribution: 90 * 0.85 = 76.5
Total: 171.5, Normalized: ~90%
```

## Example: Case 2025-137857

The demo populates a real-world structure:

### Legal Argument: Revenue Stream Defense
**Strategy**: Prove RegimA Zone Ltd made legitimate R1M investment

#### Feature 1.1: Payment Structure Analysis
- **Paragraph 1** (Rank 1, Weight 100): R1M Investment Evidence
  - Task #2001 (Rank 1, Weight 100): Document bank transfer
  - Task #2002 (Rank 2, Weight 90): Allocation breakdown
  - Task #2003 (Rank 3, Weight 85): Expense cross-reference
- **Paragraph 2** (Rank 2, Weight 95): R1K Admin Fee Structure
  - Task #2004 (Rank 1, Weight 100): Admin fee invoices
  - Task #2005 (Rank 2, Weight 80): Industry comparison
- **Paragraph 3** (Rank 3, Weight 85): Tax Compliance
  - Task #2006 (Rank 1, Weight 90): Tax certificates
  - Task #2007 (Rank 2, Weight 75): SARS guidelines

#### Feature 1.2: Peter's Zero Investment
- **Paragraph 1** (Rank 1, Weight 100): No Capital Contribution
  - Task #2008 (Rank 1, Weight 100): Zero contribution proof
  - Task #2009 (Rank 2, Weight 95): Funding timeline
- **Paragraph 2** (Rank 2, Weight 98): Appropriation Acts
  - Task #2010 (Rank 1, Weight 100): Card cancellations
  - Task #2011 (Rank 2, Weight 95): Email hijacking
  - Task #2012 (Rank 3, Weight 90): Loss quantification

## Testing

Run the test suite:

```bash
npm run test:hierarchical-issues
```

Tests cover:
- ✅ Creating arguments, features, paragraphs, tasks
- ✅ Rank ordering and weighting
- ✅ Hierarchical relationships
- ✅ Querying complete hierarchies
- ✅ Strength calculations
- ✅ Top-N queries
- ✅ Updating ranks and weights

## CLI Commands

```bash
# Setup database
npm run db:hierarchy:setup

# View statistics
npm run db:hierarchy:stats

# Run quick demo
npm run db:hierarchy:demo

# Populate comprehensive example
npm run db:hierarchy:populate

# Run tests
npm run test:hierarchical-issues
```

## Benefits

1. **Structured Organization**: Clear hierarchy from strategy to tactics
2. **Influence Tracking**: Weights show what matters most
3. **Aggregate Calculations**: Compute overall argument strength
4. **Flexible Querying**: Get any level of the hierarchy
5. **Legal Reasoning**: Mirrors how legal arguments are actually structured
6. **Evidence Linkage**: Each task can link to evidence via hypergraph
7. **Priority Management**: Rank ordering guides work prioritization

## Integration with Existing Systems

This hierarchical structure integrates with:

- **Hypergraph**: Link tasks/features to evidence, documents, people
- **LEX Inference Engine**: Feed hierarchy into attention mechanisms
- **Case Manager**: Track issue status and completion
- **Burden of Proof Framework**: Map tasks to proof requirements

## Future Enhancements

Potential additions:
- Automatic rank recalculation when issues added/removed
- Visualization of hierarchy with strength heatmap
- Export to legal brief outline format
- Integration with evidence gap analysis
- AI-assisted strength estimation

## License

Part of the AD-RES-J7 legal case repository.
