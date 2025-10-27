#!/usr/bin/env node

/**
 * Issue Consolidation Utility
 * 
 * Helps consolidate the 120+ issues into hierarchical structure
 * using cross-reference integration to prevent combinatorial explosion
 */

const HierarchicalIssueManager = require('./hierarchical-issue-manager');

class IssueConsolidator {
  constructor() {
    this.manager = new HierarchicalIssueManager();
  }

  /**
   * Analyze all consolidation opportunities and provide recommendations
   */
  async analyzeConsolidationOpportunities() {
    console.log('🔍 Analyzing Consolidation Opportunities...\n');

    const opportunities = await this.manager.getConsolidationOpportunities('detected');
    
    if (opportunities.length === 0) {
      console.log('✅ No consolidation opportunities detected.');
      console.log('   This could mean:');
      console.log('   1. Issues are already well-organized');
      console.log('   2. Cross-references haven\'t been added yet');
      console.log('\n💡 Tip: Run `npm run db:hierarchy:demo` to see cross-reference examples');
      return [];
    }

    console.log(`📊 Found ${opportunities.length} consolidation opportunities\n`);
    console.log('=' .repeat(70));

    const analysis = [];

    for (const opp of opportunities) {
      const issues = await this.manager.getIssuesByReference(
        opp.reference_type,
        opp.reference_id
      );

      const issueTypes = this.categorizeIssues(issues);
      const recommendation = this.generateRecommendation(opp, issues, issueTypes);

      analysis.push({
        opportunity: opp,
        issues,
        issueTypes,
        recommendation
      });

      this.printOpportunity(opp, issues, issueTypes, recommendation);
    }

    return analysis;
  }

  /**
   * Categorize issues by type
   */
  categorizeIssues(issues) {
    return {
      features: issues.filter(i => i.issue_type === 'feature'),
      tasks: issues.filter(i => i.issue_type === 'task'),
      total: issues.length
    };
  }

  /**
   * Generate consolidation recommendation
   */
  generateRecommendation(opp, issues, issueTypes) {
    const { features, tasks, total } = issueTypes;

    // If all are already tasks under features, suggest paragraph organization
    if (features.length === 0 && tasks.length === total) {
      return {
        action: 'organize_under_paragraph',
        priority: 'medium',
        reason: 'All issues are tasks - organize under common paragraph',
        steps: [
          `Create a paragraph grouping for ${opp.reference_type}: ${opp.reference_id}`,
          `Link all ${total} tasks to this paragraph`,
          `Assign rank order and weights based on importance`
        ]
      };
    }

    // If multiple features reference same thing, suggest higher-level feature
    if (features.length >= 2) {
      return {
        action: 'create_parent_feature',
        priority: 'high',
        reason: `${features.length} feature issues reference same ${opp.reference_type}`,
        steps: [
          `Create parent feature issue for ${opp.reference_type}: ${opp.reference_id}`,
          `Convert ${features.length} features to paragraphs or tasks`,
          `Consolidate duplicate efforts`
        ]
      };
    }

    // If mix of features and tasks, suggest organizing under feature
    if (features.length > 0 && tasks.length > 0) {
      return {
        action: 'consolidate_under_feature',
        priority: 'high',
        reason: 'Mix of feature and task issues - consolidate hierarchy',
        steps: [
          `Use existing feature issue as parent`,
          `Convert ${tasks.length} standalone tasks to sub-tasks`,
          `Remove duplicate feature if necessary`
        ]
      };
    }

    // Default: Create new feature
    return {
      action: 'create_feature',
      priority: 'high',
      reason: `${total} tasks reference same ${opp.reference_type}`,
      steps: [
        `Create feature issue for ${opp.reference_type}: ${opp.reference_id}`,
        `Create 3 paragraphs to organize the ${total} tasks`,
        `Distribute tasks across paragraphs with rank/weight`,
        `Estimated: 1 feature + 3 paragraphs + ${total} tasks`
      ]
    };
  }

  /**
   * Print opportunity details
   */
  printOpportunity(opp, issues, issueTypes, recommendation) {
    console.log(`\n📦 ${opp.reference_type.toUpperCase()}: ${opp.reference_id}`);
    console.log(`   Issues: ${opp.issue_count} (${issueTypes.features.length} features, ${issueTypes.tasks.length} tasks)`);
    console.log(`   Status: ${opp.consolidation_status}`);
    
    console.log('\n   🎯 RECOMMENDATION:');
    console.log(`      Action: ${recommendation.action}`);
    console.log(`      Priority: ${recommendation.priority}`);
    console.log(`      Reason: ${recommendation.reason}`);
    
    console.log('\n   📋 STEPS:');
    recommendation.steps.forEach((step, i) => {
      console.log(`      ${i + 1}. ${step}`);
    });

    console.log('\n   📄 AFFECTED ISSUES:');
    issues.forEach(issue => {
      const typeIcon = issue.issue_type === 'feature' ? '🎯' : '✓';
      console.log(`      ${typeIcon} #${issue.issue_number}: ${issue.title}`);
      if (issue.relationship_type) {
        console.log(`         Relationship: ${issue.relationship_type}`);
      }
    });

    console.log('\n' + '─'.repeat(70));
  }

  /**
   * Generate consolidation report
   */
  async generateReport() {
    console.log('\n📊 ISSUE CONSOLIDATION REPORT\n');
    console.log('=' .repeat(70));

    const analysis = await this.analyzeConsolidationOpportunities();

    if (analysis.length === 0) {
      return;
    }

    // Summary statistics
    console.log('\n\n📈 SUMMARY STATISTICS\n');
    console.log('=' .repeat(70));

    const totalIssuesAffected = analysis.reduce((sum, a) => sum + a.issues.length, 0);
    const highPriority = analysis.filter(a => a.recommendation.priority === 'high').length;
    const mediumPriority = analysis.filter(a => a.recommendation.priority === 'medium').length;

    console.log(`\nTotal consolidation opportunities: ${analysis.length}`);
    console.log(`Total issues affected: ${totalIssuesAffected}`);
    console.log(`High priority opportunities: ${highPriority}`);
    console.log(`Medium priority opportunities: ${mediumPriority}`);

    // Categorize by reference type
    const byType = {};
    analysis.forEach(a => {
      const type = a.opportunity.reference_type;
      if (!byType[type]) byType[type] = 0;
      byType[type]++;
    });

    console.log('\nOpportunities by reference type:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    // Estimated impact
    console.log('\n\n💡 ESTIMATED IMPACT\n');
    console.log('=' .repeat(70));
    console.log('\nIf all consolidations are completed:');
    console.log(`  Current issues: ${totalIssuesAffected}`);
    console.log(`  Estimated consolidated features: ${analysis.length}`);
    console.log(`  Reduction: ${totalIssuesAffected - analysis.length} issues`);
    console.log(`  Efficiency gain: ${((1 - analysis.length/totalIssuesAffected) * 100).toFixed(1)}%`);

    console.log('\n\n📋 NEXT STEPS\n');
    console.log('=' .repeat(70));
    console.log('\n1. Review high-priority opportunities first');
    console.log('2. For each opportunity:');
    console.log('   - Review the affected issues');
    console.log('   - Follow the recommended steps');
    console.log('   - Mark as "reviewed" or "consolidated" when done');
    console.log('3. Track progress with: npm run db:xref:stats');
    console.log('4. Re-run this report periodically');

    console.log('\n\n🛠️  COMMANDS\n');
    console.log('=' .repeat(70));
    console.log('\nMark opportunity as reviewed:');
    console.log('  await manager.updateConsolidationStatus(opportunityId, "reviewed")');
    console.log('\nMark opportunity as consolidated:');
    console.log('  await manager.updateConsolidationStatus(opportunityId, "consolidated")');
    console.log('\nDismiss opportunity:');
    console.log('  await manager.updateConsolidationStatus(opportunityId, "dismissed")');

    console.log('\n' + '=' .repeat(70) + '\n');
  }

  /**
   * Interactive consolidation wizard (stub for future implementation)
   */
  async runWizard() {
    console.log('🧙 Issue Consolidation Wizard\n');
    console.log('This feature is planned for future implementation.');
    console.log('For now, use the consolidation report and manual consolidation.\n');
  }

  /**
   * Show cross-reference coverage
   */
  async showCoverage() {
    console.log('📊 Cross-Reference Coverage Analysis\n');
    console.log('=' .repeat(70));

    const stats = await this.manager.getCrossReferenceStatistics();
    const hierarchyStats = await this.manager.getHierarchyStatistics();

    console.log('\n📈 Overall Statistics:');
    console.log(`  Total cross-references: ${stats.total_cross_references}`);
    console.log(`  Total issues: ${hierarchyStats.total_features + hierarchyStats.total_tasks}`);
    console.log(`  Features: ${hierarchyStats.total_features}`);
    console.log(`  Tasks: ${hierarchyStats.total_tasks}`);

    const avgRefsPerIssue = stats.total_cross_references / (hierarchyStats.total_features + hierarchyStats.total_tasks);
    console.log(`  Average refs/issue: ${avgRefsPerIssue.toFixed(2)}`);

    console.log('\n📊 References by Type:');
    stats.references_by_type.forEach(type => {
      console.log(`  ${type.reference_type}: ${type.count}`);
    });

    console.log('\n🔍 Consolidation Status:');
    stats.consolidation_opportunities.forEach(status => {
      console.log(`  ${status.consolidation_status}: ${status.count}`);
    });

    // Coverage analysis
    console.log('\n\n💡 Coverage Analysis:');
    if (stats.total_cross_references === 0) {
      console.log('  ⚠️  No cross-references found');
      console.log('  👉 Start adding cross-references to enable consolidation detection');
    } else if (avgRefsPerIssue < 1) {
      console.log('  ⚠️  Low coverage - many issues lack cross-references');
      console.log('  👉 Target: At least 1 cross-reference per issue');
    } else if (avgRefsPerIssue < 2) {
      console.log('  ✅ Good coverage - most issues have cross-references');
      console.log('  👉 Consider adding more references for better context');
    } else {
      console.log('  🎉 Excellent coverage - issues are well-documented');
      console.log('  👉 Focus on reviewing consolidation opportunities');
    }

    console.log('\n' + '=' .repeat(70) + '\n');
  }
}

// CLI Interface
async function main() {
  const consolidator = new IssueConsolidator();
  const command = process.argv[2] || 'report';

  try {
    switch(command) {
      case 'report':
        await consolidator.generateReport();
        break;

      case 'analyze':
        await consolidator.analyzeConsolidationOpportunities();
        break;

      case 'coverage':
        await consolidator.showCoverage();
        break;

      case 'wizard':
        await consolidator.runWizard();
        break;

      default:
        console.log('Issue Consolidation Utility\n');
        console.log('Usage:');
        console.log('  node issue-consolidator.js report    - Full consolidation report');
        console.log('  node issue-consolidator.js analyze   - Analyze opportunities only');
        console.log('  node issue-consolidator.js coverage  - Show cross-reference coverage');
        console.log('  node issue-consolidator.js wizard    - Interactive consolidation wizard');
        console.log('\nQuick commands:');
        console.log('  npm run db:xref:consolidations       - Show consolidation opportunities');
        console.log('  npm run db:xref:stats                - Show cross-reference statistics');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = IssueConsolidator;
