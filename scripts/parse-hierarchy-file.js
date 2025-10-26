#!/usr/bin/env node

/**
 * Script to parse hierarchical issue files and populate database
 * Reads .hi files and creates issues in the database
 */

const fs = require('fs');
const path = require('path');

// Import the hierarchical issue manager
const HierarchicalIssueManager = require('../db/hierarchical-issue-manager');

/**
 * Simple parser for .hi files
 * This is a basic implementation - for production use ANTLR generated parser
 */
class HierarchyFileParser {
  constructor() {
    this.currentArgument = null;
    this.currentFeature = null;
    this.currentParagraph = null;
  }

  /**
   * Parse a .hi file and return AST
   */
  parse(content) {
    const lines = content.split('\n');
    const ast = {
      arguments: []
    };

    let currentBlock = null;
    let blockStack = [];
    let currentObj = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and comments
      if (!line || line.startsWith('//')) continue;
      
      // Parse argument
      if (line.startsWith('argument ')) {
        const match = line.match(/argument\s+(\w+)\s*\{/);
        if (match) {
          currentObj = {
            type: 'argument',
            name: match[1],
            features: []
          };
          ast.arguments.push(currentObj);
          blockStack.push(currentObj);
        }
      }
      
      // Parse properties
      if (line.includes(':') && !line.includes('{')) {
        const match = line.match(/(\w+):\s*"([^"]*)"|(\w+):\s*(\w+);/);
        if (match && currentObj) {
          const key = match[1];
          const value = match[2] || match[4];
          currentObj[key] = value;
        }
      }
      
      // Parse feature
      if (line.startsWith('feature ')) {
        const match = line.match(/feature\s+(\d+)\s*\{/);
        if (match) {
          const parentArg = blockStack.find(b => b.type === 'argument');
          currentObj = {
            type: 'feature',
            number: parseInt(match[1]),
            paragraphs: []
          };
          if (parentArg) {
            parentArg.features.push(currentObj);
          }
          blockStack.push(currentObj);
        }
      }
      
      // Parse paragraph
      if (line.startsWith('paragraph ')) {
        const match = line.match(/paragraph\s+(\d+)\s*\{/);
        if (match) {
          const parentFeature = blockStack.find(b => b.type === 'feature');
          currentObj = {
            type: 'paragraph',
            number: parseInt(match[1]),
            tasks: []
          };
          if (parentFeature) {
            parentFeature.paragraphs.push(currentObj);
          }
          blockStack.push(currentObj);
        }
      }
      
      // Parse task
      if (line.startsWith('task ')) {
        const match = line.match(/task\s+(\d+)\s*\{/);
        if (match) {
          const parentParagraph = blockStack.find(b => b.type === 'paragraph');
          currentObj = {
            type: 'task',
            number: parseInt(match[1])
          };
          if (parentParagraph) {
            parentParagraph.tasks.push(currentObj);
          }
          blockStack.push(currentObj);
        }
      }
      
      // Handle closing braces
      if (line === '}') {
        blockStack.pop();
        currentObj = blockStack[blockStack.length - 1];
      }
    }

    return ast;
  }
}

/**
 * Populate database from AST
 */
async function populateFromAST(ast, manager) {
  console.log('📊 Populating database from parsed AST...\n');
  
  const stats = {
    arguments: 0,
    features: 0,
    paragraphs: 0,
    tasks: 0
  };

  for (const arg of ast.arguments) {
    console.log(`📚 Creating argument: ${arg.name}`);
    
    const argRecord = await manager.createLegalArgument(
      arg.name,
      arg.description || '',
      arg.type || 'defense',
      arg.strategy || ''
    );
    stats.arguments++;
    
    for (const feat of arg.features || []) {
      console.log(`  📊 Creating feature #${feat.number}: ${feat.title}`);
      
      const featRecord = await manager.createFeatureIssue(
        feat.number,
        feat.title || `Feature ${feat.number}`,
        feat.description || '',
        feat.priority || 'medium',
        argRecord.id
      );
      stats.features++;
      
      for (const para of feat.paragraphs || []) {
        console.log(`    📝 Creating paragraph ${para.number} (rank: ${para.rank}, weight: ${para.weight})`);
        
        const paraRecord = await manager.createParagraph(
          featRecord.id,
          para.number,
          para.title || `Paragraph ${para.number}`,
          para.content || '',
          parseInt(para.rank) || 1,
          parseInt(para.weight) || 50
        );
        stats.paragraphs++;
        
        for (const task of para.tasks || []) {
          console.log(`      ✓ Creating task #${task.number} (rank: ${task.rank}, weight: ${task.weight})`);
          
          await manager.createTaskIssue(
            task.number,
            task.title || `Task ${task.number}`,
            task.description || '',
            featRecord.id,
            paraRecord.id,
            parseInt(task.rank) || 1,
            parseInt(task.weight) || 50,
            task.priority || 'medium'
          );
          stats.tasks++;
        }
      }
    }
    console.log('');
  }

  return stats;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node parse-hierarchy-file.js <file.hi>');
    process.exit(1);
  }

  const filePath = args[0];
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`🔍 Parsing hierarchical issue file: ${filePath}\n`);
  
  // Read and parse file
  const content = fs.readFileSync(filePath, 'utf-8');
  const parser = new HierarchyFileParser();
  const ast = parser.parse(content);
  
  // Save AST to JSON
  const astPath = 'hierarchy-ast.json';
  fs.writeFileSync(astPath, JSON.stringify(ast, null, 2));
  console.log(`✅ AST saved to ${astPath}\n`);
  
  // If DATABASE_URL is set, populate database
  if (process.env.DATABASE_URL) {
    console.log('💾 DATABASE_URL found, populating database...\n');
    
    try {
      const manager = new HierarchicalIssueManager();
      const stats = await populateFromAST(ast, manager);
      
      console.log('\n📊 Population Statistics:');
      console.log(`  Arguments: ${stats.arguments}`);
      console.log(`  Features:  ${stats.features}`);
      console.log(`  Paragraphs: ${stats.paragraphs}`);
      console.log(`  Tasks:      ${stats.tasks}`);
      console.log('\n✨ Database population complete!');
      
      // Save stats
      fs.writeFileSync('parsed-stats.json', JSON.stringify(stats, null, 2));
      
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Error populating database:', error);
      process.exit(1);
    }
  } else {
    console.log('⚠️  No DATABASE_URL set, skipping database population');
    console.log('   Set DATABASE_URL to populate database from parsed file\n');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { HierarchyFileParser, populateFromAST };
