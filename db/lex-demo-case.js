#!/usr/bin/env node

const { db } = require('./config');
const { sql } = require('drizzle-orm');
const LexComprehensiveEngine = require('./lex-comprehensive-engine');

/**
 * Case 2025-137857 Demo
 * Demonstrates deterministic guilt resolution across possibility space
 */
async function runCaseDemo() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  LEX INFERENCE ENGINE - Case 2025-137857 Demonstration');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('  Principle: If all information is considered, the guilty party');
  console.log('             is always guilty, invariant across all possible');
  console.log('             agent-arena-event-horizon configurations.\n');
  console.log('  Themis (Θέμις): Weaves the fabric of law over possibility space');
  console.log('  Nemesis (Νέμεσις): Measures delta between reality and justice');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const engine = new LexComprehensiveEngine();
  
  // ===== PHASE 1: POPULATE AGENTS =====
  console.log('📝 Phase 1: Defining Agents\n');
  
  const peter = await db.execute(sql`
    INSERT INTO agents (agent_type, entity_id, name, attributes, legal_status)
    VALUES (
      'person',
      'peter_faucitt',
      'Peter Andrew Faucitt',
      '{"role": "principal", "control": "email_servers"}',
      'applicant'
    )
    RETURNING *
  `);
  console.log('  ✅ Agent: Peter Andrew Faucitt (Applicant)');
  
  const bantjies = await db.execute(sql`
    INSERT INTO agents (agent_type, entity_id, name, attributes, legal_status)
    VALUES (
      'person',
      'daniel_bantjies',
      'Daniel Bantjies',
      '{"role": "trustee", "fiduciary_duty": true}',
      'trustee'
    )
    RETURNING *
  `);
  console.log('  ✅ Agent: Daniel Bantjies (Trustee)');
  
  const jacqui = await db.execute(sql`
    INSERT INTO agents (agent_type, entity_id, name, attributes, legal_status)
    VALUES (
      'person',
      'jacqui_faucitt',
      'Jacqueline Faucitt',
      '{"role": "director", "control": "business_operations"}',
      'respondent'
    )
    RETURNING *
  `);
  console.log('  ✅ Agent: Jacqueline Faucitt (First Respondent)');
  
  const daniel = await db.execute(sql`
    INSERT INTO agents (agent_type, entity_id, name, attributes, legal_status)
    VALUES (
      'person',
      'daniel_faucitt',
      'Daniel James Faucitt',
      '{"role": "beneficiary", "heir": true}',
      'respondent'
    )
    RETURNING *
  `);
  console.log('  ✅ Agent: Daniel James Faucitt (Second Respondent)\n');
  
  // ===== PHASE 2: DEFINE ARENAS =====
  console.log('🏛️  Phase 2: Defining Arenas\n');
  
  const trustArena = await db.execute(sql`
    INSERT INTO arenas (arena_type, name, jurisdiction, constraints, boundary_conditions)
    VALUES (
      'legal',
      'Faucitt Family Trust',
      'South Africa - Trust Law',
      '{"fiduciary_duty": true, "transparency_required": true}',
      '{"trustees_must_act_in_beneficiary_interest": true}'
    )
    RETURNING *
  `);
  console.log('  ✅ Arena: Faucitt Family Trust (Legal)');
  
  const courtArena = await db.execute(sql`
    INSERT INTO arenas (arena_type, name, jurisdiction, constraints, boundary_conditions)
    VALUES (
      'legal',
      'High Court of South Africa',
      'South Africa - Civil Procedure',
      '{"affidavit_must_be_truthful": true, "material_facts_required": true}',
      '{"perjury_sanctions": true}'
    )
    RETURNING *
  `);
  console.log('  ✅ Arena: High Court of South Africa (Legal)\n');
  
  // ===== PHASE 3: DEFINE EVENTS =====
  console.log('📅 Phase 3: Defining Events\n');
  
  const fraudReport = await db.execute(sql`
    INSERT INTO events (event_type, description, temporal_position, arena_id, preconditions, postconditions, counterfactuals)
    VALUES (
      'allegation',
      'Daniel reports R10M fraud to trustee Bantjies',
      '2025-06-10',
      ${trustArena.rows[0].id},
      '{"evidence_of_fraud": true}',
      '{"trustee_has_knowledge": true}',
      '{"if_not_reported": "trustee_lacks_knowledge"}'
    )
    RETURNING *
  `);
  console.log('  ✅ Event: Fraud Allegation (2025-06-10)');
  
  const trusteeDismissal = await db.execute(sql`
    INSERT INTO events (event_type, description, temporal_position, arena_id, preconditions, postconditions, counterfactuals)
    VALUES (
      'omission',
      'Bantjies dismisses fraud investigation',
      '2025-06-10',
      ${trustArena.rows[0].id},
      '{"knowledge_of_fraud": true, "fiduciary_duty": true}',
      '{"beneficiary_harmed": true, "breach_of_duty": true}',
      '{"if_investigated": "fraud_exposed"}'
    )
    RETURNING *
  `);
  console.log('  ✅ Event: Trustee Dismisses Investigation (2025-06-10)');
  
  const affidavitSupport = await db.execute(sql`
    INSERT INTO events (event_type, description, temporal_position, arena_id, preconditions, postconditions, counterfactuals)
    VALUES (
      'action',
      'Bantjies supports Peter in affidavit against Daniel',
      '2025-08-13',
      ${courtArena.rows[0].id},
      '{"fraud_allegation_known": true}',
      '{"material_fact_omitted": true}',
      '{"if_disclosed": "peter_case_fails"}'
    )
    RETURNING *
  `);
  console.log('  ✅ Event: Affidavit Supporting Peter (2025-08-13)\n');
  
  // ===== PHASE 4: DEFINE EVENT HORIZONS =====
  console.log('🔭 Phase 4: Defining Event Horizons\n');
  
  const fullKnowledge = await db.execute(sql`
    INSERT INTO event_horizons (horizon_type, name, observable_events, hidden_events, knowledge_state)
    VALUES (
      'epistemic',
      'Full Knowledge Horizon',
      '[1,2,3]',
      '[]',
      '{"all_facts_known": true, "complete_information": true}'
    )
    RETURNING *
  `);
  console.log('  ✅ Horizon: Full Knowledge (all events observable)');
  
  const partialKnowledge = await db.execute(sql`
    INSERT INTO event_horizons (horizon_type, name, observable_events, hidden_events, knowledge_state)
    VALUES (
      'epistemic',
      'Partial Knowledge Horizon',
      '[3]',
      '[1,2]',
      '{"affidavit_visible": true, "fraud_hidden": true}'
    )
    RETURNING *
  `);
  console.log('  ✅ Horizon: Partial Knowledge (affidavit visible, fraud hidden)\n');
  
  // ===== PHASE 5: DEFINE INFERENCE RULES =====
  console.log('⚖️  Phase 5: Defining Inference Rules (Themis)\n');
  
  await db.execute(sql`
    INSERT INTO inference_rules (
      rule_name, rule_type, legal_basis,
      conditions, conclusion,
      strength, priority, formula
    )
    VALUES (
      'Breach of Fiduciary Duty',
      'duty',
      'Trust Property Control Act - Section 9',
      '{"agent_type": "person", "event_type": "omission", "legal_status": "trustee"}',
      '{"guilt_type": "culpable", "charge": "breach_of_fiduciary_duty", "agent_id": null}',
      100,
      1,
      '∀x [(Trustee(x) ∧ KnowsFraud(x) ∧ ¬Investigates(x)) → BreachOfDuty(x)]'
    )
  `);
  console.log('  ✅ Rule: Breach of Fiduciary Duty (Priority 1, Strength 100%)');
  
  await db.execute(sql`
    INSERT INTO inference_rules (
      rule_name, rule_type, legal_basis,
      conditions, conclusion,
      strength, priority, formula
    )
    VALUES (
      'Material Non-Disclosure in Affidavit',
      'negligence',
      'Plascon-Evans Paints Ltd v Van Riebeeck Paints (Pty) Ltd',
      '{"agent_type": "person", "event_type": "action", "legal_status": "trustee"}',
      '{"guilt_type": "negligent", "charge": "material_nondisclosure", "agent_id": null}',
      95,
      2,
      '∀x [(Affiant(x) ∧ KnowsMaterialFact(x) ∧ ¬Discloses(x)) → Perjury(x)]'
    )
  `);
  console.log('  ✅ Rule: Material Non-Disclosure (Priority 2, Strength 95%)');
  
  await db.execute(sql`
    INSERT INTO inference_rules (
      rule_name, rule_type, legal_basis,
      conditions, conclusion,
      strength, priority, formula
    )
    VALUES (
      'But-For Causation',
      'causation',
      'Lee v Minister of Correctional Services',
      '{"event_type": "omission"}',
      '{"guilt_type": "causation", "charge": "caused_harm", "agent_id": null}',
      90,
      3,
      '∀x,y [(Action(x) ∧ Harm(y) ∧ ButFor(x,y)) → Caused(x,y)]'
    )
  `);
  console.log('  ✅ Rule: But-For Causation (Priority 3, Strength 90%)\n');
  
  // ===== PHASE 6: CREATE POSSIBILITY SPACE =====
  const space = await engine.createPossibilitySpace('Case 2025-137857');
  
  // ===== PHASE 7: ENUMERATE CONFIGURATIONS =====
  const configs = await engine.enumerateAllConfigurations(space.id);
  
  // ===== PHASE 8: APPLY INFERENCE RULES =====
  await engine.applyInferenceRulesToAll(space.id);
  
  // ===== PHASE 9: FIND INVARIANT GUILT =====
  const guiltAnalysis = await engine.findInvariantGuilt(space.id);
  
  // ===== PHASE 10: FINAL RESULTS =====
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  FINAL DETERMINATION');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  if (guiltAnalysis.invariants.length > 0) {
    console.log('  🎯 NECESSARILY GUILTY (invariant across ALL configurations):\n');
    for (const inv of guiltAnalysis.invariants) {
      console.log(`  ✅ ${inv.agent_name}`);
      console.log(`     Charge: ${inv.charge}`);
      console.log(`     Modality: NECESSARY (holds in all possible worlds)`);
      console.log(`     Confidence: ${parseFloat(inv.avg_confidence).toFixed(0)}%`);
      console.log(`     Proof: Guilty in ${inv.guilty_count}/${inv.total_configs} configurations (100%)\n`);
    }
    
    console.log('  📜 Legal Significance:');
    console.log('     "Regardless of any actions taken by any agent, if all information');
    console.log('      is considered, the above parties are guilty in every conceivable');
    console.log('      configuration of events. Their guilt is INVARIANT."\n');
  } else {
    console.log('  ⚠️  No party is necessarily guilty across all configurations.');
    console.log('     Guilt is contingent on specific event sequences.\n');
  }
  
  // ===== PHASE 11: STATISTICS =====
  const stats = await engine.getStats();
  console.log('  📊 Enumeration Statistics:');
  console.log(`     Total configurations explored: ${stats.configurations}`);
  console.log(`     Guilt assignments made: ${stats.guilt_assignments}`);
  console.log(`     Invariant guilt found: ${stats.invariant_guilt}`);
  console.log(`     Inference rules applied: ${stats.inference_rules}\n`);
  
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  process.exit(0);
}

// Run demo
runCaseDemo().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});