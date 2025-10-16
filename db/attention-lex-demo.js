
#!/usr/bin/env node

const LegalAttentionTransformer = require('./legal-attention-transformer');
const LexComprehensiveEngine = require('./lex-comprehensive-engine');

/**
 * Demo: Integrating Attention Mechanism with LEX Inference Engine
 * Shows how attention learns guilt determination across possibility space
 */
async function demonstrateAttentionLex() {
  console.log('🧠 LEGAL ATTENTION TRANSFORMER + LEX INFERENCE ENGINE');
  console.log('═══════════════════════════════════════════════════════\n');
  
  const transformer = new LegalAttentionTransformer({
    embeddingDim: 128,
    numHeads: 4
  });
  
  const lex = new LexComprehensiveEngine();
  
  // Case 2025-137857 configuration
  const configurations = [
    {
      id: 'config_1',
      agents: [
        { 
          id: 'bantjies', 
          name: 'Daniel Bantjies',
          role: 'trustee',
          legal_status: 'trustee',
          has_fiduciary_duty: true,
          knowledge_of: { fraud_report: true, dismissal: true }
        }
      ],
      events: [
        { 
          id: 'fraud_report',
          type: 'action',
          description: 'Daniel reports R10M fraud to trustee',
          timestamp: '2025-06-10',
          causes_harm: false,
          causal_depth: 0
        },
        { 
          id: 'dismissal',
          type: 'omission',
          description: 'Bantjies dismisses investigation',
          timestamp: '2025-06-10',
          causes_harm: true,
          causal_depth: 1
        },
        {
          id: 'affidavit',
          type: 'action',
          description: 'Bantjies supports Peter in affidavit',
          timestamp: '2025-08-13',
          causes_harm: true,
          causal_depth: 2
        }
      ],
      norms: [
        { 
          id: 'fiduciary_duty',
          type: 'duty',
          priority: 100,
          strength: 100,
          conditions: { 
            agent_type: 'person',
            legal_status: 'trustee',
            event_type: 'omission' 
          },
          obligation_weight: 100
        },
        {
          id: 'material_disclosure',
          type: 'negligence',
          priority: 95,
          strength: 95,
          conditions: {
            event_type: 'action'
          },
          obligation_weight: 95
        }
      ]
    }
  ];
  
  console.log('📋 Configuration: Case 2025-137857');
  console.log('   Agents: 1 (Daniel Bantjies - Trustee)');
  console.log('   Events: 3 (Fraud report, Dismissal, Affidavit)');
  console.log('   Norms: 2 (Fiduciary duty, Material disclosure)\n');
  
  // Step 1: Determine guilt via attention
  console.log('🔍 Step 1: Multi-Head Attention Analysis\n');
  
  for (let config of configurations) {
    const guilt = await transformer.determineGuilt(config);
    
    console.log(`📊 Configuration ${config.id}:`);
    for (let g of guilt) {
      console.log(`   ${g.agent}:`);
      console.log(`      Guilt Score: ${g.guilt_score.toFixed(3)}`);
      console.log(`      Is Guilty: ${g.is_guilty ? '✅' : '❌'}`);
      console.log(`      Confidence: ${(g.confidence * 100).toFixed(1)}%`);
    }
    console.log();
  }
  
  // Step 2: Self-attention for causal patterns
  console.log('🔍 Step 2: Self-Attention Causal Analysis\n');
  
  const causalPatterns = transformer.selfAttention(configurations[0].events);
  console.log('   Discovered Causal Patterns:');
  for (let pattern of causalPatterns) {
    console.log(`      ${pattern.cause.description}`);
    console.log(`         → ${pattern.effect.description}`);
    console.log(`         Strength: ${(pattern.strength * 100).toFixed(1)}%\n`);
  }
  
  // Step 3: Cross-attention for counterfactuals
  console.log('🔍 Step 3: Cross-Attention Counterfactual Analysis\n');
  
  const actualWorld = configurations[0];
  const counterfactualWorld = {
    ...configurations[0],
    events: configurations[0].events.filter(e => e.id !== 'dismissal')
  };
  
  const delta = transformer.crossAttention(actualWorld, [counterfactualWorld]);
  console.log('   Counterfactual: "What if Bantjies investigated?"');
  console.log(`      Necessity Score: ${(delta.necessity * 100).toFixed(1)}%`);
  console.log(`      Sufficiency Score: ${(delta.sufficiency * 100).toFixed(1)}%`);
  console.log();
  
  // Step 4: Learn invariant patterns
  console.log('🔍 Step 4: Learning Invariant Guilt Patterns\n');
  
  // Create multiple configurations to find invariants
  const multipleConfigs = [
    configurations[0],
    { ...configurations[0], id: 'config_2' },
    { ...configurations[0], id: 'config_3' }
  ];
  
  const patterns = await transformer.learnInvariantPatterns(multipleConfigs);
  
  console.log('   Stable Attractors (High-frequency patterns):');
  for (let pattern of patterns.stable_attractors.slice(0, 3)) {
    console.log(`      Agent: ${pattern.agent}`);
    console.log(`      Pattern: ${pattern.pattern_signature}`);
    console.log(`      Frequency: ${pattern.frequency}/${multipleConfigs.length}`);
    console.log();
  }
  
  console.log('   Guilt Invariants (Present in ALL configurations):');
  if (patterns.guilt_invariants.length > 0) {
    for (let invariant of patterns.guilt_invariants) {
      console.log(`      ✅ ${invariant.agent} - ${invariant.pattern_signature}`);
    }
  } else {
    console.log('      (No invariants found - need more diverse configurations)');
  }
  console.log();
  
  // Summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('📈 ATTENTION MECHANISM INSIGHTS:\n');
  console.log('   1. Multi-head attention identifies guilt through learned');
  console.log('      relational patterns, not explicit rules\n');
  console.log('   2. Self-attention discovers causal chains automatically\n');
  console.log('   3. Cross-attention measures counterfactual necessity\n');
  console.log('   4. Invariant patterns emerge as stable attractors\n');
  console.log('   5. The attention weights ARE the juridical heat map -');
  console.log('      showing which facts matter for which conclusions\n');
  console.log('═══════════════════════════════════════════════════════');
}

// Run demo
if (require.main === module) {
  demonstrateAttentionLex().catch(console.error);
}

module.exports = { demonstrateAttentionLex };
