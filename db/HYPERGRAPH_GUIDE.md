# Hypergraph Database Guide
## Case 2025-137857 - Knowledge Graph System

---

## Overview

The hypergraph database enables modeling complex multi-way relationships between entities in your legal case. Unlike traditional graphs where edges connect only two nodes, hyperedges can connect any number of nodes, allowing you to represent sophisticated legal relationships.

---

## What's Been Set Up

### ✅ Database Schema Created

**4 Hypergraph Tables:**
- `hypergraph_nodes` - Entities (people, documents, evidence, issues, events, claims)
- `hypergraph_edges` - Relationships connecting multiple nodes
- `hypergraph_relations` - Junction table linking nodes to edges
- `hypergraph_patterns` - Saved query patterns for reuse

### ✅ Case Data Populated

**26 Nodes Created:**
- **4 People:** Peter Faucitt, Jacqueline Faucitt, Daniel Faucitt, Daniel Bantjies
- **7 Issues:** All 6 critical priority issues (#841, #840, #836, #835, #825, #805) + 1 claim
- **6 Evidence:** Bank records, Shopify reports, email logs, IT expenses, interdict
- **4 Documents:** Affidavit, Section 13B, Timeline analysis, JF8A doc
- **4 Events:** Card cancellation, email hijack, interdict filing, business disruption
- **1 Claim:** Peter's urgency claim

**15 Edges Created:**
- Evidence supports issues (5 relationships)
- Documents contain/cite evidence (3 relationships)
- Causation chains (2 relationships)
- Timeline sequences (1 relationship)
- Contradictions (1 relationship)
- People relationships (3 relationships)

---

## Available Commands

### Setup Commands
```bash
npm run db:hypergraph:setup      # Create hypergraph schema
npm run db:hypergraph:populate   # Populate with case data
npm run db:hypergraph:stats      # View graph statistics
npm run db:hypergraph:demo       # Run demo with sample data
```

### Example Queries
```javascript
const HypergraphManager = require('./db/hypergraph-manager');
const hg = new HypergraphManager();

// Get evidence supporting Issue #840
const evidence = await hg.getIssueEvidence(issueNodeId);

// Find path between two entities
const path = await hg.findPath(startNodeId, endNodeId);

// Get all nodes connected to a node
const connected = await hg.getConnectedNodes(nodeId, 'supports');

// Get contradictory evidence
const contradictions = await hg.getContradictoryEvidence(issueNodeId);
```

---

## Use Cases for Your Case

### 1. Evidence Chain Analysis
**Query:** What evidence supports Issue #840 (Section 13B)?
```javascript
const evidence = await hg.getIssueEvidence(issue840NodeId);
// Returns: Bank Records, Shopify Reports, IT Expenses
```

### 2. Causation Tracing
**Query:** What events did Peter's actions cause?
```javascript
const effects = await hg.getConnectedNodes(peterNodeId, 'caused_by');
// Returns: Documentation gaps, business disruption
```

### 3. Timeline Reconstruction
**Query:** What's the chronological sequence of events?
```javascript
const timeline = await hg.findEdgesByType('timeline');
// Returns ordered events: Card cancellation → Email hijack → Interdict → Disruption
```

### 4. Contradiction Detection
**Query:** What evidence contradicts Peter's claims?
```javascript
const contradictions = await hg.getConnectedNodes(peterClaimId, 'contradicts');
// Returns: Timeline analysis document
```

### 5. Document Reference Mapping
**Query:** What evidence does the affidavit cite?
```javascript
const references = await hg.getConnectedNodes(affidavitId, 'cites_evidence');
// Returns all referenced evidence
```

---

## Node Types

### Person Nodes
- **Peter Andrew Faucitt** - Applicant
- **Jacqueline Faucitt** - First Respondent
- **Daniel James Faucitt** - Second Respondent
- **Daniel Bantjies** - Accountant/Trustee

### Issue Nodes (from your 12 critical priorities)
- **#841** - Seventh material non-disclosure
- **#840** - Section 13B quantification
- **#836** - Peter's Causation section
- **#835** - JF8A Documentation Log
- **#825** - Timeline analysis
- **#805** - Daniel's witness statement

### Evidence Nodes
- **Bank Records** - 5 months FNB/ABSA statements
- **Shopify Reports** - Revenue data for 3 stores
- **Email Log** - All emails to Peter (JF8A)
- **IT Expenses** - Detailed infrastructure costs
- **Interdict Order** - Court order document

### Document Nodes
- **Answering Affidavit** - Jacqueline's main affidavit
- **Section 13B** - Harm quantification section
- **Timeline Analysis** - Peter's strategic delay analysis

### Event Nodes (Timeline)
- **Card Cancellations** - Peter cancelled business cards (May 2025)
- **Email Hijacking** - Peter seized email control (May 2025)
- **Interdict Filing** - Peter filed interdict (Sept 2025)
- **Business Disruption** - R18M+ in losses (June 2025)

---

## Edge Types (Relationships)

### Support/Opposition
- `supports` - Evidence supports an issue/claim (strength: 0-100)
- `contradicts` - Evidence contradicts a claim
- `opposes` - Legal opposition between parties

### Document References
- `contains` - Document contains other documents
- `cites_evidence` - Document references evidence
- `references` - General reference relationship

### Causation
- `caused_by` - Effect was caused by actions
- `caused` - Action caused an effect

### Timeline
- `timeline` - Chronological sequence of events

### Collaboration
- `collaborates_with` - Working relationship (e.g., Peter & Bantjies)

---

## Advanced Usage

### 1. Create Custom Nodes
```javascript
const newEvidence = await hg.createNode(
  'evidence',                    // node type
  'SARS Tax Certificate',        // label
  'sars_tax_2025',              // entity ID
  'Tax compliance certificate',  // description
  { year: 2025, entity: 'RWD' } // metadata
);
```

### 2. Create Multi-Way Relationships
```javascript
// Link multiple pieces of evidence to support an issue
await hg.createEdge(
  'supports',                    // edge type
  'Financial evidence for harm', // label
  [
    { nodeId: bankRecordId, role: 'evidence', weight: 95 },
    { nodeId: shopifyId, role: 'evidence', weight: 90 },
    { nodeId: itExpensesId, role: 'evidence', weight: 85 },
    { nodeId: issue840Id, role: 'issue', weight: 100 }
  ],
  95,                           // overall strength
  'directed',                   // direction
  { case: '2025-137857' }      // metadata
);
```

### 3. Find Shortest Path
```javascript
// Find how evidence connects to an issue
const path = await hg.findPath(
  bankRecordNodeId,
  issue840NodeId,
  5  // max depth
);
// Returns: { node_id: 9, path: [14, 9], depth: 1 }
```

### 4. Save Query Patterns
```javascript
// Save a reusable query pattern
await hg.savePattern(
  'evidence_chain',              // pattern name
  'query',                       // pattern type
  'Find all evidence supporting issues',
  { type: 'supports', target: 'issue' },
  ['evidence', 'issue'],         // node types involved
  ['supports']                   // edge types involved
);
```

### 5. Get Graph Analytics
```javascript
const stats = await hg.getStatistics();
// Returns:
// {
//   total_nodes: 26,
//   total_edges: 15,
//   total_relations: 37,
//   node_types: [...],
//   edge_types: [...]
// }
```

---

## Integration with Case Management

### Link to Existing Issues
```javascript
// When creating evidence, link it to tracked issues
const evidenceNode = await hg.createNode('evidence', 'New Evidence', 'ev_001');
await hg.linkEvidenceToIssue(evidenceNode.id, issue835NodeId, 'supports', 90);
```

### Track Document Relationships
```javascript
// Link affidavit amendments to source documents
await hg.linkDocumentReferences(
  amendmentDocId,
  [originalDocId, evidenceId],
  'amends'
);
```

### Build Timeline
```javascript
// Create chronological sequence
await hg.createTimelineRelation(
  [event1Id, event2Id, event3Id, event4Id],
  'chronological'
);
```

---

## Visualization Potential

The hypergraph can be exported for visualization in tools like:
- **Cytoscape.js** - Interactive graph visualization
- **D3.js** - Custom force-directed graphs
- **GraphViz** - Hierarchical layouts
- **Neo4j Bloom** - Native graph visualization

### Export for Visualization
```javascript
// Get all nodes and edges
const nodes = await hg.findNodesByType(null); // all types
const edges = await hg.findEdgesByType(null); // all types

// Format for visualization library
const graphData = {
  nodes: nodes.map(n => ({
    id: n.id,
    label: n.label,
    type: n.node_type,
    ...n.metadata
  })),
  edges: edges.map(async (e) => {
    const edgeWithNodes = await hg.getEdgeWithNodes(e.id);
    return {
      id: e.id,
      type: e.edge_type,
      nodes: edgeWithNodes.nodes
    };
  })
};
```

---

## Query Examples for Your Case

### 1. Find All Evidence for Section 13B
```sql
SELECT DISTINCT n.*
FROM hypergraph_nodes n
JOIN hypergraph_relations r ON n.id = r.node_id
JOIN hypergraph_edges e ON r.edge_id = e.id
WHERE e.id IN (
  SELECT edge_id 
  FROM hypergraph_relations 
  WHERE node_id = (
    SELECT id FROM hypergraph_nodes 
    WHERE entity_id = '840'
  )
)
AND n.node_type = 'evidence'
AND e.edge_type = 'supports';
```

### 2. Get Timeline of Events
```sql
SELECT n.*, r.position
FROM hypergraph_nodes n
JOIN hypergraph_relations r ON n.id = r.node_id
JOIN hypergraph_edges e ON r.edge_id = e.id
WHERE e.edge_type = 'timeline'
AND n.node_type = 'event'
ORDER BY r.position;
```

### 3. Find Contradictory Evidence
```sql
SELECT n.*
FROM hypergraph_nodes n
JOIN hypergraph_relations r ON n.id = r.node_id
JOIN hypergraph_edges e ON r.edge_id = e.id
WHERE e.edge_type = 'contradicts'
AND r.role = 'evidence';
```

---

## Next Steps

### Expand the Graph
1. **Add more evidence nodes** as you collect documentation
2. **Create amendment nodes** linking to affidavit sections
3. **Add legal argument nodes** with supporting evidence
4. **Create precedent nodes** referencing case law

### Build Query Patterns
1. Save common queries as patterns
2. Create inference rules (e.g., if A supports B and B supports C, then A indirectly supports C)
3. Build validation queries to check evidence completeness

### Export and Visualize
1. Export graph data for visualization
2. Create interactive case map
3. Generate evidence flow diagrams

---

## Benefits for Your Case

### 1. Evidence Completeness
- Quickly identify which issues have supporting evidence
- Find gaps where more evidence is needed
- Track evidence strength across the case

### 2. Causation Analysis
- Trace how Peter's actions caused harm
- Build clear causation chains for court
- Demonstrate timeline of events

### 3. Contradiction Detection
- Find conflicts between claims and evidence
- Identify inconsistencies in Peter's arguments
- Build counter-arguments

### 4. Strategic Planning
- Visualize case structure
- Prioritize evidence collection
- Plan argument strategy

### 5. Collaboration
- Share graph structure with legal team
- Track who is responsible for what
- Coordinate evidence gathering

---

## Technical Details

### Database Schema
- **Nodes:** Flexible JSONB metadata for custom attributes
- **Edges:** Strength ratings (0-100) and directional indicators
- **Relations:** Weighted connections with roles and positions
- **Patterns:** Reusable query templates

### Performance
- Indexed on node_type, entity_id, edge_type
- GIN indexes on JSONB metadata for fast queries
- Optimized for graph traversal operations

### Scalability
- Can handle thousands of nodes and edges
- Efficient pathfinding with recursive CTEs
- Pattern-based queries for complex relationships

---

Last Updated: 2025-10-15