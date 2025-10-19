#!/usr/bin/env node

const { db } = require('./config');
const { sql } = require('drizzle-orm');

async function createHypergraphTables() {
  console.log('Creating hypergraph schema for Case 2025-137857...\n');
  
  try {
    // Create hypergraph_nodes table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hypergraph_nodes (
        id SERIAL PRIMARY KEY,
        node_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR(100),
        label VARCHAR(255) NOT NULL,
        description TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created hypergraph_nodes table');

    // Create indexes for nodes
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_nodes_type ON hypergraph_nodes(node_type);
      CREATE INDEX IF NOT EXISTS idx_nodes_entity ON hypergraph_nodes(entity_id);
      CREATE INDEX IF NOT EXISTS idx_nodes_metadata ON hypergraph_nodes USING gin(metadata);
    `);
    console.log('✅ Created indexes for hypergraph_nodes');

    // Create hypergraph_edges table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hypergraph_edges (
        id SERIAL PRIMARY KEY,
        edge_type VARCHAR(100) NOT NULL,
        label VARCHAR(255),
        description TEXT,
        strength INTEGER CHECK (strength >= 0 AND strength <= 100),
        direction VARCHAR(20),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created hypergraph_edges table');

    // Create indexes for edges
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_edges_type ON hypergraph_edges(edge_type);
      CREATE INDEX IF NOT EXISTS idx_edges_strength ON hypergraph_edges(strength);
      CREATE INDEX IF NOT EXISTS idx_edges_metadata ON hypergraph_edges USING gin(metadata);
    `);
    console.log('✅ Created indexes for hypergraph_edges');

    // Create hypergraph_relations table (junction table)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hypergraph_relations (
        id SERIAL PRIMARY KEY,
        node_id INTEGER NOT NULL REFERENCES hypergraph_nodes(id) ON DELETE CASCADE,
        edge_id INTEGER NOT NULL REFERENCES hypergraph_edges(id) ON DELETE CASCADE,
        role VARCHAR(50),
        position INTEGER,
        weight INTEGER,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(node_id, edge_id, role)
      )
    `);
    console.log('✅ Created hypergraph_relations table');

    // Create indexes for relations
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_relations_node ON hypergraph_relations(node_id);
      CREATE INDEX IF NOT EXISTS idx_relations_edge ON hypergraph_relations(edge_id);
      CREATE INDEX IF NOT EXISTS idx_relations_role ON hypergraph_relations(role);
    `);
    console.log('✅ Created indexes for hypergraph_relations');

    // Create hypergraph_patterns table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hypergraph_patterns (
        id SERIAL PRIMARY KEY,
        pattern_name VARCHAR(100) NOT NULL UNIQUE,
        pattern_type VARCHAR(50) NOT NULL,
        description TEXT,
        query JSONB,
        node_types JSONB,
        edge_types JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created hypergraph_patterns table');

    // Create indexes for patterns
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_patterns_name ON hypergraph_patterns(pattern_name);
      CREATE INDEX IF NOT EXISTS idx_patterns_type ON hypergraph_patterns(pattern_type);
    `);
    console.log('✅ Created indexes for hypergraph_patterns');

    console.log('\n🎉 Hypergraph schema created successfully!');
    console.log('\nYou can now model complex relationships like:');
    console.log('  - Evidence → supports/contradicts → Legal Arguments → references → Court Documents');
    console.log('  - Timeline Events → caused_by → Actions → performed_by → People');
    console.log('  - Issues → relates_to → Evidence → references → Documents');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating hypergraph schema:', error);
    process.exit(1);
  }
}

createHypergraphTables();