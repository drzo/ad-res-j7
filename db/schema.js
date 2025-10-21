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
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  completedAt: timestamp('completed_at')
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
  affidavitAmendments
};