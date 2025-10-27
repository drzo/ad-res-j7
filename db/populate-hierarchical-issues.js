#!/usr/bin/env node

const HierarchicalIssueManager = require('./hierarchical-issue-manager');

/**
 * Populate Case 2025-137857 with Hierarchical Issue Structure
 * 
 * This demonstrates the complete hierarchical organization where:
 * - Legal arguments group feature-level issues
 * - Features have paragraphs ranked by influence
 * - Paragraphs contain task issues ranked by influence on the paragraph
 */
async function populateHierarchicalStructure() {
  const manager = new HierarchicalIssueManager();
  
  console.log('🏗️  Populating Hierarchical Issue Structure for Case 2025-137857\n');
  console.log('Structure: Legal Arguments → Features → Paragraphs → Task Issues\n');

  try {
    // ==========================================
    // LEGAL ARGUMENT 1: Revenue Stream Defense
    // ==========================================
    console.log('📚 Creating Legal Argument 1: Revenue Stream Defense\n');
    
    const revenueDefense = await manager.createLegalArgument(
      'Revenue Stream Legitimate Investment Defense',
      'Prove that RegimA Zone Ltd (UK) made a legitimate R1M investment while charging minimal admin fees, exposing Peter\'s appropriation fraud',
      'defense',
      'Demonstrate proper business structure with tax-compliant transfer pricing, proving respondents funded operations while Peter contributed nothing but appropriated everything'
    );
    console.log(`  ✅ Argument ID ${revenueDefense.id}: ${revenueDefense.argument_name}\n`);

    // ------------------------------------------
    // FEATURE 1.1: Payment Structure Analysis
    // ------------------------------------------
    console.log('  📊 Feature 1.1: Payment Structure Analysis');
    const feature1_1 = await manager.createFeatureIssue(
      1001,
      'Payment Structure Proves Legitimate Investment',
      'Analysis of RegimA Zone Ltd payment structure showing R1M investment vs R1K admin fee reveals legitimate business practice, not profiteering',
      'critical',
      revenueDefense.id
    );
    console.log(`    Feature Issue #${feature1_1.issue_number} created\n`);

    // Paragraph 1.1.1: Investment Amount Evidence (Highest Influence - Rank 1, Weight 100)
    console.log('    📝 Paragraph 1: Investment Amount Evidence (Rank 1, Weight 100)');
    const para1_1_1 = await manager.createParagraph(
      feature1_1.id,
      1,
      'RegimA Zone Ltd R1,000,000 Investment',
      'RegimA Zone Ltd (UK company owned by Dan & Jax) invested R1,000,000 into South African operations, funding all infrastructure, staff, and systems',
      1,  // Rank 1 - Highest influence on feature
      100 // Weight 100 - Critical to proving investment
    );

    // Task issues under Paragraph 1.1.1
    await manager.createTaskIssue(
      2001,
      'Document R1M bank transfer from RegimA Zone Ltd',
      'Obtain and attach bank records showing the R1,000,000 transfer from RegimA Zone Ltd UK to ZA operations',
      feature1_1.id,
      para1_1_1.id,
      1,   // Rank 1 within paragraph
      100, // Weight 100 - Most critical evidence
      'critical'
    );
    console.log('      ✅ Task #2001: Bank transfer documentation (Rank 1, Weight 100)');

    await manager.createTaskIssue(
      2002,
      'Compile investment allocation breakdown',
      'Detail how R1M was allocated: infrastructure, salaries, systems, operations',
      feature1_1.id,
      para1_1_1.id,
      2,   // Rank 2 within paragraph
      90,  // Weight 90 - Important supporting detail
      'high'
    );
    console.log('      ✅ Task #2002: Allocation breakdown (Rank 2, Weight 90)');

    await manager.createTaskIssue(
      2003,
      'Cross-reference investment with expense records',
      'Match investment amount with actual expenses incurred for business setup',
      feature1_1.id,
      para1_1_1.id,
      3,   // Rank 3 within paragraph
      85,  // Weight 85 - Corroborating evidence
      'high'
    );
    console.log('      ✅ Task #2003: Expense cross-reference (Rank 3, Weight 85)\n');

    // Paragraph 1.1.2: Admin Fee Structure (Rank 2, Weight 95)
    console.log('    📝 Paragraph 2: Admin Fee Structure (Rank 2, Weight 95)');
    const para1_1_2 = await manager.createParagraph(
      feature1_1.id,
      2,
      'R1,000 (0.1%) Admin Fee Structure',
      'Despite R1M investment, RegimA Zone Ltd charged only R1,000 admin fee (0.1%), proving no profiteering intent',
      2,  // Rank 2
      95  // Weight 95 - Critical for disproving profiteering claim
    );

    await manager.createTaskIssue(
      2004,
      'Document admin fee invoices',
      'Gather all invoices showing R1K admin fee structure',
      feature1_1.id,
      para1_1_2.id,
      1,
      100,
      'critical'
    );
    console.log('      ✅ Task #2004: Admin fee invoices (Rank 1, Weight 100)');

    await manager.createTaskIssue(
      2005,
      'Compare industry standard admin fees',
      'Research typical admin fees for similar business structures to prove 0.1% is exceptionally low',
      feature1_1.id,
      para1_1_2.id,
      2,
      80,
      'medium'
    );
    console.log('      ✅ Task #2005: Industry comparison (Rank 2, Weight 80)\n');

    // Paragraph 1.1.3: Tax Compliance (Rank 3, Weight 85)
    console.log('    📝 Paragraph 3: Tax Compliance Evidence (Rank 3, Weight 85)');
    const para1_1_3 = await manager.createParagraph(
      feature1_1.id,
      3,
      'Transfer Pricing Tax Compliance',
      'Structure complies with arm\'s-length transfer pricing rules, showing legitimate business practice',
      3,  // Rank 3
      85  // Weight 85 - Important for legitimacy
    );

    await manager.createTaskIssue(
      2006,
      'Obtain tax compliance certificates',
      'Get documentation proving structure meets transfer pricing requirements',
      feature1_1.id,
      para1_1_3.id,
      1,
      90,
      'high'
    );
    console.log('      ✅ Task #2006: Tax compliance docs (Rank 1, Weight 90)');

    await manager.createTaskIssue(
      2007,
      'Reference SARS transfer pricing guidelines',
      'Show structure aligns with SARS requirements for international transactions',
      feature1_1.id,
      para1_1_3.id,
      2,
      75,
      'medium'
    );
    console.log('      ✅ Task #2007: SARS guidelines reference (Rank 2, Weight 75)\n');

    // ------------------------------------------
    // FEATURE 1.2: Peter's Zero Investment
    // ------------------------------------------
    console.log('  📊 Feature 1.2: Peter\'s Zero Investment Exposure');
    const feature1_2 = await manager.createFeatureIssue(
      1002,
      'Peter Made Zero Investment But Appropriated Everything',
      'Contrast Peter\'s zero financial contribution with his appropriation of R1M+ funded operations',
      'critical',
      revenueDefense.id
    );
    console.log(`    Feature Issue #${feature1_2.issue_number} created\n`);

    // Paragraph 1.2.1: No Capital Contribution (Rank 1, Weight 100)
    console.log('    📝 Paragraph 1: No Capital Contribution Evidence (Rank 1, Weight 100)');
    const para1_2_1 = await manager.createParagraph(
      feature1_2.id,
      1,
      'Peter Made No Financial Investment',
      'Peter contributed R0 to business operations while Dan & Jax invested R1M through RegimA Zone Ltd',
      1,
      100
    );

    await manager.createTaskIssue(
      2008,
      'Document Peter\'s zero capital contributions',
      'Show bank records proving Peter made no investments in the business',
      feature1_2.id,
      para1_2_1.id,
      1,
      100,
      'critical'
    );
    console.log('      ✅ Task #2008: Zero contribution proof (Rank 1, Weight 100)');

    await manager.createTaskIssue(
      2009,
      'Timeline of who funded what',
      'Create timeline showing all funding came from Dan & Jax, nothing from Peter',
      feature1_2.id,
      para1_2_1.id,
      2,
      95,
      'high'
    );
    console.log('      ✅ Task #2009: Funding timeline (Rank 2, Weight 95)\n');

    // Paragraph 1.2.2: Appropriation Acts (Rank 2, Weight 98)
    console.log('    📝 Paragraph 2: Peter\'s Appropriation Acts (Rank 2, Weight 98)');
    const para1_2_2 = await manager.createParagraph(
      feature1_2.id,
      2,
      'Peter Appropriated All Assets He Never Funded',
      'Peter seized control of business operations, systems, and revenue streams funded entirely by others',
      2,
      98
    );

    await manager.createTaskIssue(
      2010,
      'Document card cancellations',
      'Show how Peter cancelled business cards to cut off access',
      feature1_2.id,
      para1_2_2.id,
      1,
      100,
      'critical'
    );
    console.log('      ✅ Task #2010: Card cancellation docs (Rank 1, Weight 100)');

    await manager.createTaskIssue(
      2011,
      'Document email control seizure',
      'Evidence of Peter taking control of business email systems',
      feature1_2.id,
      para1_2_2.id,
      2,
      95,
      'critical'
    );
    console.log('      ✅ Task #2011: Email hijacking evidence (Rank 2, Weight 95)');

    await manager.createTaskIssue(
      2012,
      'Quantify R10.227M+ losses from appropriation',
      'Calculate financial harm from Peter\'s actions',
      feature1_2.id,
      para1_2_2.id,
      3,
      90,
      'high'
    );
    console.log('      ✅ Task #2012: Loss quantification (Rank 3, Weight 90)\n');

    // ==========================================
    // LEGAL ARGUMENT 2: Bad Faith Litigation
    // ==========================================
    console.log('📚 Creating Legal Argument 2: Bad Faith Litigation\n');
    
    const badFaithArg = await manager.createLegalArgument(
      'Peter\'s Bad Faith Strategic Delay',
      'Expose Peter\'s strategic delays and document destruction to undermine respondents\' defense',
      'counterclaim',
      'Timeline analysis shows Peter deliberately delayed proceedings while causing maximum business harm'
    );
    console.log(`  ✅ Argument ID ${badFaithArg.id}: ${badFaithArg.argument_name}\n`);

    // Feature 2.1: Timeline Analysis
    console.log('  📊 Feature 2.1: Timeline Evidence of Bad Faith');
    const feature2_1 = await manager.createFeatureIssue(
      1003,
      'Timeline Proves Strategic Delay',
      'Chronological analysis of Peter\'s actions demonstrates calculated delay tactics',
      'critical',
      badFaithArg.id
    );
    console.log(`    Feature Issue #${feature2_1.issue_number} created\n`);

    // Paragraph 2.1.1: Document Destruction Timeline (Rank 1, Weight 100)
    console.log('    📝 Paragraph 1: Document Destruction Timeline (Rank 1, Weight 100)');
    const para2_1_1 = await manager.createParagraph(
      feature2_1.id,
      1,
      'Peter Destroyed Documents Then Claimed Respondents Lacked Evidence',
      'Timeline shows Peter cancelled cards/emails, then filed interdict claiming respondents couldn\'t prove ownership',
      1,
      100
    );

    await manager.createTaskIssue(
      2013,
      'Map destruction to interdict timing',
      'Show how document destruction preceded interdict filing',
      feature2_1.id,
      para2_1_1.id,
      1,
      100,
      'critical'
    );
    console.log('      ✅ Task #2013: Timeline mapping (Rank 1, Weight 100)\n');

    // ==========================================
    // STATISTICS AND SUMMARY
    // ==========================================
    console.log('=' .repeat(60));
    console.log('\n📊 HIERARCHICAL STRUCTURE STATISTICS\n');
    
    const stats = await manager.getHierarchyStatistics();
    console.log('Totals:');
    console.log(`  Legal Arguments: ${stats.total_arguments}`);
    console.log(`  Feature Issues:  ${stats.total_features}`);
    console.log(`  Paragraphs:      ${stats.total_paragraphs}`);
    console.log(`  Task Issues:     ${stats.total_tasks}`);

    // Show hierarchy for Revenue Defense
    console.log('\n' + '='.repeat(60));
    console.log('\n🔍 COMPLETE HIERARCHY: Revenue Stream Defense\n');
    
    const hierarchy = await manager.getArgumentHierarchy(revenueDefense.id);
    
    console.log(`📚 ${hierarchy.argument.argument_name}`);
    console.log(`   Strategy: ${hierarchy.argument.strategy}\n`);
    
    for (const feature of hierarchy.features) {
      console.log(`  📊 Feature #${feature.issue_number}: ${feature.title}`);
      
      const strength = await manager.calculateFeatureStrength(feature.id);
      console.log(`     💪 Calculated Strength: ${strength.toFixed(2)}%\n`);
      
      for (const paragraph of feature.paragraphs) {
        console.log(`    📝 Paragraph ${paragraph.paragraph_number} (Rank ${paragraph.rank_order}, Weight ${paragraph.weight})`);
        console.log(`       ${paragraph.title}`);
        console.log(`       Issues (${paragraph.issues.length}):`);
        
        paragraph.issues.forEach(issue => {
          console.log(`         • #${issue.issue_number} [Rank ${issue.para_rank}, Weight ${issue.para_weight}] ${issue.title}`);
        });
        console.log('');
      }
    }

    console.log('=' .repeat(60));
    console.log('\n✨ Hierarchical structure population complete!\n');
    console.log('💡 Key Features:');
    console.log('   ✅ Legal arguments group related feature issues');
    console.log('   ✅ Features organize by coherent legal strategy');
    console.log('   ✅ Paragraphs ranked by influence on feature strength');
    console.log('   ✅ Task issues ranked by influence on paragraph');
    console.log('   ✅ Weights enable aggregate strength calculations');
    console.log('   ✅ Full hierarchy queryable for analysis\n');

  } catch (error) {
    console.error('❌ Error populating hierarchy:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  populateHierarchicalStructure()
    .then(() => {
      console.log('🎉 Population complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Population failed:', error);
      process.exit(1);
    });
}

module.exports = populateHierarchicalStructure;
