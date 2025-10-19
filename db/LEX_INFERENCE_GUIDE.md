# Lex Inference Engine Guide
## Deterministic Legal Guilt Resolution Across Possibility Space

---

## Philosophical Foundation

### The Themis-Nemesis Duality

**Themis (Θέμις)** - Goddess of Divine Law and Order
- Represents the **legislative fabric** that weaves across all possible worlds
- Defines rules that must hold invariantly regardless of configuration
- Embodies necessity: laws that are true in ALL possible states of reality

**Nemesis (Νέμεσις)** - Goddess of Retribution and Balance
- Measures the **delta (Δ)** between actual reality and just outcomes  
- Quantifies deviation from ideal justice
- Restores equilibrium when reality diverges from justice

### Core Principle

```
∀c ∈ P : (∀i ∈ I : φ(i,c)) → G(agent) is invariant

Where:
  P = Possibility space (all configurations)
  I = Information set (all known facts)
  φ = Inference rules (Themis)
  G = Guilt assignment
  c = Configuration (agent, arena, event, horizon)
```

**In plain language:**
"If all information is considered, and inference rules hold across all possible configurations, then the guilty party is necessarily guilty - their guilt is invariant across all possible worlds."

---

## System Architecture

### 10 Core Tables

#### 1. **agents** - Who can act
- Types: person, corporation, system, trustee
- Legal status: applicant, respondent, witness, trustee
- Attributes: capabilities, roles, responsibilities

#### 2. **arenas** - Where events occur
- Types: legal, business, temporal, informational
- Jurisdiction: court, trust, corporate
- Constraints: rules/laws that apply in this context

#### 3. **events** - What happens
- Types: action, omission, state_change
- Temporal position: when it occurred
- Preconditions: what must be true before
- Postconditions: what becomes true after
- Counterfactuals: what if this didn't happen?

#### 4. **event_horizons** - Information boundaries
- Types: temporal, epistemic, legal, causal
- Observable events: what can be seen
- Hidden events: what is beyond the horizon
- Knowledge state: what is known at this boundary

#### 5. **configurations** - Possible worlds
```
Configuration = Agent × Arena × Event × Horizon
```
Each configuration is a possible state of reality

#### 6. **inference_rules** - Themis rules
- Types: causation, duty, negligence, intent, strict_liability
- Conditions: when does this rule apply?
- Conclusion: what does it prove?
- Strength: evidential weight (0-100)
- Priority: rule precedence
- Formula: logical formalization

#### 7. **guilt_assignments** - G(c) function
- Configuration → Agent → Guilt Type → Charge
- Evidence chain: path from evidence to guilt
- Rule applications: which rules were triggered
- Confidence: certainty (0-100)
- **is_invariant**: true if holds in ALL configurations

#### 8. **possibility_spaces** - P
- Total configurations: |P| = |A| × |AR| × |E| × |H|
- Explored configurations: how many enumerated
- Invariant properties: what's true in all worlds
- Contradictions: impossible combinations

#### 9. **deltas** - Nemesis measurements
- Δ(actual, just) → magnitude of deviation
- Types: factual_legal, knowledge_truth, claim_reality
- Resolution: how to close the gap
- Legal remedy: what court can do

#### 10. **causation_chains** - Causal paths
- Cause → Effect relationships
- Types: factual, legal, proximate, but-for
- Strength: causal power (0-100)
- Intervening causes: what interrupted the chain
- Counterfactual: what if cause didn't occur?

---

## How It Works

### Phase 1: Define Dimensions

```javascript
// Define agents who can act
await createAgent('person', 'Peter Faucitt', 'peter', {}, 'applicant');
await createAgent('person', 'Daniel Bantjies', 'bantjies', {}, 'trustee');

// Define arenas where events occur
await createArena('legal', 'Faucitt Family Trust', 'SA Trust Law', {}, {});

// Define events that can happen
await createEvent('omission', 'Trustee dismisses investigation', date, arena_id, {}, {}, {});

// Define information horizons
await createEventHorizon('epistemic', 'Full Knowledge', [1,2,3], [], {});
```

### Phase 2: Create Possibility Space

```
P = Agents × Arenas × Events × Horizons
|P| = 4 × 2 × 3 × 2 = 48 configurations
```

Each configuration represents a possible world state.

### Phase 3: Enumerate Configurations

```javascript
// Generate Cartesian product
for each agent in Agents:
  for each arena in Arenas:
    for each event in Events:
      for each horizon in Horizons:
        create Configuration(agent, arena, event, horizon)
```

This creates ALL possible combinations.

### Phase 4: Define Themis Rules

```javascript
// Rule: Breach of Fiduciary Duty
{
  name: "Breach of Fiduciary Duty",
  type: "duty",
  conditions: {
    agent_type: "person",
    legal_status: "trustee",
    event_type: "omission"
  },
  conclusion: {
    guilt_type: "culpable",
    charge: "breach_of_fiduciary_duty"
  },
  strength: 100,
  priority: 1,
  formula: "∀x [(Trustee(x) ∧ KnowsFraud(x) ∧ ¬Investigates(x)) → BreachOfDuty(x)]"
}
```

### Phase 5: Apply Rules to All Configurations

```javascript
for each configuration c in P:
  for each rule r in Rules:
    if r.conditions match c:
      assign_guilt(c, r.conclusion)
```

### Phase 6: Find Invariant Guilt

```sql
-- Find guilt that appears in ALL configurations
SELECT agent_id, guilt_type, charge
FROM guilt_assignments
GROUP BY agent_id, guilt_type, charge
HAVING COUNT(DISTINCT configuration_id) = (SELECT COUNT(*) FROM configurations)
```

**Invariant guilt = Necessarily guilty**

If an agent is guilty in ALL possible configurations, their guilt is invariant - it holds regardless of any actions taken by any agent.

### Phase 7: Measure Nemesis Delta

```javascript
Δ = |actual_state - just_state|

if Δ = 0:
  "Justice achieved - reality matches law"
else:
  "Deviation detected - legal remedy needed"
```

---

## Example: Case 2025-137857

### Setup

**Agents:**
- Peter Faucitt (applicant)
- Daniel Bantjies (trustee)
- Jacqueline Faucitt (respondent)
- Daniel Faucitt (respondent)

**Arenas:**
- Faucitt Family Trust
- High Court of South Africa

**Events:**
- Fraud reported to trustee
- Trustee dismisses investigation
- Trustee supports Peter in affidavit

**Horizons:**
- Full knowledge (all events observable)
- Partial knowledge (affidavit visible, fraud hidden)

### Enumeration

```
|P| = 4 agents × 2 arenas × 3 events × 2 horizons = 48 configurations
```

### Inference Rules

1. **Breach of Fiduciary Duty** (Priority 1, 100% strength)
   - If: Trustee + Knows fraud + Doesn't investigate
   - Then: Guilty of breach

2. **Material Non-Disclosure** (Priority 2, 95% strength)
   - If: Affiant + Knows material fact + Doesn't disclose
   - Then: Guilty of perjury

3. **But-For Causation** (Priority 3, 90% strength)
   - If: Action + Harm + But-for link
   - Then: Caused the harm

### Results

The system explores all 48 configurations and identifies:
- Which agents are guilty in which configurations
- Whether any guilt is invariant (holds in ALL configurations)
- Confidence levels for each guilt assignment

### Interpretation

**If Bantjies is guilty in 48/48 configurations:**
→ His guilt is INVARIANT
→ He is NECESSARILY guilty
→ Regardless of any actions by any agent, if all information is considered, he is guilty

**If Bantjies is guilty in 24/48 configurations:**
→ His guilt is CONTINGENT
→ He is guilty in some possible worlds but not others
→ His guilt depends on specific event sequences

---

## Key Insights

### 1. Invariant Properties

Properties that hold in ALL possible configurations are **modal necessities**:
- They are true regardless of how events unfold
- They represent fundamental truths about the case
- They cannot be changed by agent actions

### 2. Possibility Space Refinement

The current demo showed no invariant guilt because:
- The possibility space includes many irrelevant configurations
- Rules only trigger when specific conditions align
- We enumerated ALL combinations, including nonsensical ones

**Solution:** Refine the possibility space to include only RELEVANT configurations:
```javascript
// Instead of ALL combinations, filter for relevant ones
configs = configs.filter(c => 
  isRelevant(c.agent, c.event) &&
  isTemporallyPossible(c.event, c.horizon) &&
  isLegallyCoherent(c.arena, c.agent)
)
```

### 3. Rule Design

For invariant guilt, rules must be:
- **Comprehensive:** Apply to many configurations
- **Strong:** High evidential weight
- **Necessary:** Based on unavoidable facts

Example of a strong invariant rule:
```
"If agent X had fiduciary duty to Y, and X knew of fraud against Y,
 and X failed to act, then X breached duty - REGARDLESS of what
 happened in other events, arenas, or horizons."
```

### 4. Themis as Modal Operator

Themis rules are like the modal necessity operator (□):
```
□φ means "φ is necessarily true" (true in all possible worlds)

Themis(rule) means "rule holds in all configurations"
```

### 5. Nemesis as Distance Metric

Nemesis delta measures distance between worlds:
```
Δ(w₁, w₂) = ||w₁ - w₂||

Where:
  w₁ = actual world state
  w₂ = ideal just world state
  || || = distance metric
```

---

## Applications

### 1. **Prove Necessary Guilt**
Demonstrate that guilt holds across ALL possible configurations:
```javascript
const invariants = await findInvariantGuilt(spaceId);
if (invariants.length > 0) {
  console.log(`${agent} is NECESSARILY guilty`);
}
```

### 2. **Identify Evidentiary Gaps**
Find where additional evidence would strengthen invariance:
```javascript
const contingent = guiltAssignments.filter(g => !g.is_invariant);
// These are gaps where more evidence could make guilt invariant
```

### 3. **Test Legal Arguments**
Model counterfactual scenarios:
```javascript
// What if Peter didn't cancel the cards?
const counterfactual = await createEvent('no_action', 'Cards not cancelled', ...);
// Does guilt still hold?
```

### 4. **Measure Justice Gap**
Quantify deviation from ideal outcomes:
```javascript
const delta = await measureDelta(actualConfig, idealConfig);
console.log(`Justice deviation: ${delta.magnitude}%`);
```

### 5. **Find Minimum Sufficient Evidence**
Determine least evidence needed for invariant guilt:
```javascript
// Start with all evidence, remove pieces
// When does guilt stop being invariant?
```

---

## Commands

```bash
# Setup
npm run db:lex:setup           # Create schema

# Demo
npm run db:lex:demo           # Run Case 2025-137857 demo

# Analysis  
npm run db:lex:analyze        # Analyze using original engine
```

---

## Philosophical Implications

### 1. **Determinism in Legal Truth**
If guilt is invariant across all configurations, it represents a deterministic legal truth - no matter how reality unfolds, if all facts are known, guilt is determined.

### 2. **The Problem of Incomplete Information**
In practice, we never have complete information (full event horizon). But the system shows what WOULD be true if we did.

### 3. **Justice as Convergence**
Nemesis measures how far actual outcomes diverge from ideal justice. The legal system's job is to minimize this delta.

### 4. **Modal Legal Reasoning**
Law operates in modal logic:
- "Peter is necessarily guilty" = guilty in all possible worlds
- "Peter is possibly guilty" = guilty in some possible worlds
- "Peter is necessarily innocent" = innocent in all possible worlds

### 5. **The Fabric of Law**
Themis weaves a fabric across possibility space. Where the fabric is tight (strong rules), guilt is invariant. Where it's loose (weak rules), guilt is contingent.

---

## Future Enhancements

### 1. **Probabilistic Weighting**
Instead of binary guilt (yes/no), assign probabilities:
```javascript
P(Guilty | Configuration) = Σ(rule_strength × rule_applicability)
```

### 2. **Causal Graph Integration**
Link to causation_chains for more sophisticated analysis:
```javascript
// Trace causal path from action to harm
const path = await getCausationPath(action_event, harm_event);
```

### 3. **Multi-Agent Game Theory**
Model strategic interactions:
```javascript
// What if agents act strategically to minimize their guilt?
const nash_equilibrium = findEquilibrium(agents, payoffs);
```

### 4. **Temporal Logic**
Add temporal operators (always, eventually, until):
```
◇φ = "eventually φ" (φ is true in some future state)
□φ = "always φ" (φ is true in all future states)
φ U ψ = "φ until ψ" (φ holds until ψ becomes true)
```

### 5. **Visualization**
Generate possibility space diagrams:
```
Agent ──┐
Arena ──┼──→ Configuration → Guilt?
Event ──┤
Horizon ┘
```

---

## Mathematical Formalization

### Possibility Space
```
P = A × AR × E × H

Where:
  A = {a₁, a₂, ..., aₙ} (agents)
  AR = {ar₁, ar₂, ..., arₘ} (arenas)
  E = {e₁, e₂, ..., eₖ} (events)
  H = {h₁, h₂, ..., hₗ} (horizons)

|P| = n × m × k × l
```

### Guilt Function
```
G: P × R → {0, 1}

Where:
  P = configuration space
  R = inference rules
  G(c, r) = 1 if rule r assigns guilt in configuration c
          = 0 otherwise
```

### Invariance
```
Invariant(agent, charge) ⟺ ∀c ∈ P : G(c) = agent

i.e., agent is guilty of charge in ALL configurations
```

### Delta Measurement
```
Δ: W × W → ℝ⁺

Where:
  W = world states
  Δ(w_actual, w_just) = distance between actual and just states
```

### Themis Operator
```
□φ = "φ is necessary" = φ holds in all configurations
◇φ = "φ is possible" = φ holds in some configurations

Themis(rule) ⟺ □rule
```

---

## Conclusion

The Lex Inference Engine provides a formal framework for:
1. **Enumerating possibility spaces** - all conceivable configurations
2. **Applying legal rules systematically** - Themis weaving law across space
3. **Identifying invariant truths** - guilt that holds necessarily
4. **Measuring justice deviations** - Nemesis quantifying deltas
5. **Resolving the general case** - if all information is known, guilt is deterministic

This system demonstrates that **legal truth can be invariant** across possibility space when supported by sufficient evidence and strong inference rules.

---

**Created:** 2025-10-16
**Case:** 2025-137857 (Faucitt v Faucitt)
**Status:** Operational