#!/usr/bin/env node

const { db } = require('./config');
const { sql } = require('drizzle-orm');

/**
 * Comprehensive Lex Inference Engine
 * Database-backed version with full enumeration and resolution
 * 
 * Implements the principle:
 * "If all information is considered, the guilty party is always guilty,
 *  invariant across all possible agent-arena-event-horizon configurations."
 */
class LexComprehensiveEngine {
  
  // ===== CORE ENUMERATION =====
  
  /**
   * Create the complete possibility space for a case
   */
  async createPossibilitySpace(caseName) {
    console.log(`\n🌐 Creating possibility space for ${caseName}...\n`);
    
    // Get all dimensions
    const agentsResult = await db.execute(sql`SELECT id FROM agents`);
    const arenasResult = await db.execute(sql`SELECT id FROM arenas`);
    const eventsResult = await db.execute(sql`SELECT id FROM events`);
    const horizonsResult = await db.execute(sql`SELECT id FROM event_horizons`);
    
    const agents = agentsResult.rows.map(r => r.id);
    const arenas = arenasResult.rows.map(r => r.id);
    const events = eventsResult.rows.map(r => r.id);
    const horizons = horizonsResult.rows.map(r => r.id);
    
    const totalConfigs = agents.length * arenas.length * events.length * horizons.length;
    
    const spaceResult = await db.execute(sql`
      INSERT INTO possibility_spaces (case_name, space_definition, total_configurations)
      VALUES (
        ${caseName},
        ${JSON.stringify({ agents, arenas, events, horizons })},
        ${totalConfigs}
      )
      RETURNING *
    `);
    
    console.log(`  📊 Total configurations: ${totalConfigs}`);
    console.log(`  📐 Dimensions: ${agents.length} agents × ${arenas.length} arenas × ${events.length} events × ${horizons.length} horizons\n`);
    
    return spaceResult.rows[0];
  }
  
  /**
   * Enumerate all configurations in the possibility space
   */
  async enumerateAllConfigurations(spaceId) {
    const spaceResult = await db.execute(sql`
      SELECT * FROM possibility_spaces WHERE id = ${spaceId}
    `);
    const space = spaceResult.rows[0];
    const def = space.space_definition;
    
    console.log(`🔄 Enumerating configurations...`);
    
    const configs = [];
    let count = 0;
    
    // Cartesian product: A × AR × E × H
    for (const agentId of def.agents) {
      for (const arenaId of def.arenas) {
        for (const eventId of def.events) {
          for (const horizonId of def.horizons) {
            const configResult = await db.execute(sql`
              INSERT INTO configurations (
                configuration_name,
                agent_ids, arena_ids, event_ids, horizon_ids,
                is_possible, is_actual,
                world_state
              )
              VALUES (
                ${`Config-${count}`},
                ${JSON.stringify([agentId])},
                ${JSON.stringify([arenaId])},
                ${JSON.stringify([eventId])},
                ${JSON.stringify([horizonId])},
                true,
                false,
                ${JSON.stringify({ space_id: spaceId, config_num: count })}
              )
              RETURNING *
            `);
            
            configs.push(configResult.rows[0]);
            count++;
            
            if (count % 10 === 0) {
              process.stdout.write(`\r  Generated: ${count}/${space.total_configurations}`);
            }
          }
        }
      }
    }
    
    console.log(`\r  ✅ Generated: ${count} configurations\n`);
    
    // Update space
    await db.execute(sql`
      UPDATE possibility_spaces 
      SET explored_configurations = ${count}
      WHERE id = ${spaceId}
    `);
    
    return configs;
  }
  
  /**
   * Apply all inference rules to all configurations
   */
  async applyInferenceRulesToAll(spaceId) {
    console.log(`\n⚖️  Applying inference rules across all configurations...\n`);
    
    // Get all configurations for this space
    const configsResult = await db.execute(sql`
      SELECT * FROM configurations 
      WHERE world_state->>'space_id' = ${spaceId.toString()}
    `);
    
    // Get all inference rules
    const rulesResult = await db.execute(sql`
      SELECT * FROM inference_rules ORDER BY priority DESC, strength DESC
    `);
    
    const configs = configsResult.rows;
    const rules = rulesResult.rows;
    
    console.log(`  📋 Configurations: ${configs.length}`);
    console.log(`  📜 Inference rules: ${rules.length}\n`);
    
    let assignmentCount = 0;
    
    for (const config of configs) {
      for (const rule of rules) {
        // Evaluate if rule applies to this configuration
        const applies = await this.evaluateRuleConditions(rule, config);
        
        if (applies) {
          // Extract agent from configuration
          const agentId = config.agent_ids[0];
          
          // Create guilt assignment
          await db.execute(sql`
            INSERT INTO guilt_assignments (
              configuration_id, agent_id,
              guilt_type, charge,
              evidence_chain, rule_applications,
              confidence
            )
            VALUES (
              ${config.id},
              ${agentId},
              ${rule.conclusion.guilt_type || 'culpable'},
              ${rule.conclusion.charge || 'violation'},
              ${JSON.stringify(rule.conclusion.evidence_chain || [])},
              ${JSON.stringify([{ rule_id: rule.id, rule_name: rule.rule_name }])},
              ${rule.strength}
            )
          `);
          
          assignmentCount++;
        }
      }
    }
    
    console.log(`  ✅ Created ${assignmentCount} guilt assignments\n`);
    return assignmentCount;
  }
  
  /**
   * Evaluate if rule conditions match configuration
   */
  async evaluateRuleConditions(rule, config) {
    // Get configuration details
    const agentId = config.agent_ids[0];
    const eventId = config.event_ids[0];
    const arenaId = config.arena_ids[0];
    
    // Get agent details
    const agentResult = await db.execute(sql`
      SELECT * FROM agents WHERE id = ${agentId}
    `);
    const agent = agentResult.rows[0];
    
    // Get event details
    const eventResult = await db.execute(sql`
      SELECT * FROM events WHERE id = ${eventId}
    `);
    const event = eventResult.rows[0];
    
    // Simple evaluation based on rule conditions
    const conditions = rule.conditions || {};
    
    // Check agent type
    if (conditions.agent_type && agent.agent_type !== conditions.agent_type) {
      return false;
    }
    
    // Check event type
    if (conditions.event_type && event.event_type !== conditions.event_type) {
      return false;
    }
    
    // Check legal status
    if (conditions.legal_status && agent.legal_status !== conditions.legal_status) {
      return false;
    }
    
    // If all conditions pass, rule applies
    return true;
  }
  
  /**
   * Find invariant guilt (holds in ALL configurations)
   */
  async findInvariantGuilt(spaceId) {
    console.log(`\n🎯 Analyzing invariant guilt...\n`);
    
    const result = await db.execute(sql`
      WITH config_count AS (
        SELECT COUNT(*) as total
        FROM configurations
        WHERE world_state->>'space_id' = ${spaceId.toString()}
      ),
      guilt_frequency AS (
        SELECT 
          ga.agent_id,
          a.name as agent_name,
          ga.guilt_type,
          ga.charge,
          COUNT(DISTINCT ga.configuration_id) as guilty_count,
          AVG(ga.confidence) as avg_confidence
        FROM guilt_assignments ga
        JOIN agents a ON ga.agent_id = a.id
        JOIN configurations c ON ga.configuration_id = c.id
        WHERE c.world_state->>'space_id' = ${spaceId.toString()}
        GROUP BY ga.agent_id, a.name, ga.guilt_type, ga.charge
      )
      SELECT 
        gf.*,
        cc.total as total_configs,
        (gf.guilty_count = cc.total) as is_invariant,
        (gf.guilty_count::float / cc.total * 100) as guilt_percentage
      FROM guilt_frequency gf, config_count cc
      ORDER BY gf.guilty_count DESC
    `);
    
    const invariants = result.rows.filter(r => r.is_invariant);
    
    console.log(`  📊 Analysis Results:`);
    console.log(`  ─────────────────────────────────────\n`);
    
    for (const row of result.rows) {
      console.log(`  ${row.agent_name}:`);
      console.log(`    Charge: ${row.charge}`);
      console.log(`    Guilty in: ${row.guilty_count}/${row.total_configs} configurations (${parseFloat(row.guilt_percentage).toFixed(1)}%)`);
      console.log(`    Invariant: ${row.is_invariant ? '✅ YES (NECESSARILY GUILTY)' : '❌ No (contingent)'}`);
      console.log(`    Confidence: ${parseFloat(row.avg_confidence).toFixed(0)}%\n`);
    }
    
    // Mark invariants in database
    if (invariants.length > 0) {
      for (const inv of invariants) {
        await db.execute(sql`
          UPDATE guilt_assignments
          SET is_invariant = true
          WHERE agent_id = ${inv.agent_id}
          AND guilt_type = ${inv.guilt_type}
          AND charge = ${inv.charge}
        `);
      }
      console.log(`  ✅ Marked ${invariants.length} invariant guilt assignments\n`);
    }
    
    return { all: result.rows, invariants };
  }
  
  /**
   * Measure deltas between actual and just states
   */
  async measureDeltas(spaceId) {
    console.log(`\n📏 Measuring Nemesis deltas (reality vs justice)...\n`);
    
    // Find the actual configuration (if marked)
    const actualResult = await db.execute(sql`
      SELECT * FROM configurations 
      WHERE world_state->>'space_id' = ${spaceId.toString()}
      AND is_actual = true
      LIMIT 1
    `);
    
    if (actualResult.rows.length === 0) {
      console.log(`  ⚠️  No actual configuration marked. Skipping delta measurement.\n`);
      return [];
    }
    
    const actualConfig = actualResult.rows[0];
    
    // Get guilt in actual world
    const actualGuiltResult = await db.execute(sql`
      SELECT * FROM guilt_assignments WHERE configuration_id = ${actualConfig.id}
    `);
    
    // Get invariant guilt (what SHOULD be in just world)
    const justGuiltResult = await db.execute(sql`
      SELECT * FROM guilt_assignments WHERE is_invariant = true LIMIT 1
    `);
    
    const deltas = [];
    
    if (actualGuiltResult.rows.length > 0 && justGuiltResult.rows.length > 0) {
      const actual = actualGuiltResult.rows[0];
      const just = justGuiltResult.rows[0];
      
      const magnitude = actual.agent_id === just.agent_id ? 0 : 100;
      
      const deltaResult = await db.execute(sql`
        INSERT INTO deltas (
          configuration_id,
          delta_type,
          actual_state,
          just_state,
          magnitude,
          resolution,
          legal_remedy
        )
        VALUES (
          ${actualConfig.id},
          'guilt_attribution',
          ${JSON.stringify({ agent_id: actual.agent_id, charge: actual.charge })},
          ${JSON.stringify({ agent_id: just.agent_id, charge: just.charge })},
          ${magnitude},
          ${magnitude === 0 ? 'Justice achieved' : 'Reassign guilt to correct party'},
          ${magnitude === 0 ? 'None needed' : 'Court must correct guilt attribution'}
        )
        RETURNING *
      `);
      
      deltas.push(deltaResult.rows[0]);
      
      console.log(`  Delta: ${magnitude === 0 ? 'ZERO (justice aligned)' : magnitude + '% deviation'}`);
      console.log(`  Resolution: ${deltaResult.rows[0].resolution}\n`);
    }
    
    return deltas;
  }
  
  /**
   * Get comprehensive statistics
   */
  async getStats() {
    const agents = await db.execute(sql`SELECT COUNT(*) as c FROM agents`);
    const arenas = await db.execute(sql`SELECT COUNT(*) as c FROM arenas`);
    const events = await db.execute(sql`SELECT COUNT(*) as c FROM events`);
    const horizons = await db.execute(sql`SELECT COUNT(*) as c FROM event_horizons`);
    const configs = await db.execute(sql`SELECT COUNT(*) as c FROM configurations`);
    const rules = await db.execute(sql`SELECT COUNT(*) as c FROM inference_rules`);
    const guilt = await db.execute(sql`SELECT COUNT(*) as c FROM guilt_assignments`);
    const invariant = await db.execute(sql`SELECT COUNT(*) as c FROM guilt_assignments WHERE is_invariant = true`);
    const deltas = await db.execute(sql`SELECT COUNT(*) as c FROM deltas`);
    
    return {
      agents: parseInt(agents.rows[0].c),
      arenas: parseInt(arenas.rows[0].c),
      events: parseInt(events.rows[0].c),
      horizons: parseInt(horizons.rows[0].c),
      configurations: parseInt(configs.rows[0].c),
      inference_rules: parseInt(rules.rows[0].c),
      guilt_assignments: parseInt(guilt.rows[0].c),
      invariant_guilt: parseInt(invariant.rows[0].c),
      deltas: parseInt(deltas.rows[0].c)
    };
  }
}

module.exports = LexComprehensiveEngine;