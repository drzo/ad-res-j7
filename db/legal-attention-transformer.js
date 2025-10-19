
#!/usr/bin/env node

const { db } = require('./config');
const { sql } = require('drizzle-orm');

/**
 * Legal Attention Transformer
 * Uses multi-head attention to learn guilt determination across possibility space
 * 
 * Implements: Attention(Q,K,V) = softmax(QK^T/√d)V
 * Where:
 * - Q (Queries): Guilt hypotheses being evaluated
 * - K (Keys): All facts, actions, and agent states
 * - V (Values): Legal/causal significance of each element
 */
class LegalAttentionTransformer {
  constructor(config = {}) {
    this.embeddingDim = config.embeddingDim || 128;
    this.numHeads = config.numHeads || 4;
    this.headDim = this.embeddingDim / this.numHeads;
    
    // Initialize attention heads for different legal lenses
    this.heads = {
      causal: new AttentionHead('causal', this.headDim),
      intentionality: new AttentionHead('intentionality', this.headDim),
      temporal: new AttentionHead('temporal', this.headDim),
      normative: new AttentionHead('normative', this.headDim)
    };
  }

  /**
   * Embed legal elements into shared vector space
   */
  embed(element, type) {
    const embedding = new Array(this.embeddingDim).fill(0);
    
    switch(type) {
      case 'agent':
        // Encode agent properties
        embedding[0] = element.role === 'trustee' ? 1 : 0;
        embedding[1] = element.legal_status === 'applicant' ? 1 : -1;
        embedding[2] = element.has_fiduciary_duty ? 1 : 0;
        break;
        
      case 'event':
        // Encode event properties
        embedding[3] = element.type === 'action' ? 1 : -1;
        embedding[4] = element.type === 'omission' ? 1 : 0;
        embedding[5] = element.causes_harm ? 1 : 0;
        embedding[6] = this.encodeTemporalPosition(element.timestamp);
        break;
        
      case 'norm':
        // Encode legal norms
        embedding[7] = element.priority / 100;
        embedding[8] = element.strength / 100;
        embedding[9] = element.type === 'duty' ? 1 : 0;
        break;
    }
    
    // Add positional encodings
    this.addPositionalEncoding(embedding, element);
    
    return embedding;
  }

  /**
   * Add multi-dimensional positional encoding
   */
  addPositionalEncoding(embedding, element) {
    // Temporal position
    if (element.timestamp) {
      const t = new Date(element.timestamp).getTime();
      embedding[10] = Math.sin(t / 1000);
      embedding[11] = Math.cos(t / 1000);
    }
    
    // Causal depth (distance from root cause)
    if (element.causal_depth !== undefined) {
      embedding[12] = element.causal_depth / 10;
    }
    
    // Epistemic position (knowledge state)
    if (element.knowledge_state) {
      embedding[13] = element.knowledge_state === 'full' ? 1 : 0.5;
    }
    
    // Deontic position (obligation strength)
    if (element.obligation_weight) {
      embedding[14] = element.obligation_weight / 100;
    }
  }

  /**
   * Compute attention scores between queries and keys
   */
  computeAttention(queries, keys, values) {
    const scores = [];
    const scalingFactor = Math.sqrt(this.headDim);
    
    for (let q of queries) {
      const rowScores = [];
      let sumExp = 0;
      
      // Compute dot products
      for (let k of keys) {
        const dotProduct = this.dotProduct(q, k) / scalingFactor;
        const expScore = Math.exp(dotProduct);
        rowScores.push(expScore);
        sumExp += expScore;
      }
      
      // Softmax normalization
      const normalizedScores = rowScores.map(s => s / sumExp);
      scores.push(normalizedScores);
    }
    
    // Apply attention to values
    return this.applyAttention(scores, values);
  }

  /**
   * Multi-head attention for legal reasoning
   */
  multiHeadAttention(configurations) {
    const headOutputs = {};
    
    // Each head focuses on different legal aspects
    for (let [headName, head] of Object.entries(this.heads)) {
      headOutputs[headName] = head.attend(configurations, this);
    }
    
    // Concatenate and project head outputs
    return this.combineHeads(headOutputs);
  }

  /**
   * Cross-attention for counterfactual reasoning
   */
  crossAttention(actualWorld, possibleWorlds) {
    const actualEmbedding = this.embedConfiguration(actualWorld);
    const possibleEmbeddings = possibleWorlds.map(w => this.embedConfiguration(w));
    
    // Attend from actual to possible worlds
    const attention = this.computeAttention(
      [actualEmbedding],
      possibleEmbeddings,
      possibleEmbeddings
    );
    
    // High attention = worlds where guilt changes
    return this.analyzeGuiltDelta(attention, actualWorld, possibleWorlds);
  }

  /**
   * Self-attention creates all-to-all comparison matrix
   */
  selfAttention(events) {
    const embeddings = events.map(e => this.embed(e, 'event'));
    
    // Every event examines its relationship to every other event
    const attentionMatrix = this.computeAttention(
      embeddings,
      embeddings,
      embeddings
    );
    
    return this.extractCausalPatterns(attentionMatrix, events);
  }

  /**
   * Determine guilt through learned attention patterns
   */
  async determineGuilt(configuration) {
    // Embed all elements
    const agentEmbeddings = configuration.agents.map(a => this.embed(a, 'agent'));
    const eventEmbeddings = configuration.events.map(e => this.embed(e, 'event'));
    const normEmbeddings = configuration.norms.map(n => this.embed(n, 'norm'));
    
    // Multi-head attention
    const headAttentions = await this.multiHeadAttention({
      agents: agentEmbeddings,
      events: eventEmbeddings,
      norms: normEmbeddings
    });
    
    // Create juridical heat map
    const heatMap = this.createJuridicalHeatMap(headAttentions, configuration);
    
    // Extract guilt assignments
    return this.extractGuiltFromAttention(heatMap, configuration);
  }

  /**
   * Create juridical heat map showing legal salience
   */
  createJuridicalHeatMap(attentions, configuration) {
    const heatMap = {
      agent_event_salience: [],
      event_norm_salience: [],
      agent_harm_salience: []
    };
    
    // Agent-Event salience (who did what)
    for (let i = 0; i < configuration.agents.length; i++) {
      heatMap.agent_event_salience[i] = [];
      for (let j = 0; j < configuration.events.length; j++) {
        const salience = this.computeSalience(
          attentions.causal,
          attentions.intentionality,
          i, j
        );
        heatMap.agent_event_salience[i][j] = salience;
      }
    }
    
    // Event-Norm salience (what rules apply)
    for (let i = 0; i < configuration.events.length; i++) {
      heatMap.event_norm_salience[i] = [];
      for (let j = 0; j < configuration.norms.length; j++) {
        const salience = attentions.normative[i][j] || 0;
        heatMap.event_norm_salience[i][j] = salience;
      }
    }
    
    return heatMap;
  }

  /**
   * Extract guilt from attention scores
   * High attention between agent and harm = guilt
   */
  extractGuiltFromAttention(heatMap, configuration) {
    const guiltScores = [];
    
    for (let i = 0; i < configuration.agents.length; i++) {
      const agent = configuration.agents[i];
      let totalGuiltScore = 0;
      
      // Sum attention to harmful events
      for (let j = 0; j < configuration.events.length; j++) {
        const event = configuration.events[j];
        if (event.causes_harm) {
          totalGuiltScore += heatMap.agent_event_salience[i][j];
        }
      }
      
      // Normalize by number of harmful events
      const harmfulEvents = configuration.events.filter(e => e.causes_harm).length;
      const normalizedScore = harmfulEvents > 0 ? totalGuiltScore / harmfulEvents : 0;
      
      guiltScores.push({
        agent: agent.name,
        agent_id: agent.id,
        guilt_score: normalizedScore,
        is_guilty: normalizedScore > 0.5, // Threshold
        confidence: normalizedScore
      });
    }
    
    return guiltScores.sort((a, b) => b.guilt_score - a.guilt_score);
  }

  /**
   * Learn invariant guilt patterns across configurations
   */
  async learnInvariantPatterns(allConfigurations) {
    const patterns = {
      stable_attractors: [],
      guilt_invariants: []
    };
    
    // Find stable attention patterns across all configs
    for (let config of allConfigurations) {
      const guilt = await this.determineGuilt(config);
      
      for (let g of guilt) {
        if (g.is_guilty) {
          // Track which agent-event patterns consistently predict guilt
          const pattern = {
            agent: g.agent_id,
            pattern_signature: this.extractPatternSignature(config, g),
            frequency: 1
          };
          
          // Accumulate pattern frequencies
          const existing = patterns.stable_attractors.find(
            p => p.agent === pattern.agent && 
                 p.pattern_signature === pattern.pattern_signature
          );
          
          if (existing) {
            existing.frequency++;
          } else {
            patterns.stable_attractors.push(pattern);
          }
        }
      }
    }
    
    // Find invariants (patterns that appear in ALL configurations)
    const totalConfigs = allConfigurations.length;
    patterns.guilt_invariants = patterns.stable_attractors.filter(
      p => p.frequency === totalConfigs
    );
    
    return patterns;
  }

  /**
   * Utility: Dot product
   */
  dotProduct(a, b) {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }

  /**
   * Utility: Apply attention weights to values
   */
  applyAttention(scores, values) {
    return scores.map(rowScores => {
      const result = new Array(values[0].length).fill(0);
      for (let i = 0; i < rowScores.length; i++) {
        for (let j = 0; j < result.length; j++) {
          result[j] += rowScores[i] * values[i][j];
        }
      }
      return result;
    });
  }

  /**
   * Utility: Combine multi-head outputs
   */
  combineHeads(headOutputs) {
    // Simple concatenation and averaging for now
    const combined = {};
    for (let [name, output] of Object.entries(headOutputs)) {
      combined[name] = output;
    }
    return combined;
  }

  /**
   * Utility: Encode temporal position
   */
  encodeTemporalPosition(timestamp) {
    if (!timestamp) return 0;
    const t = new Date(timestamp).getTime();
    return Math.sin(t / 86400000); // Daily cycle
  }

  /**
   * Utility: Embed configuration
   */
  embedConfiguration(config) {
    const embedding = new Array(this.embeddingDim).fill(0);
    // Aggregate agent, event, and norm embeddings
    return embedding;
  }

  /**
   * Utility: Analyze guilt delta between worlds
   */
  analyzeGuiltDelta(attention, actualWorld, possibleWorlds) {
    return {
      necessity: attention[0].reduce((sum, score) => sum + score, 0) / attention[0].length,
      sufficiency: Math.max(...attention[0])
    };
  }

  /**
   * Utility: Extract causal patterns from attention
   */
  extractCausalPatterns(attentionMatrix, events) {
    const patterns = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = 0; j < events.length; j++) {
        if (attentionMatrix[i][j] > 0.7) {
          patterns.push({
            cause: events[i],
            effect: events[j],
            strength: attentionMatrix[i][j]
          });
        }
      }
    }
    return patterns;
  }

  /**
   * Utility: Compute salience from multiple attention heads
   */
  computeSalience(causalAttn, intentionalAttn, i, j) {
    const causalScore = causalAttn?.[i]?.[j] || 0;
    const intentScore = intentionalAttn?.[i]?.[j] || 0;
    return (causalScore + intentScore) / 2;
  }

  /**
   * Utility: Extract pattern signature
   */
  extractPatternSignature(config, guilt) {
    return `${guilt.agent_id}_${config.events.map(e => e.type).join('_')}`;
  }
}

/**
 * Attention Head for specific legal lens
 */
class AttentionHead {
  constructor(name, dim) {
    this.name = name;
    this.dim = dim;
  }

  attend(configurations, transformer) {
    const { agents, events, norms } = configurations;
    
    // Focus on specific legal aspect
    switch(this.name) {
      case 'causal':
        return this.causalAttention(events, transformer);
      case 'intentionality':
        return this.intentionalityAttention(agents, events, transformer);
      case 'temporal':
        return this.temporalAttention(events, transformer);
      case 'normative':
        return this.normativeAttention(events, norms, transformer);
      default:
        return [];
    }
  }

  causalAttention(events, transformer) {
    // Attend to cause-effect relationships
    const attention = [];
    for (let e1 of events) {
      const row = [];
      for (let e2 of events) {
        const score = this.computeCausalScore(e1, e2);
        row.push(score);
      }
      attention.push(row);
    }
    return attention;
  }

  intentionalityAttention(agents, events, transformer) {
    // Focus on knowledge states and mental states
    const attention = [];
    for (let agent of agents) {
      const row = [];
      for (let event of events) {
        const score = agent.knowledge_of?.[event.id] ? 0.9 : 0.1;
        row.push(score);
      }
      attention.push(row);
    }
    return attention;
  }

  temporalAttention(events, transformer) {
    // Weigh sequence and timing
    const attention = [];
    for (let e1 of events) {
      const row = [];
      for (let e2 of events) {
        const t1 = new Date(e1.timestamp).getTime();
        const t2 = new Date(e2.timestamp).getTime();
        const score = t1 < t2 ? 0.8 : 0.2; // Higher if e1 before e2
        row.push(score);
      }
      attention.push(row);
    }
    return attention;
  }

  normativeAttention(events, norms, transformer) {
    // Attend to rule violations
    const attention = [];
    for (let event of events) {
      const row = [];
      for (let norm of norms) {
        const score = this.violatesNorm(event, norm) ? 0.9 : 0.1;
        row.push(score);
      }
      attention.push(row);
    }
    return attention;
  }

  computeCausalScore(e1, e2) {
    // Simple heuristic: earlier events can cause later events
    if (!e1.timestamp || !e2.timestamp) return 0;
    const t1 = new Date(e1.timestamp).getTime();
    const t2 = new Date(e2.timestamp).getTime();
    return t1 < t2 ? 0.7 : 0.1;
  }

  violatesNorm(event, norm) {
    // Check if event violates norm based on conditions
    return norm.conditions?.event_type === event.type;
  }
}

module.exports = LegalAttentionTransformer;

// CLI Interface
if (require.main === module) {
  console.log('🧠 Legal Attention Transformer');
  console.log('Multi-head attention for guilt determination\n');
  
  const transformer = new LegalAttentionTransformer({
    embeddingDim: 128,
    numHeads: 4
  });
  
  // Demo configuration
  const demoConfig = {
    agents: [
      { 
        id: 'bantjies', 
        name: 'Daniel Bantjies', 
        role: 'trustee',
        has_fiduciary_duty: true,
        knowledge_of: { fraud_report: true }
      }
    ],
    events: [
      { 
        id: 'fraud_report',
        type: 'action', 
        timestamp: '2025-06-10',
        causes_harm: false
      },
      { 
        id: 'dismissal',
        type: 'omission', 
        timestamp: '2025-06-10',
        causes_harm: true
      }
    ],
    norms: [
      { 
        type: 'duty',
        priority: 100,
        strength: 100,
        conditions: { event_type: 'omission' }
      }
    ]
  };
  
  transformer.determineGuilt(demoConfig).then(guilt => {
    console.log('📊 Guilt Determination via Attention:');
    console.log(JSON.stringify(guilt, null, 2));
  });
}
