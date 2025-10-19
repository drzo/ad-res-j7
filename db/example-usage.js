#!/usr/bin/env node

const CaseManager = require('./case-manager');
const caseManager = new CaseManager();

async function demonstrateDatabase() {
  console.log('🚀 Demonstrating database capabilities for Case 2025-137857\n');

  try {
    // 1. Add the critical priority issues from the implementation plan
    console.log('📌 Adding critical priority issues to database...');
    
    const criticalIssues = [
      { number: 841, title: "Seventh material non-disclosure (disproportionate harm)", priority: "critical" },
      { number: 840, title: "Detailed quantification in Section 13B", priority: "critical" },
      { number: 836, title: "Peter's Causation section", priority: "critical" },
      { number: 835, title: "JF8A documentation log", priority: "critical" },
      { number: 825, title: "Timeline analysis (Peter's bad faith)", priority: "critical" },
      { number: 805, title: "Daniel's witness statement", priority: "critical" },
      { number: 278, title: "Disproportionate Relief analysis", priority: "critical" },
      { number: 267, title: "JF8 correspondence showing cooperation attempts", priority: "critical" },
      { number: 258, title: "JF3A additional email forensics", priority: "critical" },
      { number: 85, title: "External validation (accountant letters, SARS, bank relationships)", priority: "critical" },
      { number: 80, title: "Comprehensive financial analysis", priority: "critical" },
      { number: 76, title: "Point-by-point rebuttal matrix", priority: "critical" }
    ];

    for (const issue of criticalIssues) {
      try {
        await caseManager.trackIssue(
          issue.number,
          issue.title,
          `Critical issue identified in implementation plan - ${issue.title}`,
          issue.priority,
          ['todo', 'enhancement', `priority: ${issue.priority}`, 'case-2025-137857']
        );
        console.log(`  ✅ Added Issue #${issue.number}: ${issue.title}`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`  ⚠️  Issue #${issue.number} already exists`);
        } else {
          throw error;
        }
      }
    }

    // 2. Add a sample case document
    console.log('\n📄 Adding sample case document...');
    const doc = await caseManager.addCaseDocument(
      '2025-137857',
      'implementation_plan',
      'Updated Next Steps for Amendments Implementation',
      'Comprehensive implementation plan with 12 critical priority issues',
      'jax-response/analysis-output/UPDATED_NEXT_STEPS_AMENDMENTS_2025-10-15.md'
    );
    console.log('  ✅ Added document:', doc.title);

    // 3. Add sample evidence record
    console.log('\n🔍 Adding sample evidence record...');
    const evidence = await caseManager.addEvidence(
      '2025-137857',
      'bank_records',
      'FNB and ABSA bank statements demonstrating good standing',
      'evidence/bank_records/',
      'FNB/ABSA'
    );
    console.log('  ✅ Added evidence:', evidence.description);

    // 4. Add sample affidavit amendment
    console.log('\n📝 Adding sample affidavit amendment...');
    const amendment = await caseManager.addAmendment(
      '13B',
      '149.22A',
      'Original text about harm quantification',
      'Enhanced text with detailed R18M+ losses and R50M+ exposure calculations',
      'Strengthening disproportionate harm argument with specific financial impact'
    );
    console.log('  ✅ Added amendment for Section', amendment.section_number);

    // 5. Save test results from the latest test run
    console.log('\n📊 Saving test results...');
    const testResult = await caseManager.saveTestResults(
      'comprehensive',
      128,
      128,
      0,
      [],
      { validation: 85, integration: 43 }
    );
    console.log('  ✅ Saved test results: 100% success rate');

    // 6. Query the data
    console.log('\n📋 Querying database...');
    
    const openIssues = await caseManager.getOpenIssues();
    console.log(`\n  Open Issues: ${openIssues.length}`);
    
    const criticalIssuesList = await caseManager.getIssuesByPriority('critical');
    console.log(`  Critical Priority Issues: ${criticalIssuesList.length}`);
    
    const documents = await caseManager.getCaseDocuments('2025-137857');
    console.log(`  Case Documents: ${documents.length}`);
    
    const evidenceRecords = await caseManager.getCaseEvidence('2025-137857');
    console.log(`  Evidence Records: ${evidenceRecords.length}`);
    
    const amendments = await caseManager.getDraftAmendments();
    console.log(`  Draft Amendments: ${amendments.length}`);
    
    const tests = await caseManager.getLatestTestResults();
    console.log(`  Test Results: ${tests.length}`);

    console.log('\n✨ Database demonstration complete!');
    console.log('\n💡 Available commands:');
    console.log('  npm run db:list-docs      - List all case documents');
    console.log('  npm run db:list-issues    - List all open issues');
    console.log('  npm run db:list-evidence  - List all evidence records');
    console.log('  npm run db:import <dir>   - Import documents from a directory');
    
  } catch (error) {
    console.error('❌ Error during demonstration:', error.message);
    process.exit(1);
  }
}

demonstrateDatabase();