#!/usr/bin/env node

const HypergraphManager = require('./hypergraph-manager');
const CaseManager = require('./case-manager');

/**
 * Populate Hypergraph with Case 2025-137857 Data
 * This creates a comprehensive knowledge graph of the case
 */
async function populateCaseHypergraph() {
  const hg = new HypergraphManager();
  const cm = new CaseManager();
  
  console.log('🔗 Populating Hypergraph for Case 2025-137857\n');

  try {
    // ===== CREATE PEOPLE NODES =====
    console.log('👥 Creating people nodes...');
    const peter = await hg.createNode('person', 'Peter Andrew Faucitt', 'peter_faucitt', 'Applicant');
    const jacqui = await hg.createNode('person', 'Jacqueline Faucitt', 'jacqui_faucitt', 'First Respondent');
    const daniel = await hg.createNode('person', 'Daniel James Faucitt', 'daniel_faucitt', 'Second Respondent');
    const bantjies = await hg.createNode('person', 'Daniel Bantjies', 'daniel_bantjies', 'Accountant/Trustee');
    console.log(`  ✅ Created ${[peter, jacqui, daniel, bantjies].length} people nodes`);

    // ===== CREATE CRITICAL ISSUE NODES =====
    console.log('\n📋 Creating critical issue nodes...');
    const issue841 = await hg.createNode('issue', 'Seventh material non-disclosure', '841', 'Disproportionate harm not disclosed', { priority: 'critical' });
    const issue840 = await hg.createNode('issue', 'Section 13B quantification', '840', 'Detailed harm quantification needed', { priority: 'critical' });
    const issue836 = await hg.createNode('issue', "Peter's Causation section", '836', "Peter's actions caused documentation gaps", { priority: 'critical' });
    const issue835 = await hg.createNode('issue', 'JF8A Documentation Log', '835', 'Comprehensive documentation log needed', { priority: 'critical' });
    const issue825 = await hg.createNode('issue', "Timeline analysis - Peter's bad faith", '825', 'Demonstrate strategic delay', { priority: 'critical' });
    const issue805 = await hg.createNode('issue', "Daniel's witness statement", '805', '"Has anything changed?" exchange', { priority: 'critical' });
    console.log('  ✅ Created 6 critical issue nodes');

    // ===== CREATE EVIDENCE NODES =====
    console.log('\n🔍 Creating evidence nodes...');
    const bankRecords = await hg.createNode('evidence', 'FNB/ABSA Bank Records', 'bank_records_2025', '5 months of statements', { type: 'financial' });
    const shopifyReports = await hg.createNode('evidence', 'Shopify Revenue Reports', 'shopify_reports', 'Sales data for 3 stores', { type: 'financial' });
    const emailLog = await hg.createNode('evidence', 'Email Documentation Log', 'email_log_jf8a', 'All emails to Peter', { type: 'correspondence' });
    const itExpenses = await hg.createNode('evidence', 'IT Infrastructure Expenses', 'it_expenses', 'Detailed IT cost breakdown', { type: 'financial' });
    const interdict = await hg.createNode('evidence', 'Interdict Order', 'interdict_2025', 'Court interdict against respondents', { type: 'legal' });
    console.log('  ✅ Created 5 evidence nodes');

    // ===== CREATE DOCUMENT NODES =====
    console.log('\n📄 Creating document nodes...');
    const affidavit = await hg.createNode('document', 'Answering Affidavit - Jacqueline', 'jax_affidavit', 'Main answering affidavit');
    const section13B = await hg.createNode('document', 'Section 13B - Harm Quantification', 'section_13b', 'Disproportionate harm analysis');
    const timeline = await hg.createNode('document', 'Timeline Analysis', 'timeline_doc', "Peter's strategic delay analysis");
    console.log('  ✅ Created 3 document nodes');

    // ===== CREATE EVENT NODES =====
    console.log('\n📅 Creating event nodes...');
    const cardCancellation = await hg.createNode('event', 'Card Cancellations', 'event_card_cancel', 'Peter cancelled business cards', { date: '2025-05' });
    const emailHijack = await hg.createNode('event', 'Email Control Seizure', 'event_email_hijack', 'Peter took control of emails', { date: '2025-05' });
    const interdictFiling = await hg.createNode('event', 'Interdict Application', 'event_interdict', 'Peter filed interdict', { date: '2025-09-30' });
    const businessDisruption = await hg.createNode('event', 'Business Operations Disruption', 'event_disruption', 'R18M+ in losses', { date: '2025-06' });
    console.log('  ✅ Created 4 event nodes');

    // ===== CREATE RELATIONSHIPS =====
    console.log('\n🔗 Creating relationships...\n');

    // People relationships
    console.log('  Creating people relationships...');
    await hg.createEdge('opposes', 'Legal Opposition', [
      { nodeId: peter.id, role: 'applicant' },
      { nodeId: jacqui.id, role: 'respondent' },
      { nodeId: daniel.id, role: 'respondent' }
    ], 100, 'directed', { case: '2025-137857' });

    await hg.createEdge('collaborates_with', 'Trustee Relationship', [
      { nodeId: peter.id, role: 'principal' },
      { nodeId: bantjies.id, role: 'trustee' }
    ], 80, 'directed', { suspicious: true });

    // Evidence supports issues
    console.log('  Linking evidence to issues...');
    await hg.linkEvidenceToIssue(bankRecords.id, issue840.id, 'supports', 95);
    await hg.linkEvidenceToIssue(shopifyReports.id, issue840.id, 'supports', 90);
    await hg.linkEvidenceToIssue(emailLog.id, issue835.id, 'supports', 100);
    await hg.linkEvidenceToIssue(itExpenses.id, issue840.id, 'supports', 85);
    await hg.linkEvidenceToIssue(interdict.id, issue841.id, 'references', 100);

    // Causation chains
    console.log('  Creating causation chains...');
    await hg.createEdge('caused_by', 'Peter caused documentation gaps', [
      { nodeId: cardCancellation.id, role: 'cause' },
      { nodeId: emailHijack.id, role: 'cause' },
      { nodeId: issue836.id, role: 'effect' }
    ], 95, 'directed');

    await hg.createEdge('caused', 'Business harm causation', [
      { nodeId: interdictFiling.id, role: 'cause' },
      { nodeId: businessDisruption.id, role: 'effect' }
    ], 90, 'directed');

    // Timeline relationships
    console.log('  Creating timeline sequence...');
    await hg.createTimelineRelation([
      cardCancellation.id,
      emailHijack.id,
      interdictFiling.id,
      businessDisruption.id
    ], 'chronological');

    // Document references
    console.log('  Linking document references...');
    await hg.linkDocumentReferences(affidavit.id, [
      section13B.id,
      timeline.id
    ], 'contains');

    await hg.linkDocumentReferences(section13B.id, [
      bankRecords.id,
      shopifyReports.id,
      itExpenses.id
    ], 'cites_evidence');

    // Contradictions
    console.log('  Identifying contradictions...');
    const peterClaim = await hg.createNode('claim', "Peter's urgency claim", 'claim_urgency', 'Claimed urgent need for interdict');
    await hg.createEdge('contradicts', 'Timeline contradicts urgency', [
      { nodeId: timeline.id, role: 'evidence' },
      { nodeId: peterClaim.id, role: 'claim' }
    ], 100, 'directed');

    // ===== QUERY AND ANALYZE =====
    console.log('\n📊 Analyzing hypergraph...\n');

    const stats = await hg.getStatistics();
    console.log('Graph Statistics:');
    console.log(`  Total Nodes: ${stats.total_nodes}`);
    console.log(`  Total Edges: ${stats.total_edges}`);
    console.log(`  Total Relations: ${stats.total_relations}`);
    
    console.log('\n  Node Types:');
    stats.node_types.forEach(type => {
      console.log(`    - ${type.node_type}: ${type.count}`);
    });
    
    console.log('\n  Edge Types:');
    stats.edge_types.forEach(type => {
      console.log(`    - ${type.edge_type}: ${type.count}`);
    });

    // Find evidence for Issue #840
    console.log('\n\n🔍 Evidence supporting Issue #840 (Section 13B):');
    const issue840Evidence = await hg.getIssueEvidence(issue840.id);
    issue840Evidence.forEach(ev => {
      console.log(`  ✅ ${ev.label} (${ev.node_type})`);
    });

    // Find what Peter caused
    console.log('\n\n⚠️  Effects caused by Peter:');
    const peterEffects = await hg.getConnectedNodes(peter.id, 'opposes');
    peterEffects.forEach(effect => {
      console.log(`  - ${effect.label} (${effect.node_type})`);
    });

    // Find path from evidence to issue
    console.log('\n\n🛤️  Path from Bank Records to Issue #840:');
    const path = await hg.findPath(bankRecords.id, issue840.id);
    if (path) {
      console.log(`  Found path with ${path.depth} steps`);
      console.log(`  Path: ${path.path.join(' → ')}`);
    }

    console.log('\n\n✨ Hypergraph population complete!');
    console.log('\n💡 You can now:');
    console.log('  - Query complex relationships across the case');
    console.log('  - Trace evidence chains and causation');
    console.log('  - Find contradictions and support patterns');
    console.log('  - Visualize the case structure');
    
  } catch (error) {
    console.error('❌ Error populating hypergraph:', error);
    process.exit(1);
  }
}

populateCaseHypergraph();