#!/usr/bin/env node

/**
 * Batch script to populate multiple hierarchical issue structures
 * Useful for setting up entire case hierarchies at once
 */

const HierarchicalIssueManager = require('../db/hierarchical-issue-manager');
const fs = require('fs');
const path = require('path');

/**
 * Predefined issue structures for common legal arguments
 */
const TEMPLATES = {
  'revenue-stream-defense': {
    argument: {
      name: 'Revenue Stream Defense',
      description: 'Prove RegimA Zone Ltd made legitimate R1M investment',
      type: 'defense',
      strategy: 'Demonstrate proper business structure with tax-compliant transfer pricing'
    },
    features: [
      {
        number: 1001,
        title: 'Payment Structure Analysis',
        description: 'Analyze R1M investment vs R1K admin fee',
        priority: 'critical',
        paragraphs: [
          {
            number: 1,
            title: 'R1M Investment Evidence',
            content: 'RegimA Zone Ltd invested R1,000,000',
            rank: 1,
            weight: 100,
            tasks: [
              { number: 2001, title: 'Document bank transfer', rank: 1, weight: 100, priority: 'critical' },
              { number: 2002, title: 'Allocation breakdown', rank: 2, weight: 90, priority: 'high' }
            ]
          }
        ]
      }
    ]
  },
  
  'bad-faith-litigation': {
    argument: {
      name: 'Bad Faith Litigation',
      description: 'Expose strategic delays and document destruction',
      type: 'counterclaim',
      strategy: 'Timeline analysis shows deliberate delay tactics'
    },
    features: [
      {
        number: 1003,
        title: 'Timeline Evidence of Bad Faith',
        description: 'Chronological analysis of calculated delay tactics',
        priority: 'critical',
        paragraphs: [
          {
            number: 1,
            title: 'Document Destruction Timeline',
            content: 'Peter destroyed documents then claimed lack of evidence',
            rank: 1,
            weight: 100,
            tasks: [
              { number: 2013, title: 'Map destruction to interdict timing', rank: 1, weight: 100, priority: 'critical' }
            ]
          }
        ]
      }
    ]
  }
};

/**
 * Populate a single template
 */
async function populateTemplate(manager, templateName, template) {
  console.log(`\n📚 Populating template: ${templateName}`);
  console.log(`   Argument: ${template.argument.name}\n`);
  
  // Create argument
  const arg = await manager.createLegalArgument(
    template.argument.name,
    template.argument.description,
    template.argument.type,
    template.argument.strategy
  );
  console.log(`✅ Created argument #${arg.id}: ${arg.argument_name}`);
  
  const stats = {
    features: 0,
    paragraphs: 0,
    tasks: 0
  };
  
  // Create features
  for (const feat of template.features) {
    const feature = await manager.createFeatureIssue(
      feat.number,
      feat.title,
      feat.description,
      feat.priority,
      arg.id
    );
    console.log(`  📊 Created feature #${feat.number}: ${feat.title}`);
    stats.features++;
    
    // Create paragraphs
    for (const para of feat.paragraphs) {
      const paragraph = await manager.createParagraph(
        feature.id,
        para.number,
        para.title,
        para.content,
        para.rank,
        para.weight
      );
      console.log(`    📝 Created paragraph ${para.number} (rank: ${para.rank}, weight: ${para.weight})`);
      stats.paragraphs++;
      
      // Create tasks
      for (const task of para.tasks) {
        await manager.createTaskIssue(
          task.number,
          task.title,
          task.title, // description
          feature.id,
          paragraph.id,
          task.rank,
          task.weight,
          task.priority
        );
        console.log(`      ✓ Created task #${task.number} (rank: ${task.rank}, weight: ${task.weight})`);
        stats.tasks++;
      }
    }
  }
  
  return { arg, stats };
}

/**
 * Load custom template from JSON file
 */
function loadCustomTemplate(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading template from ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Main batch populate function
 */
async function batchPopulate(options = {}) {
  const {
    templates = [],
    customFiles = [],
    clearExisting = false
  } = options;
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set');
    process.exit(1);
  }
  
  console.log('🚀 Batch Populate Hierarchical Issues\n');
  
  const manager = new HierarchicalIssueManager();
  const results = [];
  
  // Populate predefined templates
  for (const templateName of templates) {
    if (TEMPLATES[templateName]) {
      const result = await populateTemplate(manager, templateName, TEMPLATES[templateName]);
      results.push({ templateName, ...result });
    } else {
      console.warn(`⚠️  Template '${templateName}' not found`);
    }
  }
  
  // Populate custom templates
  for (const filePath of customFiles) {
    const template = loadCustomTemplate(filePath);
    if (template) {
      const templateName = path.basename(filePath, path.extname(filePath));
      const result = await populateTemplate(manager, templateName, template);
      results.push({ templateName, ...result });
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 BATCH POPULATION SUMMARY\n');
  
  const totals = results.reduce((acc, r) => ({
    arguments: acc.arguments + 1,
    features: acc.features + r.stats.features,
    paragraphs: acc.paragraphs + r.stats.paragraphs,
    tasks: acc.tasks + r.stats.tasks
  }), { arguments: 0, features: 0, paragraphs: 0, tasks: 0 });
  
  console.log(`Arguments:  ${totals.arguments}`);
  console.log(`Features:   ${totals.features}`);
  console.log(`Paragraphs: ${totals.paragraphs}`);
  console.log(`Tasks:      ${totals.tasks}`);
  console.log('='.repeat(60) + '\n');
  
  // Save results
  const reportPath = 'batch-populate-report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    results,
    totals
  }, null, 2));
  console.log(`📄 Report saved to ${reportPath}\n`);
  
  return results;
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'list-templates':
      console.log('Available templates:');
      Object.keys(TEMPLATES).forEach(name => {
        console.log(`  - ${name}`);
      });
      break;
      
    case 'populate':
      const templates = args.slice(1).filter(a => !a.endsWith('.json'));
      const customFiles = args.slice(1).filter(a => a.endsWith('.json'));
      
      await batchPopulate({
        templates,
        customFiles
      });
      break;
      
    case 'populate-all':
      await batchPopulate({
        templates: Object.keys(TEMPLATES)
      });
      break;
      
    default:
      console.log('Batch Populate Hierarchical Issues\n');
      console.log('Usage:');
      console.log('  node batch-populate.js list-templates');
      console.log('  node batch-populate.js populate <template1> <template2> [custom.json]');
      console.log('  node batch-populate.js populate-all\n');
      console.log('Examples:');
      console.log('  node batch-populate.js populate revenue-stream-defense');
      console.log('  node batch-populate.js populate revenue-stream-defense bad-faith-litigation');
      console.log('  node batch-populate.js populate custom-argument.json');
  }
  
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { batchPopulate, TEMPLATES, populateTemplate };
