#!/usr/bin/env node

const { db } = require('./config');
const { sql } = require('drizzle-orm');

async function createLexInferenceSchema() {
  console.log('🏛️  Creating Lex Inference Engine Schema...\n');
  console.log('   "As Themis weaves the fabric of law over possibility space,');
  console.log('    Nemesis measures the delta between reality and justice."\n');
  
  try {
    // Agents table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        agent_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR(100) UNIQUE,
        name VARCHAR(255) NOT NULL,
        attributes JSONB,
        legal_status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created agents table');

    // Arenas table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS arenas (
        id SERIAL PRIMARY KEY,
        arena_type VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        jurisdiction VARCHAR(100),
        constraints JSONB,
        boundary_conditions JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created arenas table');

    // Events table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        description TEXT,
        temporal_position TIMESTAMP,
        arena_id INTEGER REFERENCES arenas(id),
        preconditions JSONB,
        postconditions JSONB,
        counterfactuals JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created events table');

    // Event Horizons table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS event_horizons (
        id SERIAL PRIMARY KEY,
        horizon_type VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        observable_events JSONB,
        hidden_events JSONB,
        knowledge_state JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created event_horizons table');

    // Configurations table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS configurations (
        id SERIAL PRIMARY KEY,
        configuration_name VARCHAR(255),
        agent_ids JSONB NOT NULL,
        arena_ids JSONB NOT NULL,
        event_ids JSONB NOT NULL,
        horizon_ids JSONB NOT NULL,
        is_possible BOOLEAN DEFAULT true,
        is_actual BOOLEAN DEFAULT false,
        probability INTEGER CHECK (probability >= 0 AND probability <= 100),
        world_state JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created configurations table');

    // Inference Rules table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS inference_rules (
        id SERIAL PRIMARY KEY,
        rule_name VARCHAR(255) NOT NULL,
        rule_type VARCHAR(50) NOT NULL,
        legal_basis TEXT,
        conditions JSONB,
        conclusion JSONB,
        strength INTEGER CHECK (strength >= 0 AND strength <= 100),
        priority INTEGER,
        formula TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created inference_rules table');

    // Guilt Assignments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS guilt_assignments (
        id SERIAL PRIMARY KEY,
        configuration_id INTEGER NOT NULL REFERENCES configurations(id),
        agent_id INTEGER NOT NULL REFERENCES agents(id),
        guilt_type VARCHAR(50) NOT NULL,
        charge VARCHAR(255),
        evidence_chain JSONB,
        rule_applications JSONB,
        confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
        is_invariant BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created guilt_assignments table');

    // Possibility Spaces table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS possibility_spaces (
        id SERIAL PRIMARY KEY,
        case_name VARCHAR(255) NOT NULL,
        space_definition JSONB,
        total_configurations INTEGER,
        explored_configurations INTEGER DEFAULT 0,
        invariant_properties JSONB,
        contradictions JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created possibility_spaces table');

    // Deltas table (Nemesis measurement)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS deltas (
        id SERIAL PRIMARY KEY,
        configuration_id INTEGER NOT NULL REFERENCES configurations(id),
        delta_type VARCHAR(50) NOT NULL,
        actual_state JSONB,
        just_state JSONB,
        magnitude INTEGER CHECK (magnitude >= 0 AND magnitude <= 100),
        resolution TEXT,
        legal_remedy TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created deltas table');

    // Causation Chains table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS causation_chains (
        id SERIAL PRIMARY KEY,
        chain_name VARCHAR(255),
        cause_event_id INTEGER NOT NULL REFERENCES events(id),
        effect_event_id INTEGER NOT NULL REFERENCES events(id),
        cause_agent_id INTEGER REFERENCES agents(id),
        causation_type VARCHAR(50),
        strength INTEGER CHECK (strength >= 0 AND strength <= 100),
        intervening JSONB,
        counterfactual TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created causation_chains table');

    // Create indexes for performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_agents_type ON agents(agent_type);
      CREATE INDEX IF NOT EXISTS idx_agents_entity ON agents(entity_id);
      CREATE INDEX IF NOT EXISTS idx_arenas_type ON arenas(arena_type);
      CREATE INDEX IF NOT EXISTS idx_events_arena ON events(arena_id);
      CREATE INDEX IF NOT EXISTS idx_events_temporal ON events(temporal_position);
      CREATE INDEX IF NOT EXISTS idx_configs_actual ON configurations(is_actual);
      CREATE INDEX IF NOT EXISTS idx_configs_possible ON configurations(is_possible);
      CREATE INDEX IF NOT EXISTS idx_guilt_config ON guilt_assignments(configuration_id);
      CREATE INDEX IF NOT EXISTS idx_guilt_agent ON guilt_assignments(agent_id);
      CREATE INDEX IF NOT EXISTS idx_guilt_invariant ON guilt_assignments(is_invariant);
      CREATE INDEX IF NOT EXISTS idx_causation_cause ON causation_chains(cause_event_id);
      CREATE INDEX IF NOT EXISTS idx_causation_effect ON causation_chains(effect_event_id);
      CREATE INDEX IF NOT EXISTS idx_deltas_config ON deltas(configuration_id);
    `);
    console.log('✅ Created performance indexes');

    console.log('\n🎉 Lex Inference Engine schema created successfully!\n');
    console.log('📐 The system can now:');
    console.log('  ⚖️  Enumerate all possible agent-arena-event-horizon configurations');
    console.log('  🔗 Apply inference rules to derive guilt deterministically');
    console.log('  🎯 Identify invariant properties (guilt that holds across all possibilities)');
    console.log('  📊 Measure deltas between factual reality and legal justice');
    console.log('  🌐 Model counterfactual scenarios and causation chains');
    console.log('  ✨ Resolve the general case: if all information is known, guilt is deterministic\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating Lex Inference schema:', error);
    process.exit(1);
  }
}

createLexInferenceSchema();