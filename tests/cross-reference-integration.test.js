#!/usr/bin/env node

/**
 * Cross-Reference Integration Tests
 * Tests for the cross-reference system that prevents issue combinatorial explosion
 */

const HierarchicalIssueManager = require('../db/hierarchical-issue-manager');

class CrossReferenceIntegrationTest {
  constructor() {
    this.manager = new HierarchicalIssueManager();
    this.testResults = [];
    this.createdIds = {
      arguments: [],
      features: [],
      paragraphs: [],
      tasks: [],
      crossRefs: []
    };
  }

  log(message, type = 'info') {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    };
    console.log(`${icons[type]} ${message}`);
  }

  async runTest(testName, testFn) {
    try {
      this.log(`Running: ${testName}`, 'info');
      await testFn();
      this.testResults.push({ name: testName, passed: true });
      this.log(`PASSED: ${testName}`, 'success');
      return true;
    } catch (error) {
      this.testResults.push({ name: testName, passed: false, error: error.message });
      this.log(`FAILED: ${testName} - ${error.message}`, 'error');
      return false;
    }
  }

  async testAddCrossReference() {
    await this.runTest('Add cross-reference to issue', async () => {
      // Create a test argument and feature
      const arg = await this.manager.createLegalArgument(
        'Test Cross-Reference Argument',
        'Test argument for cross-reference',
        'defense'
      );
      this.createdIds.arguments.push(arg.id);

      const feature = await this.manager.createFeatureIssue(
        9001,
        'Test Feature for Cross-Ref',
        'Test feature',
        'medium',
        arg.id
      );
      this.createdIds.features.push(feature.id);

      const para = await this.manager.createParagraph(
        feature.id,
        1,
        'Test Paragraph',
        'Test content',
        1,
        90
      );
      this.createdIds.paragraphs.push(para.id);

      const task = await this.manager.createTaskIssue(
        9101,
        'Test Task',
        'Test task for cross-ref',
        feature.id,
        para.id,
        1,
        80,
        'medium'
      );
      this.createdIds.tasks.push(task.id);

      // Add cross-reference
      const xref = await this.manager.addCrossReference(
        task.id,
        'evidence',
        'TEST_EVIDENCE_001',
        '/evidence/test.pdf',
        'Test Evidence Document',
        'Page 1',
        'proves',
        'Test cross-reference'
      );

      if (!xref || !xref.id) {
        throw new Error('Cross-reference not created');
      }

      this.createdIds.crossRefs.push(xref.id);
    });
  }

  async testGetIssueCrossReferences() {
    await this.runTest('Get cross-references for an issue', async () => {
      if (this.createdIds.tasks.length === 0) {
        throw new Error('No test tasks created');
      }

      const taskId = this.createdIds.tasks[0];
      const refs = await this.manager.getIssueCrossReferences(taskId);

      if (!Array.isArray(refs)) {
        throw new Error('Expected array of cross-references');
      }

      if (refs.length === 0) {
        throw new Error('Expected at least one cross-reference');
      }
    });
  }

  async testGetIssuesByReference() {
    await this.runTest('Get all issues referencing a document', async () => {
      const issues = await this.manager.getIssuesByReference('evidence', 'TEST_EVIDENCE_001');

      if (!Array.isArray(issues)) {
        throw new Error('Expected array of issues');
      }

      if (issues.length === 0) {
        throw new Error('Expected at least one issue');
      }
    });
  }

  async testConsolidationDetection() {
    await this.runTest('Detect consolidation opportunities', async () => {
      // Create second task referencing the same evidence
      const feature = this.createdIds.features[0];
      const para = this.createdIds.paragraphs[0];

      const task2 = await this.manager.createTaskIssue(
        9102,
        'Second Test Task',
        'Another task referencing same evidence',
        feature,
        para,
        2,
        75,
        'medium'
      );
      this.createdIds.tasks.push(task2.id);

      // Add cross-reference to same evidence
      await this.manager.addCrossReference(
        task2.id,
        'evidence',
        'TEST_EVIDENCE_001',
        '/evidence/test.pdf',
        'Test Evidence Document',
        'Page 2',
        'supports',
        'Second reference to same evidence'
      );

      // Check consolidation opportunities
      const opportunities = await this.manager.getConsolidationOpportunities();

      if (!Array.isArray(opportunities)) {
        throw new Error('Expected array of consolidation opportunities');
      }

      // Should have at least one consolidation opportunity for TEST_EVIDENCE_001
      const found = opportunities.find(opp => 
        opp.reference_id === 'TEST_EVIDENCE_001' && 
        parseInt(opp.issue_count) >= 2
      );

      if (!found) {
        throw new Error('Expected consolidation opportunity for TEST_EVIDENCE_001');
      }
    });
  }

  async testFindRelatedIssues() {
    await this.runTest('Find related issues via shared cross-references', async () => {
      if (this.createdIds.tasks.length < 2) {
        throw new Error('Need at least 2 tasks');
      }

      const task1 = this.createdIds.tasks[0];
      const related = await this.manager.findRelatedIssues(task1, 1);

      if (!Array.isArray(related)) {
        throw new Error('Expected array of related issues');
      }

      if (related.length === 0) {
        throw new Error('Expected at least one related issue');
      }

      const relatedIssue = related[0];
      if (!relatedIssue.shared_reference_count || parseInt(relatedIssue.shared_reference_count) < 1) {
        throw new Error('Related issue should have shared references');
      }
    });
  }

  async testCrossReferenceStatistics() {
    await this.runTest('Get cross-reference statistics', async () => {
      const stats = await this.manager.getCrossReferenceStatistics();

      if (!stats || typeof stats !== 'object') {
        throw new Error('Expected statistics object');
      }

      if (!stats.total_cross_references || stats.total_cross_references < 2) {
        throw new Error('Expected at least 2 cross-references');
      }

      if (!Array.isArray(stats.references_by_type)) {
        throw new Error('Expected references_by_type array');
      }

      if (!Array.isArray(stats.consolidation_opportunities)) {
        throw new Error('Expected consolidation_opportunities array');
      }
    });
  }

  async testMultipleReferenceTypes() {
    await this.runTest('Add cross-references of different types', async () => {
      const task = this.createdIds.tasks[0];

      // Add document reference
      await this.manager.addCrossReference(
        task,
        'document',
        'AFFIDAVIT_PARA_7.2',
        '/docs/affidavit.md',
        'Answering Affidavit',
        'Paragraph 7.2',
        'analyzes'
      );

      // Add annexure reference
      await this.manager.addCrossReference(
        task,
        'annexure',
        'JF09',
        '/ANNEXURES/JF09/',
        'Timeline Analysis',
        null,
        'supports'
      );

      const refs = await this.manager.getIssueCrossReferences(task);

      const types = new Set(refs.map(r => r.reference_type));
      if (!types.has('evidence') || !types.has('document') || !types.has('annexure')) {
        throw new Error('Expected references of multiple types');
      }
    });
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));

    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;
    const total = this.testResults.length;
    const successRate = ((passed / total) * 100).toFixed(1);

    console.log(`\nTotal Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${successRate}%\n`);

    if (failed > 0) {
      console.log('Failed Tests:');
      this.testResults
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`  ❌ ${r.name}`);
          console.log(`     Error: ${r.error}`);
        });
    }

    console.log('='.repeat(60) + '\n');

    return failed === 0;
  }

  async runAll() {
    console.log('\n🧪 Cross-Reference Integration Test Suite\n');
    console.log('Testing cross-reference functionality to prevent issue explosion...\n');

    try {
      // Run tests in order
      await this.testAddCrossReference();
      await this.testGetIssueCrossReferences();
      await this.testGetIssuesByReference();
      await this.testConsolidationDetection();
      await this.testFindRelatedIssues();
      await this.testCrossReferenceStatistics();
      await this.testMultipleReferenceTypes();

      const allPassed = this.printSummary();
      process.exit(allPassed ? 0 : 1);
    } catch (error) {
      console.error('\n💥 Fatal error during test execution:', error);
      process.exit(1);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new CrossReferenceIntegrationTest();
  tester.runAll();
}

module.exports = CrossReferenceIntegrationTest;
