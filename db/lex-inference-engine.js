#!/usr/bin/env node

const HypergraphManager = require('./hypergraph-manager');

/**
 * Legal Inference Engine (LEX)
 * Exhaustively enumerates agent-arena-event configurations to determine guilt
 * regardless of strategic actions taken by agents.
 * 
 * Based on modal logic where:
 * - Themis = Legislative rules that must hold across all possible worlds
 * - Nemesis = Delta measurement between actual and just outcomes
 * - Configuration Space = All possible hypergraph states
 */
class LexInferenceEngine {
  constructor() {
    this.hg = new HypergraphManager();
    this.rules = new Map(); // Themis: legislative rules
    this.deltas = new Map(); // Nemesis: deviation measurements
  }

  /**
   * Define a Themis rule - must hold in all possible worlds
   */
  defineRule(ruleName, condition, consequence) {
    this.rules.set(ruleName, {
      name: ruleName,
      condition: condition, // (config) => boolean
      consequence: consequence, // (config) => outcome
      modality: 'necessary' // Must hold in all possible worlds
    });
  }

  /**
   * Define a Nemesis delta - measures deviation from justice
   */
  defineDelta(deltaName, measurement) {
    this.deltas.set(deltaName, {
      name: deltaName,
      measurement: measurement, // (actual, ideal) => number
      threshold: 0 // Zero tolerance for injustice
    });
  }

  /**
   * Enumerate all possible configurations of agent-arena-event horizons
   * This creates the "possibility space" over which Themis weaves
   */
  async enumerateConfigurations(agents, arenas, events) {
    const configurations = [];
    
    // Generate power set of all possible agent-event combinations
    for (let agentSubset of this.powerSet(agents)) {
      for (let eventSubset of this.powerSet(events)) {
        for (let arena of arenas) {
          // Each configuration is a possible world
          const config = {
            agents: agentSubset,
            events: eventSubset,
            arena: arena,
            timestamp: Date.now(),
            id: this.generateConfigId(agentSubset, eventSubset, arena)
          };
          
          // Build hypergraph representation
          config.graph = await this.buildConfigGraph(config);
          
          configurations.push(config);
        }
      }
    }
    
    return configurations;
  }

  /**
   * Build hypergraph for a specific configuration
   */
  async buildConfigGraph(config) {
    const nodes = [];
    const edges = [];
    
    // Create nodes for agents
    for (let agent of config.agents) {
      const node = await this.hg.createNode(
        'agent',
        agent.name,
        agent.id,
        agent.role
      );
      nodes.push(node);
    }
    
    // Create nodes for events
    for (let event of config.events) {
      const node = await this.hg.createNode(
        'event',
        event.description,
        event.id,
        null,
        { timestamp: event.timestamp }
      );
      nodes.push(node);
    }
    
    // Create arena node
    const arenaNode = await this.hg.createNode(
      'arena',
      config.arena.context,
      config.arena.id
    );
    nodes.push(arenaNode);
    
    // Create edges representing causal relationships
    // This is where we capture the "fabric" of relationships
    for (let i = 0; i < config.events.length; i++) {
      for (let j = 0; j < config.agents.length; j++) {
        const edge = await this.hg.createEdge(
          'causation',
          `Agent ${config.agents[j].name} caused ${config.events[i].description}`,
          [
            { nodeId: nodes[j + config.agents.length].id, role: 'cause' },
            { nodeId: nodes[i].id, role: 'effect' }
          ],
          null,
          'directed',
          { config_id: config.id }
        );
        edges.push(edge);
      }
    }
    
    return { nodes, edges };
  }

  /**
   * Apply Themis rules to determine if configuration satisfies justice
   */
  applyThemisRules(config) {
    const results = [];
    
    for (let [ruleName, rule] of this.rules) {
      const satisfied = rule.condition(config);
      const outcome = satisfied ? rule.consequence(config) : null;
      
      results.push({
        rule: ruleName,
        satisfied: satisfied,
        outcome: outcome,
        config_id: config.id
      });
    }
    
    return results;
  }

  /**
   * Apply Nemesis delta measurement
   */
  applyNemesisDelta(actual, ideal) {
    const measurements = [];
    
    for (let [deltaName, delta] of this.deltas) {
      const deviation = delta.measurement(actual, ideal);
      const withinThreshold = Math.abs(deviation) <= delta.threshold;
      
      measurements.push({
        delta: deltaName,
        deviation: deviation,
        just: withinThreshold,
        actual: actual,
        ideal: ideal
      });
    }
    
    return measurements;
  }

  /**
   * Resolve guilt across all possible configurations
   * Returns the agent who is guilty in ALL possible worlds
   */
  async resolveGuilt(caseData) {
    console.log('🔍 Enumerating all possible configurations...\n');
    
    const configurations = await this.enumerateConfigurations(
      caseData.agents,
      caseData.arenas,
      caseData.events
    );
    
    console.log(`📊 Generated ${configurations.length} possible configurations\n`);
    
    // For each configuration, apply Themis rules
    const results = new Map(); // agent -> [configs where guilty]
    
    for (let config of configurations) {
      const ruleResults = this.applyThemisRules(config);
      
      // Check which agents are guilty in this configuration
      for (let result of ruleResults) {
        if (result.satisfied && result.outcome && result.outcome.guilty) {
          const agent = result.outcome.agent;
          if (!results.has(agent)) {
            results.set(agent, []);
          }
          results.get(agent).push(config.id);
        }
      }
    }
    
    // Find agent guilty in ALL configurations (modal necessity)
    const totalConfigs = configurations.length;
    const necessarilyGuilty = [];
    
    for (let [agent, guiltyConfigs] of results) {
      if (guiltyConfigs.length === totalConfigs) {
        necessarilyGuilty.push({
          agent: agent,
          guilt_modality: 'necessary',
          guilty_in: totalConfigs,
          total_configs: totalConfigs,
          percentage: 100
        });
      } else {
        necessarilyGuilty.push({
          agent: agent,
          guilt_modality: 'contingent',
          guilty_in: guiltyConfigs.length,
          total_configs: totalConfigs,
          percentage: (guiltyConfigs.length / totalConfigs * 100).toFixed(2)
        });
      }
    }
    
    return {
      total_configurations: totalConfigs,
      guilty_parties: necessarilyGuilty,
      configurations: configurations
    };
  }

  /**
   * Utility: Generate power set
   */
  powerSet(array) {
    const result = [[]];
    for (let element of array) {
      const length = result.length;
      for (let i = 0; i < length; i++) {
        result.push([...result[i], element]);
      }
    }
    return result;
  }

  /**
   * Utility: Generate configuration ID
   */
  generateConfigId(agents, events, arena) {
    const agentIds = agents.map(a => a.id).sort().join(',');
    const eventIds = events.map(e => e.id).sort().join(',');
    return `${arena.id}:${agentIds}:${eventIds}`;
  }
}

// ============================================================================
// CASE 2025-137857 SPECIFIC IMPLEMENTATION
// ============================================================================

async function analyzeFaucittCase() {
  const lex = new LexInferenceEngine();
  
  // Define Themis Rule: Fiduciary Duty
  lex.defineRule(
    'fiduciary_breach',
    (config) => {
      // Condition: Did agent with fiduciary duty act against beneficiary?
      return config.agents.some(a => a.role === 'trustee') &&
             config.events.some(e => e.type === 'acted_against_beneficiary');
    },
    (config) => {
      // Consequence: Agent is guilty
      const trustee = config.agents.find(a => a.role === 'trustee');
      return {
        guilty: true,
        agent: trustee.name,
        crime: 'breach_of_fiduciary_duty'
      };
    }
  );
  
  // Define Themis Rule: Perjury by Omission
  lex.defineRule(
    'perjury_material_nondisclosure',
    (config) => {
      // Condition: Did agent omit material fact in affidavit?
      return config.agents.some(a => a.role === 'affiant') &&
             config.events.some(e => e.type === 'material_fact_known') &&
             !config.events.some(e => e.type === 'fact_disclosed');
    },
    (config) => {
      const affiant = config.agents.find(a => a.role === 'affiant');
      return {
        guilty: true,
        agent: affiant.name,
        crime: 'perjury_by_omission'
      };
    }
  );
  
  // Define Nemesis Delta: Justice vs Reality
  lex.defineDelta(
    'justice_deviation',
    (actual, ideal) => {
      // Measure: How far is actual outcome from ideal justice?
      return actual.harm - ideal.harm; // Should be zero in just world
    }
  );
  
  // Define case data
  const caseData = {
    agents: [
      { id: 'peter', name: 'Peter Faucitt', role: 'applicant' },
      { id: 'bantjies', name: 'Daniel Bantjies', role: 'trustee' },
      { id: 'jax', name: 'Jacqueline Faucitt', role: 'respondent' },
      { id: 'daniel', name: 'Daniel Faucitt', role: 'beneficiary' }
    ],
    arenas: [
      { id: 'trust', context: 'Faucitt Family Trust' },
      { id: 'court', context: 'High Court Proceedings' }
    ],
    events: [
      { 
        id: 'fraud_report', 
        description: 'Daniel reports R10M fraud to trustee',
        type: 'fraud_allegation',
        timestamp: '2025-06-10'
      },
      { 
        id: 'trustee_dismissal', 
        description: 'Bantjies dismisses investigation',
        type: 'acted_against_beneficiary',
        timestamp: '2025-06-10'
      },
      { 
        id: 'affidavit_support', 
        description: 'Bantjies supports Peter against Daniel',
        type: 'material_fact_known',
        timestamp: '2025-08-13'
      },
      { 
        id: 'nondisclosure', 
        description: 'Bantjies omits fraud report from affidavit',
        type: 'fact_not_disclosed',
        timestamp: '2025-08-13'
      }
    ]
  };
  
  console.log('⚖️  LEX INFERENCE ENGINE - Case 2025-137857\n');
  console.log('═══════════════════════════════════════════════════\n');
  
  const resolution = await lex.resolveGuilt(caseData);
  
  console.log('\n📋 GUILT RESOLUTION ACROSS ALL POSSIBLE CONFIGURATIONS:\n');
  console.log(`Total configurations analyzed: ${resolution.total_configurations}\n`);
  
  for (let party of resolution.guilty_parties) {
    console.log(`\n${party.agent}:`);
    console.log(`  Modality: ${party.guilt_modality.toUpperCase()}`);
    console.log(`  Guilty in: ${party.guilty_in}/${party.total_configs} configurations (${party.percentage}%)`);
    
    if (party.guilt_modality === 'necessary') {
      console.log(`  ✅ NECESSARILY GUILTY (guilty in ALL possible worlds)`);
    } else {
      console.log(`  ⚠️  CONTINGENTLY GUILTY (guilty in some possible worlds)`);
    }
  }
  
  console.log('\n\n🎯 CONCLUSION:');
  console.log('═══════════════════════════════════════════════════');
  
  const necessarilyGuiltyParties = resolution.guilty_parties.filter(
    p => p.guilt_modality === 'necessary'
  );
  
  if (necessarilyGuiltyParties.length > 0) {
    console.log('\nThe following parties are NECESSARILY GUILTY:');
    console.log('(guilty regardless of any actions taken by any agent)');
    for (let party of necessarilyGuiltyParties) {
      console.log(`\n  • ${party.agent}`);
    }
    console.log('\nThis means: If all information is considered, these parties');
    console.log('are guilty in every conceivable configuration of events.');
  } else {
    console.log('\nNo party is necessarily guilty across all configurations.');
    console.log('Guilt is contingent on specific event configurations.');
  }
}

// Export for use
module.exports = LexInferenceEngine;

// CLI Interface
if (require.main === module) {
  analyzeFaucittCase().catch(console.error);
}
