const { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb } = require('drizzle-orm/pg-core');

// Case documents table
const caseDocuments = pgTable('case_documents', {
  id: serial('id').primaryKey(),
  caseNumber: varchar('case_number', { length: 50 }).notNull(),
  documentType: varchar('document_type', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  filePath: varchar('file_path', { length: 500 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Evidence records table
const evidenceRecords = pgTable('evidence_records', {
  id: serial('id').primaryKey(),
  caseNumber: varchar('case_number', { length: 50 }).notNull(),
  evidenceType: varchar('evidence_type', { length: 100 }).notNull(),
  description: text('description'),
  filePath: varchar('file_path', { length: 500 }),
  source: varchar('source', { length: 255 }),
  dateCollected: timestamp('date_collected'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow()
});

// Issues tracking table
const issues = pgTable('issues', {
  id: serial('id').primaryKey(),
  issueNumber: integer('issue_number').unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  priority: varchar('priority', { length: 20 }),
  status: varchar('status', { length: 50 }).default('open'),
  labels: jsonb('labels'),
  assignee: varchar('assignee', { length: 100 }),
  issueType: varchar('issue_type', { length: 50 }).default('task'), // 'feature', 'task'
  parentIssueId: integer('parent_issue_id'), // Reference to parent feature issue
  rankOrder: integer('rank_order'), // Rank within parent (1 = highest)
  weight: integer('weight'), // Influence weight (0-100)
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  completedAt: timestamp('completed_at')
});

// Legal arguments/strategies table
const legalArguments = pgTable('legal_arguments', {
  id: serial('id').primaryKey(),
  argumentName: varchar('argument_name', { length: 255 }).notNull(),
  description: text('description'),
  argumentType: varchar('argument_type', { length: 100 }), // 'offense', 'defense', 'counterclaim', etc.
  strategy: text('strategy'),
  status: varchar('status', { length: 50 }).default('active'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Paragraphs within feature issues
const issueParagraphs = pgTable('issue_paragraphs', {
  id: serial('id').primaryKey(),
  featureIssueId: integer('feature_issue_id').notNull(), // Reference to parent feature issue
  paragraphNumber: integer('paragraph_number').notNull(),
  title: varchar('title', { length: 255 }),
  content: text('content'),
  rankOrder: integer('rank_order').notNull(), // Rank by influence (1 = highest)
  weight: integer('weight').notNull(), // Influence on feature strength (0-100)
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Link issues to legal arguments
const issueArgumentLinks = pgTable('issue_argument_links', {
  id: serial('id').primaryKey(),
  issueId: integer('issue_id').notNull(),
  argumentId: integer('argument_id').notNull(),
  linkType: varchar('link_type', { length: 50 }), // 'proves', 'disproves', 'supports', etc.
  strength: integer('strength'), // 0-100
  createdAt: timestamp('created_at').defaultNow()
});

// Link paragraphs to issues
const paragraphIssueLinks = pgTable('paragraph_issue_links', {
  id: serial('id').primaryKey(),
  paragraphId: integer('paragraph_id').notNull(),
  issueId: integer('issue_id').notNull(),
  rankOrder: integer('rank_order').notNull(), // Rank of issue within paragraph
  weight: integer('weight').notNull(), // Influence on paragraph (0-100)
  createdAt: timestamp('created_at').defaultNow()
});

// Cross-references linking issues to documents, evidence, and annexures
const issueCrossReferences = pgTable('issue_cross_references', {
  id: serial('id').primaryKey(),
  issueId: integer('issue_id').notNull(),
  referenceType: varchar('reference_type', { length: 100 }).notNull(), // 'document', 'evidence', 'annexure', 'paragraph', 'timeline_event', 'analysis'
  referenceId: varchar('reference_id', { length: 500 }).notNull(),
  referencePath: varchar('reference_path', { length: 1000 }),
  referenceTitle: varchar('reference_title', { length: 500 }),
  referenceSection: varchar('reference_section', { length: 255 }),
  relationshipType: varchar('relationship_type', { length: 100 }), // 'proves', 'supports', 'contradicts', 'analyzes', etc.
  notes: text('notes'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Track consolidation opportunities where multiple issues reference the same evidence
const crossReferenceConsolidations = pgTable('cross_reference_consolidations', {
  id: serial('id').primaryKey(),
  referenceType: varchar('reference_type', { length: 100 }).notNull(),
  referenceId: varchar('reference_id', { length: 500 }).notNull(),
  issueCount: integer('issue_count').notNull(),
  issueIds: jsonb('issue_ids').notNull(),
  consolidationStatus: varchar('consolidation_status', { length: 50 }).default('detected'), // 'detected', 'reviewed', 'consolidated', 'dismissed'
  recommendedAction: text('recommended_action'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  resolvedAt: timestamp('resolved_at')
});

// Test results table
const testResults = pgTable('test_results', {
  id: serial('id').primaryKey(),
  testType: varchar('test_type', { length: 100 }).notNull(),
  totalTests: integer('total_tests').notNull(),
  passed: integer('passed').notNull(),
  failed: integer('failed').notNull(),
  successRate: integer('success_rate').notNull(),
  errors: jsonb('errors'),
  results: jsonb('results'),
  runAt: timestamp('run_at').defaultNow()
});

// Affidavit amendments table
const affidavitAmendments = pgTable('affidavit_amendments', {
  id: serial('id').primaryKey(),
  sectionNumber: varchar('section_number', { length: 50 }),
  paragraphNumber: varchar('paragraph_number', { length: 50 }),
  originalText: text('original_text'),
  amendedText: text('amended_text'),
  justification: text('justification'),
  status: varchar('status', { length: 50 }).default('draft'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

module.exports = {
  caseDocuments,
  evidenceRecords,
  issues,
  testResults,
  affidavitAmendments,
  legalArguments,
  issueParagraphs,
  issueArgumentLinks,
  paragraphIssueLinks,
  issueCrossReferences,
  crossReferenceConsolidations
};