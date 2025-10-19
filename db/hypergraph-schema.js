const { pgTable, serial, varchar, text, timestamp, jsonb, integer } = require('drizzle-orm/pg-core');

/**
 * Hypergraph Schema for Case 2025-137857
 * 
 * A hypergraph allows modeling complex multi-way relationships between:
 * - Documents, Evidence, Issues, People, Events, Legal Arguments, etc.
 * 
 * Structure:
 * - Nodes: Individual entities (document, person, issue, event, etc.)
 * - Hyperedges: Relationships connecting multiple nodes
 * - Relations: Junction table linking nodes to hyperedges
 */

// Nodes represent entities in the case
const hypergraphNodes = pgTable('hypergraph_nodes', {
  id: serial('id').primaryKey(),
  nodeType: varchar('node_type', { length: 50 }).notNull(), // document, person, issue, evidence, event, argument, etc.
  entityId: varchar('entity_id', { length: 100 }), // Reference to actual entity (e.g., issue_number, document_id)
  label: varchar('label', { length: 255 }).notNull(),
  description: text('description'),
  metadata: jsonb('metadata'), // Flexible attributes
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Hyperedges represent relationships between nodes
const hypergraphEdges = pgTable('hypergraph_edges', {
  id: serial('id').primaryKey(),
  edgeType: varchar('edge_type', { length: 100 }).notNull(), // supports, contradicts, references, timeline, causation, etc.
  label: varchar('label', { length: 255 }),
  description: text('description'),
  strength: integer('strength'), // Relationship strength/confidence (0-100)
  direction: varchar('direction', { length: 20 }), // directed, undirected, bidirectional
  metadata: jsonb('metadata'), // Additional properties
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Junction table for node-edge relationships
const hypergraphRelations = pgTable('hypergraph_relations', {
  id: serial('id').primaryKey(),
  nodeId: integer('node_id').notNull(),
  edgeId: integer('edge_id').notNull(),
  role: varchar('role', { length: 50 }), // source, target, context, participant, etc.
  position: integer('position'), // Order in the relationship
  weight: integer('weight'), // Importance/weight in this relationship
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow()
});

// Predefined hypergraph queries/patterns
const hypergraphPatterns = pgTable('hypergraph_patterns', {
  id: serial('id').primaryKey(),
  patternName: varchar('pattern_name', { length: 100 }).notNull(),
  patternType: varchar('pattern_type', { length: 50 }).notNull(), // query, inference, validation
  description: text('description'),
  query: jsonb('query'), // Stored query structure
  nodeTypes: jsonb('node_types'), // Array of node types in pattern
  edgeTypes: jsonb('edge_types'), // Array of edge types in pattern
  createdAt: timestamp('created_at').defaultNow()
});

module.exports = {
  hypergraphNodes,
  hypergraphEdges,
  hypergraphRelations,
  hypergraphPatterns
};