#!/usr/bin/env node

const { db } = require('./config');
const { sql } = require('drizzle-orm');

/**
 * Hypergraph Manager for Case 2025-137857
 * Manages complex multi-way relationships between entities
 */
class HypergraphManager {
  
  // ===== NODE OPERATIONS =====
  
  /**
   * Create a node in the hypergraph
   */
  async createNode(nodeType, label, entityId = null, description = null, metadata = {}) {
    try {
      const result = await db.execute(sql`
        INSERT INTO hypergraph_nodes (node_type, entity_id, label, description, metadata)
        VALUES (${nodeType}, ${entityId}, ${label}, ${description}, ${JSON.stringify(metadata)})
        RETURNING *
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating node:', error);
      throw error;
    }
  }

  /**
   * Get node by ID
   */
  async getNode(nodeId) {
    const result = await db.execute(sql`
      SELECT * FROM hypergraph_nodes WHERE id = ${nodeId}
    `);
    return result.rows[0];
  }

  /**
   * Find nodes by type
   */
  async findNodesByType(nodeType) {
    const result = await db.execute(sql`
      SELECT * FROM hypergraph_nodes WHERE node_type = ${nodeType}
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  /**
   * Find node by entity reference
   */
  async findNodeByEntity(entityId) {
    const result = await db.execute(sql`
      SELECT * FROM hypergraph_nodes WHERE entity_id = ${entityId}
    `);
    return result.rows[0];
  }

  // ===== EDGE OPERATIONS =====

  /**
   * Create a hyperedge connecting multiple nodes
   */
  async createEdge(edgeType, label, nodes, strength = null, direction = 'undirected', metadata = {}) {
    try {
      // Create the edge
      const edgeResult = await db.execute(sql`
        INSERT INTO hypergraph_edges (edge_type, label, strength, direction, metadata)
        VALUES (${edgeType}, ${label}, ${strength}, ${direction}, ${JSON.stringify(metadata)})
        RETURNING *
      `);
      const edge = edgeResult.rows[0];

      // Create relations for each node
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        await db.execute(sql`
          INSERT INTO hypergraph_relations (node_id, edge_id, role, position, weight)
          VALUES (${node.nodeId}, ${edge.id}, ${node.role || 'participant'}, ${i}, ${node.weight || 50})
        `);
      }

      return edge;
    } catch (error) {
      console.error('Error creating edge:', error);
      throw error;
    }
  }

  /**
   * Get edge with all connected nodes
   */
  async getEdgeWithNodes(edgeId) {
    const result = await db.execute(sql`
      SELECT 
        e.*,
        json_agg(
          json_build_object(
            'node_id', n.id,
            'node_type', n.node_type,
            'label', n.label,
            'role', r.role,
            'position', r.position,
            'weight', r.weight
          ) ORDER BY r.position
        ) as nodes
      FROM hypergraph_edges e
      JOIN hypergraph_relations r ON e.id = r.edge_id
      JOIN hypergraph_nodes n ON r.node_id = n.id
      WHERE e.id = ${edgeId}
      GROUP BY e.id
    `);
    return result.rows[0];
  }

  /**
   * Find all edges of a specific type
   */
  async findEdgesByType(edgeType) {
    const result = await db.execute(sql`
      SELECT * FROM hypergraph_edges WHERE edge_type = ${edgeType}
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  // ===== RELATIONSHIP QUERIES =====

  /**
   * Get all edges connected to a node
   */
  async getNodeEdges(nodeId) {
    const result = await db.execute(sql`
      SELECT 
        e.*,
        r.role,
        r.position,
        r.weight
      FROM hypergraph_edges e
      JOIN hypergraph_relations r ON e.id = r.edge_id
      WHERE r.node_id = ${nodeId}
      ORDER BY e.created_at DESC
    `);
    return result.rows;
  }

  /**
   * Get all nodes connected to a node through edges
   */
  async getConnectedNodes(nodeId, edgeType = null) {
    let query;
    if (edgeType) {
      query = sql`
        SELECT DISTINCT n.*, e.edge_type, e.label as edge_label, r.role
        FROM hypergraph_nodes n
        JOIN hypergraph_relations r ON n.id = r.node_id
        JOIN hypergraph_edges e ON r.edge_id = e.id
        WHERE e.id IN (
          SELECT edge_id FROM hypergraph_relations WHERE node_id = ${nodeId}
        )
        AND n.id != ${nodeId}
        AND e.edge_type = ${edgeType}
      `;
    } else {
      query = sql`
        SELECT DISTINCT n.*, e.edge_type, e.label as edge_label, r.role
        FROM hypergraph_nodes n
        JOIN hypergraph_relations r ON n.id = r.node_id
        JOIN hypergraph_edges e ON r.edge_id = e.id
        WHERE e.id IN (
          SELECT edge_id FROM hypergraph_relations WHERE node_id = ${nodeId}
        )
        AND n.id != ${nodeId}
      `;
    }
    const result = await db.execute(query);
    return result.rows;
  }

  /**
   * Find path between two nodes
   */
  async findPath(startNodeId, endNodeId, maxDepth = 5) {
    // Simple breadth-first search for shortest path
    const result = await db.execute(sql`
      WITH RECURSIVE path AS (
        -- Base case: start node
        SELECT 
          ${startNodeId}::integer as node_id,
          ARRAY[${startNodeId}]::integer[] as path,
          0 as depth
        
        UNION ALL
        
        -- Recursive case: follow edges
        SELECT 
          r2.node_id,
          path.path || r2.node_id,
          path.depth + 1
        FROM path
        JOIN hypergraph_relations r1 ON r1.node_id = path.node_id
        JOIN hypergraph_relations r2 ON r2.edge_id = r1.edge_id AND r2.node_id != path.node_id
        WHERE 
          path.depth < ${maxDepth}
          AND NOT (r2.node_id = ANY(path.path))
      )
      SELECT * FROM path WHERE node_id = ${endNodeId} ORDER BY depth LIMIT 1
    `);
    return result.rows[0];
  }

  // ===== PATTERN OPERATIONS =====

  /**
   * Save a query pattern for reuse
   */
  async savePattern(patternName, patternType, description, query, nodeTypes = [], edgeTypes = []) {
    try {
      const result = await db.execute(sql`
        INSERT INTO hypergraph_patterns (pattern_name, pattern_type, description, query, node_types, edge_types)
        VALUES (
          ${patternName}, 
          ${patternType}, 
          ${description}, 
          ${JSON.stringify(query)},
          ${JSON.stringify(nodeTypes)},
          ${JSON.stringify(edgeTypes)}
        )
        ON CONFLICT (pattern_name) 
        DO UPDATE SET 
          pattern_type = EXCLUDED.pattern_type,
          description = EXCLUDED.description,
          query = EXCLUDED.query,
          node_types = EXCLUDED.node_types,
          edge_types = EXCLUDED.edge_types
        RETURNING *
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error saving pattern:', error);
      throw error;
    }
  }

  /**
   * Execute a saved pattern
   */
  async executePattern(patternName, params = {}) {
    const result = await db.execute(sql`
      SELECT * FROM hypergraph_patterns WHERE pattern_name = ${patternName}
    `);
    const pattern = result.rows[0];
    
    if (!pattern) {
      throw new Error(`Pattern '${patternName}' not found`);
    }

    // Execute the stored query (this is simplified - real implementation would parse and execute)
    console.log(`Executing pattern: ${patternName}`);
    console.log('Query:', pattern.query);
    return pattern;
  }

  // ===== CASE-SPECIFIC HELPERS =====

  /**
   * Link evidence to an issue
   */
  async linkEvidenceToIssue(evidenceNodeId, issueNodeId, relationship = 'supports', strength = 80) {
    return await this.createEdge(
      relationship,
      `Evidence ${relationship} Issue`,
      [
        { nodeId: evidenceNodeId, role: 'evidence' },
        { nodeId: issueNodeId, role: 'issue' }
      ],
      strength,
      'directed',
      { case: '2025-137857' }
    );
  }

  /**
   * Create timeline relationship
   */
  async createTimelineRelation(eventNodes, timelineType = 'chronological') {
    return await this.createEdge(
      'timeline',
      `${timelineType} timeline`,
      eventNodes.map((nodeId, idx) => ({
        nodeId: nodeId,
        role: 'event',
        weight: idx * 10 // Weight represents time order
      })),
      100,
      'directed',
      { timeline_type: timelineType, case: '2025-137857' }
    );
  }

  /**
   * Link document references
   */
  async linkDocumentReferences(sourceDocId, targetDocIds, referenceType = 'cites') {
    const nodes = [
      { nodeId: sourceDocId, role: 'source' },
      ...targetDocIds.map(id => ({ nodeId: id, role: 'target' }))
    ];
    
    return await this.createEdge(
      referenceType,
      `Document ${referenceType}`,
      nodes,
      70,
      'directed',
      { case: '2025-137857' }
    );
  }

  /**
   * Get evidence supporting an issue
   */
  async getIssueEvidence(issueNodeId) {
    return await this.getConnectedNodes(issueNodeId, 'supports');
  }

  /**
   * Get contradictory evidence
   */
  async getContradictoryEvidence(issueNodeId) {
    return await this.getConnectedNodes(issueNodeId, 'contradicts');
  }

  // ===== ANALYTICS =====

  /**
   * Get graph statistics
   */
  async getStatistics() {
    const nodeCount = await db.execute(sql`SELECT COUNT(*) as count FROM hypergraph_nodes`);
    const edgeCount = await db.execute(sql`SELECT COUNT(*) as count FROM hypergraph_edges`);
    const relationCount = await db.execute(sql`SELECT COUNT(*) as count FROM hypergraph_relations`);
    
    const nodeTypes = await db.execute(sql`
      SELECT node_type, COUNT(*) as count 
      FROM hypergraph_nodes 
      GROUP BY node_type
    `);
    
    const edgeTypes = await db.execute(sql`
      SELECT edge_type, COUNT(*) as count 
      FROM hypergraph_edges 
      GROUP BY edge_type
    `);

    return {
      total_nodes: parseInt(nodeCount.rows[0].count),
      total_edges: parseInt(edgeCount.rows[0].count),
      total_relations: parseInt(relationCount.rows[0].count),
      node_types: nodeTypes.rows,
      edge_types: edgeTypes.rows
    };
  }
}

module.exports = HypergraphManager;

// CLI Interface
if (require.main === module) {
  const manager = new HypergraphManager();
  const command = process.argv[2];

  async function run() {
    try {
      switch(command) {
        case 'stats':
          const stats = await manager.getStatistics();
          console.log('Hypergraph Statistics:');
          console.log(JSON.stringify(stats, null, 2));
          break;

        case 'demo':
          console.log('Creating demo hypergraph for Case 2025-137857...\n');
          
          // Create nodes
          const issue835 = await manager.createNode('issue', 'JF8A Documentation Log', '835', 'Critical priority issue #835');
          const evidence1 = await manager.createNode('evidence', 'Email Correspondence Log', 'email_log_001', 'Documentation of all emails sent to Peter');
          const doc1 = await manager.createNode('document', 'JF8A_DOCUMENTATION_LOG.md', 'jf8a_doc', 'Comprehensive documentation log');
          
          console.log('Created nodes:', issue835.id, evidence1.id, doc1.id);
          
          // Create relationships
          const edge1 = await manager.linkEvidenceToIssue(evidence1.id, issue835.id, 'supports', 95);
          const edge2 = await manager.linkDocumentReferences(doc1.id, [evidence1.id], 'contains');
          
          console.log('Created edges:', edge1.id, edge2.id);
          
          // Query relationships
          const connected = await manager.getConnectedNodes(issue835.id);
          console.log('\nNodes connected to Issue #835:');
          connected.forEach(node => {
            console.log(`  - ${node.label} (${node.node_type}) via ${node.edge_type}`);
          });
          
          const graphStats = await manager.getStatistics();
          console.log('\nGraph Statistics:', graphStats);
          break;

        default:
          console.log('Hypergraph Manager for Case 2025-137857');
          console.log('\nUsage:');
          console.log('  node hypergraph-manager.js stats  - Show graph statistics');
          console.log('  node hypergraph-manager.js demo   - Run demo with sample data');
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }

  run();
}