#!/usr/bin/env node

/**
 * Test suite for Hierarchical Issue Manager
 * Tests feature-level issues, paragraphs, task issues, and rank ordering
 */

const HierarchicalIssueManager = require('../db/hierarchical-issue-manager');

class HierarchicalIssueTests {
  constructor() {
    this.manager = new HierarchicalIssueManager();
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      errors: []
    };
  }

  async runTest(name, testFn) {
    this.testResults.total++;
    try {
      await testFn();
      this.testResults.passed++;
      console.log(`  ✅ ${name}`);
      return true;
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push({ name, error: error.message });
      console.log(`  ❌ ${name}`);
      console.log(`     Error: ${error.message}`);
      return false;
    }
  }

  async runAllTests() {
    console.log('🧪 Running Hierarchical Issue Manager Tests\n');
    
    let testArg, testFeature, testParagraph, testTask;

    // Test 1: Create Legal Argument
    await this.runTest('Create legal argument', async () => {
      testArg = await this.manager.createLegalArgument(
        'Test Argument',
        'Test description',
        'defense',
        'Test strategy'
      );
      if (!testArg || !testArg.id) {
        throw new Error('Failed to create legal argument');
      }
    });

    // Test 2: Create Feature Issue
    await this.runTest('Create feature issue', async () => {
      testFeature = await this.manager.createFeatureIssue(
        9001,
        'Test Feature',
        'Test feature description',
        'high',
        testArg.id
      );
      if (!testFeature || testFeature.issue_type !== 'feature') {
        throw new Error('Failed to create feature issue');
      }
    });

    // Test 3: Create Paragraph
    await this.runTest('Create paragraph with rank and weight', async () => {
      testParagraph = await this.manager.createParagraph(
        testFeature.id,
        1,
        'Test Paragraph',
        'Test content',
        1,  // rank
        95  // weight
      );
      if (!testParagraph || testParagraph.rank_order !== 1 || testParagraph.weight !== 95) {
        throw new Error('Paragraph rank or weight incorrect');
      }
    });

    // Test 4: Create Task Issue
    await this.runTest('Create task issue under feature', async () => {
      testTask = await this.manager.createTaskIssue(
        9002,
        'Test Task',
        'Test task description',
        testFeature.id,
        testParagraph.id,
        1,   // rank
        100, // weight
        'medium'
      );
      if (!testTask || testTask.issue_type !== 'task' || testTask.parent_issue_id !== testFeature.id) {
        throw new Error('Task issue not properly linked to feature');
      }
    });

    // Test 5: Get Feature Task Issues
    await this.runTest('Get feature task issues', async () => {
      const tasks = await this.manager.getFeatureTaskIssues(testFeature.id);
      if (!Array.isArray(tasks) || tasks.length === 0) {
        throw new Error('Failed to retrieve feature task issues');
      }
      if (tasks[0].id !== testTask.id) {
        throw new Error('Retrieved task does not match created task');
      }
    });

    // Test 6: Get Feature Paragraphs
    await this.runTest('Get feature paragraphs ordered by rank', async () => {
      const paragraphs = await this.manager.getFeatureParagraphs(testFeature.id);
      if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
        throw new Error('Failed to retrieve feature paragraphs');
      }
      if (paragraphs[0].rank_order !== 1) {
        throw new Error('Paragraphs not ordered by rank');
      }
    });

    // Test 7: Get Paragraph with Issues
    await this.runTest('Get paragraph with linked issues', async () => {
      const result = await this.manager.getParagraphWithIssues(testParagraph.id);
      if (!result.paragraph || !Array.isArray(result.issues)) {
        throw new Error('Failed to get paragraph with issues');
      }
      if (result.issues.length === 0) {
        throw new Error('No issues linked to paragraph');
      }
    });

    // Test 8: Update Issue Rank
    await this.runTest('Update issue rank order', async () => {
      const updated = await this.manager.updateIssueRank(testTask.id, 2);
      if (!updated || updated.rank_order !== 2) {
        throw new Error('Failed to update issue rank');
      }
    });

    // Test 9: Update Issue Weight
    await this.runTest('Update issue weight', async () => {
      const updated = await this.manager.updateIssueWeight(testTask.id, 85);
      if (!updated || updated.weight !== 85) {
        throw new Error('Failed to update issue weight');
      }
    });

    // Test 10: Create Multiple Paragraphs with Different Ranks
    await this.runTest('Create multiple ranked paragraphs', async () => {
      const para2 = await this.manager.createParagraph(
        testFeature.id, 2, 'Second Paragraph', 'Content 2', 2, 90
      );
      const para3 = await this.manager.createParagraph(
        testFeature.id, 3, 'Third Paragraph', 'Content 3', 3, 80
      );
      
      const paragraphs = await this.manager.getFeatureParagraphs(testFeature.id);
      if (paragraphs.length !== 3) {
        throw new Error('Should have 3 paragraphs');
      }
      // Should be ordered by rank_order
      if (paragraphs[0].rank_order !== 1 || paragraphs[1].rank_order !== 2 || paragraphs[2].rank_order !== 3) {
        throw new Error('Paragraphs not correctly ordered by rank');
      }
    });

    // Test 11: Create Multiple Task Issues with Different Ranks
    await this.runTest('Create multiple ranked task issues', async () => {
      const task2 = await this.manager.createTaskIssue(
        9003, 'Second Task', 'Description 2', testFeature.id, testParagraph.id, 2, 90, 'medium'
      );
      const task3 = await this.manager.createTaskIssue(
        9004, 'Third Task', 'Description 3', testFeature.id, testParagraph.id, 3, 80, 'low'
      );
      
      const { issues } = await this.manager.getParagraphWithIssues(testParagraph.id);
      if (issues.length < 3) {
        throw new Error('Should have at least 3 issues');
      }
      // First should have highest rank (lowest number) or highest weight
      const sorted = [...issues].sort((a, b) => a.para_rank - b.para_rank);
      if (sorted[0].para_rank > sorted[1].para_rank) {
        throw new Error('Issues not correctly ordered by rank');
      }
    });

    // Test 12: Get Argument Hierarchy
    await this.runTest('Get complete argument hierarchy', async () => {
      const hierarchy = await this.manager.getArgumentHierarchy(testArg.id);
      if (!hierarchy.argument || !Array.isArray(hierarchy.features)) {
        throw new Error('Hierarchy structure incorrect');
      }
      if (hierarchy.features.length === 0) {
        throw new Error('No features in hierarchy');
      }
      const feature = hierarchy.features[0];
      if (!Array.isArray(feature.paragraphs) || feature.paragraphs.length === 0) {
        throw new Error('No paragraphs in feature');
      }
      const paragraph = feature.paragraphs[0];
      if (!Array.isArray(paragraph.issues) || paragraph.issues.length === 0) {
        throw new Error('No issues in paragraph');
      }
    });

    // Test 13: Calculate Feature Strength
    await this.runTest('Calculate feature strength from weights', async () => {
      const strength = await this.manager.calculateFeatureStrength(testFeature.id);
      if (typeof strength !== 'number' || strength < 0 || strength > 100) {
        throw new Error('Feature strength calculation invalid');
      }
    });

    // Test 14: Get Top Paragraphs
    await this.runTest('Get top paragraphs by weight', async () => {
      const topParagraphs = await this.manager.getTopParagraphs(testFeature.id, 2);
      if (!Array.isArray(topParagraphs) || topParagraphs.length === 0) {
        throw new Error('Failed to get top paragraphs');
      }
      // Should be ordered by weight DESC
      if (topParagraphs.length > 1 && topParagraphs[0].weight < topParagraphs[1].weight) {
        throw new Error('Top paragraphs not ordered by weight');
      }
    });

    // Test 15: Get Top Paragraph Issues
    await this.runTest('Get top issues in paragraph by weight', async () => {
      const topIssues = await this.manager.getTopParagraphIssues(testParagraph.id, 2);
      if (!Array.isArray(topIssues) || topIssues.length === 0) {
        throw new Error('Failed to get top paragraph issues');
      }
      // Should be ordered by weight DESC
      if (topIssues.length > 1 && topIssues[0].para_weight < topIssues[1].para_weight) {
        throw new Error('Top issues not ordered by weight');
      }
    });

    // Test 16: Get Statistics
    await this.runTest('Get hierarchy statistics', async () => {
      const stats = await this.manager.getHierarchyStatistics();
      if (!stats || typeof stats.total_arguments !== 'number') {
        throw new Error('Statistics structure incorrect');
      }
      if (stats.total_arguments < 1) {
        throw new Error('Should have at least 1 argument');
      }
      if (stats.total_features < 1) {
        throw new Error('Should have at least 1 feature');
      }
      if (stats.total_paragraphs < 1) {
        throw new Error('Should have at least 1 paragraph');
      }
      if (stats.total_tasks < 1) {
        throw new Error('Should have at least 1 task');
      }
    });

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Summary\n');
    console.log(`Total Tests:  ${this.testResults.total}`);
    console.log(`Passed:       ${this.testResults.passed} ✅`);
    console.log(`Failed:       ${this.testResults.failed} ❌`);
    console.log(`Success Rate: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(1)}%`);
    
    if (this.testResults.errors.length > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.errors.forEach(err => {
        console.log(`  - ${err.name}: ${err.error}`);
      });
    }
    
    console.log('='.repeat(60) + '\n');

    return this.testResults;
  }
}

// Run tests if called directly
if (require.main === module) {
  const tests = new HierarchicalIssueTests();
  tests.runAllTests()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = HierarchicalIssueTests;
