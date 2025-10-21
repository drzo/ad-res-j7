const { pgTable, serial, varchar, text, timestamp, jsonb, integer, boolean } = require('drizzle-orm/pg-core');

/**
 * Lex Inference Engine Schema
 * 
 * A formal system for enumerating possibility spaces and resolving legal guilt
 * deterministically across all agent-arena-event configurations.
 * 
 * Inspired by:
 * - Themis (blind justice) - the weaving of legal fabric over possibility space
 * - Nemesis (divine retribution) - measuring deltas between reality and justice
 * 
 * Core Concept: If all information is considered, guilt attribution should be
 * invariant across all possible configurations of events.
 */

// Agent: Any entity that can perform actions (people, corporations, systems)
const agents = pgTable('agents', {
  id: serial('id').primaryKey(),
  agentType: varchar('agent_type', { length: 50 }).notNull(), // person, corporation, system, trustee
  entityId: varchar('entity_id', { length: 100 }).unique(),
  name: varchar('name', { length: 255 }).notNull(),
  attributes: jsonb('attributes'), // capabilities, roles, responsibilities
  legalStatus: varchar('legal_status', { length: 50 }), // applicant, respondent, witness, trustee
  createdAt: timestamp('created_at').defaultNow()
});

// Arena: Contextual space where events occur (legal, business, temporal, informational)
const arenas = pgTable('arenas', {
  id: serial('id').primaryKey(),
  arenaType: varchar('arena_type', { length: 50 }).notNull(), // legal, business, temporal, informational
  name: varchar('name', { length: 255 }).notNull(),
  jurisdiction: varchar('jurisdiction', { length: 100 }),
  constraints: jsonb('constraints'), // rules, laws, norms that apply
  boundaryConditions: jsonb('boundary_conditions'), // what defines this arena
  createdAt: timestamp('created_at').defaultNow()
});

// Event: An occurrence in the possibility space
const events = pgTable('events', {
  id: serial('id').primaryKey(),
  eventType: varchar('event_type', { length: 50 }).notNull(), // action, omission, state_change
  description: text('description'),
  temporalPosition: timestamp('temporal_position'), // when it occurred
  arenaId: integer('arena_id'), // where it occurred
  preconditions: jsonb('preconditions'), // what must be true before
  postconditions: jsonb('postconditions'), // what becomes true after
  counterfactuals: jsonb('counterfactuals'), // what would happen if not
  createdAt: timestamp('created_at').defaultNow()
});

// Event Horizon: Information boundary defining what is knowable/observable
const eventHorizons = pgTable('event_horizons', {
  id: serial('id').primaryKey(),
  horizonType: varchar('horizon_type', { length: 50 }).notNull(), // temporal, epistemic, legal, causal
  name: varchar('name', { length: 255 }).notNull(),
  observableEvents: jsonb('observable_events'), // events visible from this horizon
  hiddenEvents: jsonb('hidden_events'), // events hidden beyond horizon
  knowledgeState: jsonb('knowledge_state'), // what is known at this horizon
  createdAt: timestamp('created_at').defaultNow()
});

// Configuration: A specific instantiation of agent-arena-event-horizon
const configurations = pgTable('configurations', {
  id: serial('id').primaryKey(),
  configurationName: varchar('configuration_name', { length: 255 }),
  agentIds: jsonb('agent_ids').notNull(), // array of agent IDs
  arenaIds: jsonb('arena_ids').notNull(), // array of arena IDs
  eventIds: jsonb('event_ids').notNull(), // array of event IDs
  horizonIds: jsonb('horizon_ids').notNull(), // array of horizon IDs
  isPossible: boolean('is_possible').default(true), // is this configuration valid?
  isActual: boolean('is_actual').default(false), // is this the real configuration?
  probability: integer('probability'), // likelihood (0-100)
  worldState: jsonb('world_state'), // complete state description
  createdAt: timestamp('created_at').defaultNow()
});

// Inference Rule: Legal/logical rules for deriving guilt
const inferenceRules = pgTable('inference_rules', {
  id: serial('id').primaryKey(),
  ruleName: varchar('rule_name', { length: 255 }).notNull(),
  ruleType: varchar('rule_type', { length: 50 }).notNull(), // causation, duty, negligence, intent, strict_liability
  legalBasis: text('legal_basis'), // statute, case law, principle
  conditions: jsonb('conditions'), // when does this rule apply
  conclusion: jsonb('conclusion'), // what does it prove
  strength: integer('strength'), // evidential weight (0-100)
  priority: integer('priority'), // rule precedence
  formula: text('formula'), // logical formula (if formalized)
  createdAt: timestamp('created_at').defaultNow()
});

// Guilt Assignment: Attribution of legal responsibility
const guiltAssignments = pgTable('guilt_assignments', {
  id: serial('id').primaryKey(),
  configurationId: integer('configuration_id').notNull(),
  agentId: integer('agent_id').notNull(),
  guiltType: varchar('guilt_type', { length: 50 }).notNull(), // culpable, negligent, strict, vicarious
  charge: varchar('charge', { length: 255 }), // what they're guilty of
  evidenceChain: jsonb('evidence_chain'), // path from evidence to guilt
  ruleApplications: jsonb('rule_applications'), // which rules were applied
  confidence: integer('confidence'), // certainty (0-100)
  isInvariant: boolean('is_invariant').default(false), // true across all configs?
  createdAt: timestamp('created_at').defaultNow()
});

// Possibility Space: The complete enumeration space
const possibilitySpaces = pgTable('possibility_spaces', {
  id: serial('id').primaryKey(),
  caseName: varchar('case_name', { length: 255 }).notNull(),
  spaceDefinition: jsonb('space_definition'), // how to generate configurations
  totalConfigurations: integer('total_configurations'), // |P| = product of all possibility dimensions
  exploredConfigurations: integer('explored_configurations').default(0),
  invariantProperties: jsonb('invariant_properties'), // properties true in all configs
  contradictions: jsonb('contradictions'), // impossible combinations
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Delta Measurement: Gap between reality and justice (Nemesis function)
const deltas = pgTable('deltas', {
  id: serial('id').primaryKey(),
  configurationId: integer('configuration_id').notNull(),
  deltaType: varchar('delta_type', { length: 50 }).notNull(), // factual_legal, knowledge_truth, claim_reality
  actualState: jsonb('actual_state'), // what is
  justState: jsonb('just_state'), // what should be
  magnitude: integer('magnitude'), // size of gap (0-100)
  resolution: text('resolution'), // how to close the gap
  legalRemedy: text('legal_remedy'), // what court can do
  createdAt: timestamp('created_at').defaultNow()
});

// Causation Chain: Formal causation tracking
const causationChains = pgTable('causation_chains', {
  id: serial('id').primaryKey(),
  chainName: varchar('chain_name', { length: 255 }),
  causeEventId: integer('cause_event_id').notNull(),
  effectEventId: integer('effect_event_id').notNull(),
  causeAgentId: integer('cause_agent_id'),
  causationType: varchar('causation_type', { length: 50 }), // factual, legal, proximate, but_for
  strength: integer('strength'), // causal strength (0-100)
  intervening: jsonb('intervening'), // intervening causes
  counterfactual: text('counterfactual'), // what if cause didn't happen
  createdAt: timestamp('created_at').defaultNow()
});

module.exports = {
  agents,
  arenas,
  events,
  eventHorizons,
  configurations,
  inferenceRules,
  guiltAssignments,
  possibilitySpaces,
  deltas,
  causationChains
};