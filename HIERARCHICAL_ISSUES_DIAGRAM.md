# Hierarchical Issue Structure - Visual Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     LEGAL ARGUMENT                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Argument Name: Revenue Stream Defense                     │ │
│  │  Type: defense                                             │ │
│  │  Strategy: Prove R1M investment vs R1K fee                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│              ┌───────────────┴───────────────┐                  │
│              ▼                               ▼                   │
│  ┌─────────────────────┐       ┌─────────────────────┐         │
│  │  FEATURE ISSUE #1   │       │  FEATURE ISSUE #2   │         │
│  │  Payment Structure  │       │  Peter's Zero Inv.  │         │
│  │  proves argument    │       │  proves argument    │         │
│  └─────────────────────┘       └─────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                │                              │
                │ contains                     │ contains
                ▼                              ▼
┌────────────────────────────┐   ┌────────────────────────────┐
│     PARAGRAPH 1            │   │     PARAGRAPH 1            │
│  Rank: 1  Weight: 100      │   │  Rank: 1  Weight: 100      │
│  "R1M Investment"          │   │  "No Capital Contribution" │
└────────────────────────────┘   └────────────────────────────┘
│                                │
│ groups                         │ groups
▼                                ▼
┌─────────────────────┐         ┌─────────────────────┐
│  TASK ISSUE #2001   │         │  TASK ISSUE #2008   │
│  Rank: 1  Weight:100│         │  Rank: 1  Weight:100│
│  Bank transfer docs │         │  Zero contrib proof │
└─────────────────────┘         └─────────────────────┘
▼                                ▼
┌─────────────────────┐         ┌─────────────────────┐
│  TASK ISSUE #2002   │         │  TASK ISSUE #2009   │
│  Rank: 2  Weight: 90│         │  Rank: 2  Weight: 95│
│  Allocation detail  │         │  Funding timeline   │
└─────────────────────┘         └─────────────────────┘
▼
┌─────────────────────┐
│  TASK ISSUE #2003   │
│  Rank: 3  Weight: 85│
│  Expense cross-ref  │
└─────────────────────┘
```

## Database Relationships

```
┌──────────────────────┐
│  legal_arguments     │
│  ─────────────────   │
│  id (PK)            │
│  argument_name      │──┐
│  description        │  │
│  argument_type      │  │
│  strategy           │  │
└──────────────────────┘  │
                          │
                          │ links via issue_argument_links
                          │
                          ▼
┌──────────────────────┐  ┌──────────────────────┐
│  issues              │  │ issue_argument_links │
│  ─────────────────   │  │ ──────────────────── │
│  id (PK)            │◄─┤  issue_id (FK)       │
│  issue_number       │  │  argument_id (FK)    │
│  title              │  │  link_type           │
│  issue_type ────────┼─►│  strength            │
│  parent_issue_id ───┼─┐└──────────────────────┘
│  rank_order         │ │
│  weight             │ │  parent_issue_id references
└──────────────────────┘ │  issues.id for task→feature
                         │
        ┌────────────────┘
        │
        ▼
┌──────────────────────┐
│  issues (child)      │
│  ─────────────────   │
│  id (PK)            │
│  issue_type='task'  │
│  parent_issue_id(FK)│──────┐
│  rank_order         │      │
│  weight             │      │
└──────────────────────┘      │
         ▲                    │
         │                    │
         │ linked via         │
         │ paragraph_         │
         │ issue_links        │
         │                    │
┌────────┴─────────────┐      │
│ paragraph_issue_links│      │
│ ──────────────────── │      │
│  paragraph_id (FK)   │      │
│  issue_id (FK) ──────┼──────┘
│  rank_order          │
│  weight              │
└──────────────────────┘
         ▲
         │
         │
┌────────┴─────────────┐
│  issue_paragraphs    │
│  ─────────────────   │
│  id (PK)            │
│  feature_issue_id(FK)│──┐
│  paragraph_number   │  │
│  title              │  │
│  content            │  │
│  rank_order         │  │
│  weight             │  │
└──────────────────────┘  │
                          │
        feature_issue_id references
        issues.id (where issue_type='feature')
```

## Ranking and Weighting Logic

```
┌─────────────────────────────────────────────────────┐
│  LEGAL ARGUMENT                                     │
│  Strategy: Prove/Disprove Legal Point               │
└─────────────────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   ┌─────────────┐         ┌─────────────┐
   │  Feature 1  │         │  Feature 2  │
   │  Link: 90%  │         │  Link: 85%  │
   └─────────────┘         └─────────────┘
          │
          ├─► Paragraph 1 (Rank 1, Weight 100) ◄── Highest influence
          │   └─► Task A (Rank 1, Weight 100)
          │   └─► Task B (Rank 2, Weight 90)
          │   └─► Task C (Rank 3, Weight 85)
          │
          ├─► Paragraph 2 (Rank 2, Weight 95)
          │   └─► Task D (Rank 1, Weight 100)
          │   └─► Task E (Rank 2, Weight 80)
          │
          └─► Paragraph 3 (Rank 3, Weight 85)
              └─► Task F (Rank 1, Weight 90)
              └─► Task G (Rank 2, Weight 75)

Feature Strength Calculation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Para 1: Weight 100 × Avg(100,90,85)/100 = 100 × 0.917 = 91.7
Para 2: Weight 95  × Avg(100,80)/100    = 95  × 0.90  = 85.5
Para 3: Weight 85  × Avg(90,75)/100     = 85  × 0.825 = 70.1

Total: 247.3
Normalized: 247.3 / 280 (max possible) × 100 = 88.3%
```

## Query Patterns

### 1. Get Complete Hierarchy
```javascript
getArgumentHierarchy(argumentId)
  └─► Returns:
      {
        argument: { id, name, strategy, ... },
        features: [
          {
            id, title, description,
            paragraphs: [
              {
                id, title, rank_order, weight,
                issues: [
                  { id, title, rank_order, weight, ... }
                ]
              }
            ]
          }
        ]
      }
```

### 2. Get Top Items
```javascript
getTopParagraphs(featureId, 5)
  └─► Returns paragraphs ordered by:
      1. weight DESC (highest weight first)
      2. rank_order ASC (lowest rank number first)

getTopParagraphIssues(paragraphId, 5)
  └─► Returns tasks ordered by:
      1. para_weight DESC
      2. para_rank ASC
```

### 3. Calculate Strength
```javascript
calculateFeatureStrength(featureId)
  └─► For each paragraph:
      1. Get all task issues
      2. Calculate avg task weight
      3. Multiply: para_weight × avg_task_weight
      Sum all contributions
      Normalize to 0-100 scale
```

## Workflow Example

```
┌─────────────────────────────────────────────┐
│  1. Legal Team Defines Argument             │
│     "Revenue Stream Defense"                │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  2. Create Feature Issues                   │
│     - Payment Structure (proves argument)   │
│     - Peter's Zero Investment (proves arg)  │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  3. Organize into Paragraphs                │
│     Rank by influence on feature:           │
│     - Para 1: R1M Investment (Rank 1, W:100)│
│     - Para 2: R1K Admin Fee (Rank 2, W:95)  │
│     - Para 3: Tax Compliance (Rank 3, W:85) │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  4. Create Task Issues                      │
│     Rank by influence on paragraph:         │
│     Para 1:                                 │
│       - Bank transfer (Rank 1, W:100)       │
│       - Allocation (Rank 2, W:90)           │
│       - Expenses (Rank 3, W:85)             │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  5. Calculate Feature Strength              │
│     Based on paragraph & task weights       │
│     Result: 88.3% (strong feature)          │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  6. Prioritize Work                         │
│     Focus on Rank 1 items first             │
│     (Highest influence on argument)         │
└─────────────────────────────────────────────┘
```

## Data Flow

```
User Input (Create Hierarchy)
       │
       ▼
┌──────────────────┐
│ Hierarchical     │
│ Issue Manager    │
└──────────────────┘
       │
       ├─► Insert into legal_arguments
       ├─► Insert into issues (type='feature')
       ├─► Insert into issue_argument_links
       ├─► Insert into issue_paragraphs
       ├─► Insert into issues (type='task')
       └─► Insert into paragraph_issue_links
       │
       ▼
┌──────────────────┐
│ Database         │
│ (Neon Postgres)  │
└──────────────────┘
       │
       ▼
Query Operations
       │
       ├─► getArgumentHierarchy()
       │   └─► JOIN across all tables
       │       Returns nested structure
       │
       ├─► calculateFeatureStrength()
       │   └─► Aggregate weights from
       │       paragraphs and tasks
       │
       └─► getTopParagraphs/Issues()
           └─► ORDER BY weight DESC,
               rank_order ASC
```

## Visual Legend

```
┌────────┐
│  Box   │  = Table or Entity
└────────┘

   │
   ▼        = One-to-Many Relationship

   ◄──►     = Foreign Key Reference

Rank: 1     = Rank Order (1 is highest priority)
Weight: 100 = Influence Weight (0-100 scale)
```

## Summary

This visual diagram shows:
1. ✅ 4-level hierarchy: Argument → Feature → Paragraph → Task
2. ✅ Database relationships with foreign keys
3. ✅ Ranking system (1 = highest)
4. ✅ Weighting system (0-100)
5. ✅ Strength calculation logic
6. ✅ Query patterns
7. ✅ Workflow from creation to prioritization
