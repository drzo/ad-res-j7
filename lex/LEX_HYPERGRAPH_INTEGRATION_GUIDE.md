# Lex Framework - Hypergraph Resolver Integration Guide

**Date:** October 26, 2025  
**Purpose:** Guide for integrating lex framework with hypergraph resolver for automated legal reasoning  
**Version:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Lex Framework Structure](#lex-framework-structure)
4. [Hypergraph Resolver Integration](#hypergraph-resolver-integration)
5. [Query Patterns](#query-patterns)
6. [Example Queries](#example-queries)
7. [Implementation Roadmap](#implementation-roadmap)

---

## Overview

The **lex framework** provides formal legal principles in Scheme, while the **hypergraph resolver** enables graph-based legal reasoning and pattern matching. Integration creates a powerful system for:

- **Automated legal analysis** - Apply legal principles to case facts
- **Pattern matching** - Identify legal issues from entity/relation/event graphs
- **Rule-based inference** - Derive legal conclusions from principles
- **Conflict detection** - Identify contradictions and conflicts of interest
- **Claim generation** - Automatically generate legal claims from facts

### Key Components

1. **Lex Framework** (`lex/*/za/*.scm`)
   - Formal legal principles
   - Test functions
   - Inference rules

2. **Hypergraph Resolver** (`hypergraph_resolver.py`)
   - Graph traversal
   - Pattern matching
   - Query engine

3. **Case Knowledge Graph** (Entity/Relation/Event data)
   - Entities (persons, companies, trusts)
   - Relations (ownership, employment, transactions)
   - Events (actions, decisions, communications)

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Lex Framework Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Company Law │  │  Trust Law   │  │  Civil Law   │      │
│  │    (.scm)    │  │    (.scm)    │  │    (.scm)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 Hypergraph Resolver Layer                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Graph Traversal │ Pattern Matching │ Query Engine  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Case Knowledge Graph                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Entities   │  │  Relations   │  │    Events    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Case Facts → Knowledge Graph → Hypergraph Resolver → Lex Framework → Legal Conclusions
```

### Integration Points

1. **Principle Loading**
   - Load lex principles into hypergraph
   - Create principle nodes with attributes

2. **Pattern Matching**
   - Match case facts to legal patterns
   - Identify applicable principles

3. **Inference Engine**
   - Apply test functions to case facts
   - Generate legal conclusions

4. **Conflict Detection**
   - Identify conflicting principles
   - Resolve conflicts by precedence

---

## Lex Framework Structure

### Principle Definition

**Scheme Structure:**

```scheme
(define principle-name
  (make-principle
   'name 'principle-identifier
   'description "Human-readable description"
   'domain '(domain-tags)
   'confidence 0.0-1.0
   'provenance "Legal source"
   'related-principles '(related-principle-ids)
   'inference-type 'deductive|'abductive|'inductive
   'application-context "Context description"))
```

### Test Function Definition

**Scheme Structure:**

```scheme
(define test-function-name
  (lambda (arg1 arg2 ...)
    (and|or (condition1? arg1)
            (condition2? arg2)
            ...)))
```

### Principle Categories

| Category | File | Principles Count |
|----------|------|------------------|
| **Company Law** | `lex/cmp/za/south_african_company_law.scm` | 29 principles, 10 tests |
| **Trust Law** | `lex/trs/za/south_african_trust_law.scm` | 28 principles, 8 tests |
| **Civil Law** | `lex/civ/za/south_african_civil_law.scm` | 50+ principles (including unjust enrichment) |

---

## Hypergraph Resolver Integration

### Step 1: Load Lex Principles

**Python Implementation:**

```python
import json
from hypergraph_resolver import HypergraphResolver

def load_lex_principles(lex_file_path):
    """Load lex principles from Scheme file into hypergraph."""
    
    # Parse Scheme file (requires Scheme parser or manual conversion)
    principles = parse_scheme_file(lex_file_path)
    
    # Create hypergraph nodes for each principle
    resolver = HypergraphResolver()
    
    for principle in principles:
        resolver.add_node(
            node_id=principle['name'],
            node_type='legal_principle',
            attributes={
                'description': principle['description'],
                'domain': principle['domain'],
                'confidence': principle['confidence'],
                'provenance': principle['provenance'],
                'inference_type': principle['inference_type'],
                'application_context': principle['application_context']
            }
        )
        
        # Create edges to related principles
        for related in principle['related_principles']:
            resolver.add_edge(
                source=principle['name'],
                target=related,
                edge_type='related_to'
            )
    
    return resolver
```

### Step 2: Create Case Knowledge Graph

**Python Implementation:**

```python
def create_case_knowledge_graph(case_data):
    """Create knowledge graph from case entities, relations, events."""
    
    resolver = HypergraphResolver()
    
    # Add entities
    for entity in case_data['entities']:
        resolver.add_node(
            node_id=entity['id'],
            node_type=entity['type'],  # 'person', 'company', 'trust'
            attributes=entity['attributes']
        )
    
    # Add relations
    for relation in case_data['relations']:
        resolver.add_edge(
            source=relation['source'],
            target=relation['target'],
            edge_type=relation['type'],  # 'owns', 'employs', 'transacts_with'
            attributes=relation['attributes']
        )
    
    # Add events
    for event in case_data['events']:
        resolver.add_node(
            node_id=event['id'],
            node_type='event',
            attributes=event['attributes']
        )
        
        # Link event to entities
        for participant in event['participants']:
            resolver.add_edge(
                source=event['id'],
                target=participant,
                edge_type='involves'
            )
    
    return resolver
```

### Step 3: Pattern Matching

**Python Implementation:**

```python
def match_legal_patterns(case_graph, lex_graph):
    """Match case facts to legal patterns."""
    
    matches = []
    
    # Example: Detect self-dealing transactions
    self_dealing_pattern = {
        'nodes': [
            {'type': 'person', 'role': 'director'},
            {'type': 'company', 'role': 'company1'},
            {'type': 'company', 'role': 'company2'},
            {'type': 'event', 'role': 'transaction'}
        ],
        'edges': [
            {'source': 'director', 'target': 'company1', 'type': 'director_of'},
            {'source': 'director', 'target': 'company2', 'type': 'owns'},
            {'source': 'transaction', 'target': 'company1', 'type': 'involves'},
            {'source': 'transaction', 'target': 'company2', 'type': 'involves'}
        ]
    }
    
    # Find matches in case graph
    pattern_matches = case_graph.find_pattern(self_dealing_pattern)
    
    for match in pattern_matches:
        # Link to applicable lex principle
        applicable_principle = lex_graph.get_node('director-self-dealing-prohibition')
        
        matches.append({
            'pattern': 'self_dealing',
            'match': match,
            'principle': applicable_principle,
            'confidence': applicable_principle['confidence']
        })
    
    return matches
```

### Step 4: Apply Test Functions

**Python Implementation:**

```python
def apply_test_functions(case_graph, lex_graph, matches):
    """Apply lex test functions to matched patterns."""
    
    results = []
    
    for match in matches:
        principle = match['principle']
        
        # Get test function for principle
        test_function = get_test_function(principle['name'])
        
        if test_function:
            # Extract case facts for test
            case_facts = extract_case_facts(case_graph, match['match'])
            
            # Apply test function
            test_result = test_function(case_facts)
            
            results.append({
                'principle': principle['name'],
                'test_result': test_result,
                'confidence': principle['confidence'],
                'case_facts': case_facts,
                'legal_conclusion': generate_conclusion(principle, test_result)
            })
    
    return results
```

---

## Query Patterns

### Pattern 1: Director Duty Breach Detection

**Query:**
> Find all instances where a director may have breached fiduciary duties.

**Hypergraph Pattern:**

```python
director_duty_breach_pattern = {
    'nodes': [
        {'type': 'person', 'role': 'director', 'id': '?director'},
        {'type': 'company', 'role': 'company', 'id': '?company'},
        {'type': 'event', 'role': 'action', 'id': '?action'}
    ],
    'edges': [
        {'source': '?director', 'target': '?company', 'type': 'director_of'},
        {'source': '?action', 'target': '?director', 'type': 'performed_by'}
    ],
    'constraints': [
        {'node': '?action', 'attribute': 'type', 'value': 'transaction'},
        {'node': '?director', 'attribute': 'has_conflict', 'value': True}
    ]
}
```

**Applicable Lex Principles:**
- `director-fiduciary-duty`
- `director-conflict-prohibition`
- `director-self-dealing-prohibition`

**Test Function:**
```python
def director_duty_breach_test(director, company, action):
    return (
        bad_faith(action) or
        improper_purpose(action) or
        conflict_of_interest(action, director) or
        personal_gain(action, director)
    )
```

### Pattern 2: Unjust Enrichment Detection

**Query:**
> Find all instances where one entity may be unjustly enriched at another's expense.

**Hypergraph Pattern:**

```python
unjust_enrichment_pattern = {
    'nodes': [
        {'type': 'entity', 'role': 'enriched', 'id': '?enriched'},
        {'type': 'entity', 'role': 'expense_of', 'id': '?expense_of'},
        {'type': 'event', 'role': 'enrichment_event', 'id': '?event'}
    ],
    'edges': [
        {'source': '?event', 'target': '?enriched', 'type': 'benefits'},
        {'source': '?event', 'target': '?expense_of', 'type': 'costs'}
    ],
    'constraints': [
        {'node': '?event', 'attribute': 'has_contract', 'value': False},
        {'node': '?event', 'attribute': 'compensation_paid', 'value': False}
    ]
}
```

**Applicable Lex Principles:**
- `unjust-enrichment-principle`
- `enrichment-element`
- `at-expense-of-element`
- `no-legal-ground-element`

**Test Function:**
```python
def unjust_enrichment_test(claim):
    return (
        enrichment_exists(claim) and
        at_expense_of_plaintiff(claim) and
        no_legal_ground(claim) and
        no_valid_defense(claim)
    )
```

### Pattern 3: Trust Power Abuse Detection

**Query:**
> Find all instances where a trustee may have abused trust powers.

**Hypergraph Pattern:**

```python
trust_power_abuse_pattern = {
    'nodes': [
        {'type': 'person', 'role': 'trustee', 'id': '?trustee'},
        {'type': 'trust', 'role': 'trust', 'id': '?trust'},
        {'type': 'person', 'role': 'beneficiary', 'id': '?beneficiary'},
        {'type': 'event', 'role': 'action', 'id': '?action'}
    ],
    'edges': [
        {'source': '?trustee', 'target': '?trust', 'type': 'trustee_of'},
        {'source': '?beneficiary', 'target': '?trust', 'type': 'beneficiary_of'},
        {'source': '?action', 'target': '?trustee', 'type': 'performed_by'},
        {'source': '?action', 'target': '?beneficiary', 'type': 'harms'}
    ],
    'constraints': [
        {'node': '?action', 'attribute': 'type', 'value': 'legal_action'},
        {'node': '?action', 'attribute': 'bypasses_trust_remedies', 'value': True}
    ]
}
```

**Applicable Lex Principles:**
- `trust-power-abuse-test`
- `beneficiary-adverse-action-test`
- `trust-remedy-priority-principle`

**Test Function:**
```python
def trust_power_abuse_test(action, trustee, trust_powers):
    return (
        trust_power_available(trustee, trust_powers, action) and
        bypasses_trust_power(action) and
        seeks_external_remedy(action) and
        ulterior_motive_evident(action)
    )
```

### Pattern 4: Related-Party Transaction Detection

**Query:**
> Find all related-party transactions that may require disclosure or approval.

**Hypergraph Pattern:**

```python
related_party_transaction_pattern = {
    'nodes': [
        {'type': 'entity', 'role': 'party1', 'id': '?party1'},
        {'type': 'entity', 'role': 'party2', 'id': '?party2'},
        {'type': 'event', 'role': 'transaction', 'id': '?transaction'}
    ],
    'edges': [
        {'source': '?transaction', 'target': '?party1', 'type': 'involves'},
        {'source': '?transaction', 'target': '?party2', 'type': 'involves'}
    ],
    'constraints': [
        {'relationship': '?party1-?party2', 'type': 'related_party'}
    ]
}
```

**Applicable Lex Principles:**
- `related-party-transaction-disclosure`
- `related-party-transaction-test`
- `arm's-length-transaction-principle`

**Test Function:**
```python
def related_party_transaction_test(transaction, parties):
    return (
        parties_related(parties) and
        (common_ownership(parties) or
         common_control(parties) or
         director_interest(parties, transaction))
    )
```

---

## Example Queries

### Example 1: Detect Peter's Self-Dealing

**Query:**

```python
# Find self-dealing transactions involving Peter
query = """
MATCH (p:Person {name: 'Peter Faucitt'})-[:DIRECTOR_OF]->(c1:Company),
      (p)-[:OWNS]->(c2:Company),
      (t:Transaction)-[:INVOLVES]->(c1),
      (t)-[:INVOLVES]->(c2)
WHERE t.type = 'rent_payment'
RETURN p, c1, c2, t
"""

results = resolver.query(query)

# Apply lex principle
for result in results:
    principle = lex_graph.get_node('director-self-dealing-prohibition')
    test_result = self_dealing_transaction_test(
        transaction=result['t'],
        director=result['p'],
        company=result['c1']
    )
    
    if test_result:
        print(f"Self-dealing detected: {principle['description']}")
        print(f"Evidence: {result}")
```

**Expected Output:**

```
Self-dealing detected: Directors must not engage in self-dealing without disclosure and approval
Evidence: {
  'director': 'Peter Faucitt',
  'company1': 'RST',
  'company2': 'Villa Via',
  'transaction': 'Rent payment R4.4M',
  'profit_margin': 0.86,
  'disclosure': False,
  'independent_approval': False
}
```

### Example 2: Detect RWD Unjust Enrichment

**Query:**

```python
# Find unjust enrichment: RWD using Dan's platform without compensation
query = """
MATCH (rwd:Company {name: 'RWD'})-[:USES_PLATFORM]->(platform:Asset),
      (dan:Company {name: 'RegimA Zone Ltd'})-[:OWNS]->(platform),
      (dan)-[:PAYS_COSTS]->(platform)
WHERE NOT EXISTS((rwd)-[:PAYS]->(dan))
RETURN rwd, dan, platform
"""

results = resolver.query(query)

# Apply lex principle
for result in results:
    principle = lex_graph.get_node('unjust-enrichment-principle')
    test_result = unjust_enrichment_test({
        'enriched': result['rwd'],
        'expense_of': result['dan'],
        'benefit': result['platform'],
        'has_contract': False,
        'compensation_paid': False
    })
    
    if test_result:
        print(f"Unjust enrichment detected: {principle['description']}")
        quantum_meruit = calculate_quantum_meruit(result)
        print(f"Quantum meruit: R{quantum_meruit:,.2f}")
```

**Expected Output:**

```
Unjust enrichment detected: No one should be enriched at another's expense without legal ground
Quantum meruit: R2,940,000.00 - R6,880,000.00
```

### Example 3: Detect Peter's Trust Power Abuse

**Query:**

```python
# Find trust power abuse: Peter bypassing trust remedies
query = """
MATCH (peter:Person {name: 'Peter Faucitt'})-[:TRUSTEE_OF]->(trust:Trust),
      (jax:Person {name: 'Jax Faucitt'})-[:BENEFICIARY_OF]->(trust),
      (action:Event {type: 'court_interdict'})-[:PERFORMED_BY]->(peter),
      (action)-[:TARGETS]->(jax)
WHERE NOT EXISTS((peter)-[:USED_TRUST_REMEDY]->(:TrustRemedy))
RETURN peter, trust, jax, action
"""

results = resolver.query(query)

# Apply lex principle
for result in results:
    principle = lex_graph.get_node('trust-power-abuse-test')
    
    # Get available trust powers
    trust_powers = get_trust_powers(result['trust'])
    
    test_result = trust_power_abuse_test(
        action=result['action'],
        trustee=result['peter'],
        trust_powers=trust_powers
    )
    
    if test_result:
        print(f"Trust power abuse detected: {principle['description']}")
        print(f"Available trust remedies bypassed: {len(trust_powers)}")
```

**Expected Output:**

```
Trust power abuse detected: Trustees must exhaust trust remedies before seeking external legal action
Available trust remedies bypassed: 6
- Remove director
- Withhold distributions
- Call trust meeting
- Appoint independent trustee
- Invoke dispute resolution
- Amend trust deed
```

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Tasks:**
1. ✅ Create lex framework modules
   - ✅ Company law (`lex/cmp/za/south_african_company_law.scm`)
   - ✅ Trust law (`lex/trs/za/south_african_trust_law.scm`)
   - ✅ Civil law unjust enrichment (`lex/civ/za/south_african_civil_law.scm`)

2. ⏳ Scheme parser implementation
   - Parse Scheme files into Python data structures
   - Extract principles, test functions, metadata

3. ⏳ Hypergraph loader
   - Load lex principles into hypergraph
   - Create principle nodes and edges

### Phase 2: Knowledge Graph Construction (Weeks 3-4)

**Tasks:**
1. ⏳ Entity extraction from case documents
   - Parse AD paragraphs
   - Extract entities (persons, companies, trusts)
   - Create entity nodes

2. ⏳ Relation extraction
   - Identify relationships (ownership, employment, transactions)
   - Create relation edges

3. ⏳ Event extraction
   - Extract events from timeline documents
   - Create event nodes
   - Link events to entities

### Phase 3: Pattern Matching (Weeks 5-6)

**Tasks:**
1. ⏳ Implement pattern matching engine
   - Define legal patterns (self-dealing, unjust enrichment, trust abuse)
   - Match patterns to case facts

2. ⏳ Test function integration
   - Implement test functions in Python
   - Apply test functions to matched patterns

3. ⏳ Confidence scoring
   - Calculate confidence scores for matches
   - Rank results by confidence

### Phase 4: Query Interface (Weeks 7-8)

**Tasks:**
1. ⏳ Query language implementation
   - Define query syntax (Cypher-like or custom)
   - Implement query parser and executor

2. ⏳ Interactive query interface
   - CLI for ad-hoc queries
   - Web interface for visualization

3. ⏳ Pre-defined query templates
   - Common legal queries (self-dealing, unjust enrichment, etc.)
   - Query result formatting

### Phase 5: Inference Engine (Weeks 9-10)

**Tasks:**
1. ⏳ Rule-based inference
   - Forward chaining (facts → conclusions)
   - Backward chaining (goals → facts)

2. ⏳ Conflict resolution
   - Identify conflicting principles
   - Resolve by precedence, specificity, confidence

3. ⏳ Legal conclusion generation
   - Generate natural language conclusions
   - Cite applicable principles and evidence

### Phase 6: Integration and Testing (Weeks 11-12)

**Tasks:**
1. ⏳ End-to-end integration
   - Connect all components
   - Test with AD-RES-J7 case

2. ⏳ Validation and refinement
   - Validate results against legal analysis
   - Refine patterns and test functions

3. ⏳ Documentation and deployment
   - User guide
   - API documentation
   - Deployment to production

---

## Usage Examples

### Example: Analyze RWD Revenue Legitimacy

```python
from lex_hypergraph_integration import LexHypergraphSystem

# Initialize system
system = LexHypergraphSystem()
system.load_lex_framework('lex/')
system.load_case_data('jax-response/')

# Query: RWD business substance
results = system.query("""
    ANALYZE business_substance
    FOR entity 'RWD'
    USING principle 'business-substance-test'
""")

print(results)
# Output:
# {
#   'entity': 'RWD',
#   'principle': 'business-substance-test',
#   'test_result': False,
#   'confidence': 1.0,
#   'evidence': {
#     'no_business_assets': True,
#     'no_operational_capacity': True,
#     'revenue_without_substance': True,
#     'no_independent_economic_purpose': True
#   },
#   'conclusion': 'RWD fails business substance test'
# }

# Query: RWD unjust enrichment
results = system.query("""
    ANALYZE unjust_enrichment
    FOR entity 'RWD'
    AGAINST entity 'RegimA Zone Ltd'
    USING principle 'unjust-enrichment-test'
""")

print(results)
# Output:
# {
#   'enriched': 'RWD',
#   'expense_of': 'RegimA Zone Ltd',
#   'principle': 'unjust-enrichment-test',
#   'test_result': True,
#   'confidence': 1.0,
#   'elements': {
#     'enrichment_exists': True,
#     'at_expense_of_plaintiff': True,
#     'no_legal_ground': True,
#     'no_valid_defense': True
#   },
#   'quantum_meruit': {
#     'conservative': 2940000,
#     'market_rate': 6880000
#   },
#   'conclusion': 'RWD unjustly enriched at RegimA Zone Ltd expense'
# }
```

### Example: Analyze Peter's Trust Power Abuse

```python
# Query: Peter's trust power abuse
results = system.query("""
    ANALYZE trust_power_abuse
    FOR trustee 'Peter Faucitt'
    ACTION 'court_interdict'
    USING principle 'trust-power-abuse-test'
""")

print(results)
# Output:
# {
#   'trustee': 'Peter Faucitt',
#   'action': 'court_interdict',
#   'principle': 'trust-power-abuse-test',
#   'test_result': True,
#   'confidence': 1.0,
#   'elements': {
#     'trust_power_available': True,
#     'bypasses_trust_power': True,
#     'seeks_external_remedy': True,
#     'ulterior_motive_evident': True
#   },
#   'available_trust_remedies': [
#     'remove_director',
#     'withhold_distributions',
#     'call_trust_meeting',
#     'appoint_independent_trustee',
#     'invoke_dispute_resolution',
#     'amend_trust_deed'
#   ],
#   'conclusion': 'Peter abused trust powers by bypassing adequate trust remedies'
# }
```

---

## Conclusion

This integration guide provides a comprehensive framework for combining **lex legal principles** with **hypergraph-based legal reasoning**. The system enables:

1. **Automated legal analysis** - Apply formal legal principles to case facts
2. **Pattern-based detection** - Identify legal issues from entity/relation graphs
3. **Systematic reasoning** - Use test functions for consistent legal conclusions
4. **Evidence-based claims** - Generate legal claims with supporting evidence
5. **Scalable architecture** - Extend to additional legal domains and jurisdictions

**Next Steps:**
1. Implement Scheme parser for lex framework loading
2. Build case knowledge graph from AD documents
3. Develop pattern matching engine
4. Create query interface for legal analysis
5. Integrate with answering affidavit generation

**Benefits:**
- **Consistency** - Formal principles ensure consistent legal analysis
- **Transparency** - Clear provenance from facts to conclusions
- **Scalability** - Easily extend to new legal domains
- **Automation** - Reduce manual legal analysis effort
- **Validation** - Systematic testing of legal arguments

---

**End of Lex Framework - Hypergraph Resolver Integration Guide**

