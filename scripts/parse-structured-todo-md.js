#!/usr/bin/env node

/**
 * Parse structured-todo.md and convert to structured-todo.json
 * 
 * This script takes the pre-generated structured-todo.md file (markdown format)
 * and converts it to the JSON format expected by generate-hierarchical-issues.js
 */

const fs = require('fs');
const path = require('path');

class StructuredTodoMdParser {
  constructor() {
    this.legalArguments = [];
    this.features = [];
    this.paragraphs = [];
    this.tasks = [];
    this.metadata = {};
  }

  /**
   * Parse the structured-todo.md file
   */
  parse(filePath) {
    console.log(`📄 Reading ${filePath}...`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let currentArgument = null;
    let currentFeature = null;
    let currentParagraph = null;
    let inMetadata = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Parse metadata section
      if (line.startsWith('**Generated:**')) {
        this.metadata.generated_at = line.split('**Generated:**')[1].trim();
        inMetadata = true;
        continue;
      }
      if (line.startsWith('**Parser Version:**')) {
        this.metadata.parser_version = line.split('**Parser Version:**')[1].trim();
        continue;
      }
      if (line.startsWith('**Schema Version:**')) {
        this.metadata.schema_version = line.split('**Schema Version:**')[1].trim();
        continue;
      }

      // Parse summary statistics
      if (line.startsWith('- **Total Legal Arguments:**')) {
        this.metadata.total_arguments = parseInt(line.match(/\d+/)[0]);
        continue;
      }
      if (line.startsWith('- **Total Features:**')) {
        this.metadata.total_features = parseInt(line.match(/\d+/)[0]);
        continue;
      }
      if (line.startsWith('- **Total Paragraphs:**')) {
        this.metadata.total_paragraphs = parseInt(line.match(/\d+/)[0]);
        continue;
      }
      if (line.startsWith('- **Total Tasks:**')) {
        this.metadata.total_tasks = parseInt(line.match(/\d+/)[0]);
        continue;
      }

      // Parse legal arguments (### arg_N:)
      const argMatch = line.match(/^### (arg_\d+): (.+)$/);
      if (argMatch) {
        const argumentId = argMatch[1];
        const argumentName = argMatch[2];
        currentArgument = {
          id: argumentId,
          name: argumentName,
          description: '',
          type: 'defense',
          strategy: 'Support legal position',
          source: ''
        };
        this.legalArguments.push(currentArgument);
        currentFeature = null;
        currentParagraph = null;
        continue;
      }

      // Parse argument metadata
      if (currentArgument && line.startsWith('**Type:**')) {
        currentArgument.type = line.split('**Type:**')[1].trim().toLowerCase();
        continue;
      }
      if (currentArgument && line.startsWith('**Strategy:**')) {
        currentArgument.strategy = line.split('**Strategy:**')[1].trim();
        continue;
      }
      if (currentArgument && line.startsWith('**Source:**')) {
        currentArgument.source = line.split('**Source:**')[1].trim();
        continue;
      }
      if (currentArgument && line.startsWith('**Description:**')) {
        currentArgument.description = line.split('**Description:**')[1].trim();
        continue;
      }

      // Parse features (##### feature_N:)
      const featureMatch = line.match(/^##### (feature_\d+): (.+)$/);
      if (featureMatch) {
        const featureId = featureMatch[1];
        const featureTitle = featureMatch[2];
        currentFeature = {
          id: featureId,
          title: featureTitle,
          description: '',
          priority: 'medium',
          argumentId: currentArgument ? currentArgument.id : null,
          source: '',
          lineNumber: i + 1,
          paragraphs: []
        };
        this.features.push(currentFeature);
        currentParagraph = null;
        continue;
      }

      // Parse feature metadata
      if (currentFeature && line.startsWith('**Priority:**')) {
        currentFeature.priority = line.split('**Priority:**')[1].trim().toLowerCase();
        continue;
      }
      if (currentFeature && line.startsWith('**Source:**')) {
        currentFeature.source = line.split('**Source:**')[1].trim();
        continue;
      }
      if (currentFeature && line.startsWith('**Description:**')) {
        currentFeature.description = line.split('**Description:**')[1].trim();
        continue;
      }

      // Parse paragraphs (- **para_N** -)
      const paraMatch = line.match(/^- \*\*(para_\d+)\*\* - (.+?) \(Rank: (\d+), Weight: (\d+)\)$/);
      if (paraMatch) {
        const paragraphId = paraMatch[1];
        const paragraphTitle = paraMatch[2];
        const rank = parseInt(paraMatch[3]);
        const weight = parseInt(paraMatch[4]);
        
        currentParagraph = {
          id: paragraphId,
          featureId: currentFeature ? currentFeature.id : null,
          number: rank,
          title: paragraphTitle,
          content: '',
          rankOrder: rank,
          weight: weight,
          source: currentFeature ? currentFeature.source : '',
          lineNumber: i + 1,
          tasks: []
        };
        this.paragraphs.push(currentParagraph);
        if (currentFeature) {
          currentFeature.paragraphs.push(currentParagraph);
        }
        continue;
      }

      // Parse paragraph content
      if (currentParagraph && line.startsWith('  - Content:')) {
        currentParagraph.content = line.split('Content:')[1].trim();
        continue;
      }
      if (currentParagraph && line.startsWith('  - Source:')) {
        currentParagraph.source = line.split('Source:')[1].trim();
        continue;
      }

      // Parse tasks (- [ ] **task_N**:)
      const taskMatch = line.match(/^    - \[(.)\] \*\*(task_\d+)\*\*: (.+)$/);
      if (taskMatch) {
        const completed = taskMatch[1] === 'x';
        const taskId = taskMatch[2];
        const taskTitle = taskMatch[3];
        
        // Look ahead for task metadata
        const task = {
          id: taskId,
          paragraphId: currentParagraph ? currentParagraph.id : null,
          featureId: currentFeature ? currentFeature.id : null,
          title: taskTitle,
          description: taskTitle,
          rankOrder: 1,
          weight: 100,
          priority: 'medium',
          source: currentParagraph ? currentParagraph.source : '',
          lineNumber: i + 1,
          completed: completed
        };
        
        // Parse next line for metadata
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          const metaMatch = nextLine.match(/^\s+- Rank: (\d+), Weight: (\d+), Priority: (\w+)$/);
          if (metaMatch) {
            task.rankOrder = parseInt(metaMatch[1]);
            task.weight = parseInt(metaMatch[2]);
            task.priority = metaMatch[3].toLowerCase();
            i++; // Skip the metadata line
          }
          
          // Check for source line
          if (i + 1 < lines.length) {
            const sourceLine = lines[i + 1];
            const sourceMatch = sourceLine.match(/^\s+- Source: (.+)$/);
            if (sourceMatch) {
              task.source = sourceMatch[1].trim();
              i++; // Skip the source line
            }
          }
        }
        
        this.tasks.push(task);
        if (currentParagraph) {
          currentParagraph.tasks.push(task);
        }
        continue;
      }
    }

    console.log(`✅ Parsed ${this.legalArguments.length} legal arguments, ${this.features.length} features, ${this.paragraphs.length} paragraphs, ${this.tasks.length} tasks`);
  }

  /**
   * Generate statistics
   */
  generateStatistics() {
    const stats = {
      by_priority: {
        critical: this.tasks.filter(t => t.priority === 'critical').length,
        high: this.tasks.filter(t => t.priority === 'high').length,
        medium: this.tasks.filter(t => t.priority === 'medium').length,
        low: this.tasks.filter(t => t.priority === 'low').length
      },
      by_argument: this.legalArguments.map(arg => ({
        argument: arg.name,
        features: this.features.filter(f => f.argumentId === arg.id).length,
        tasks: this.tasks.filter(t => {
          const feature = this.features.find(f => f.id === t.featureId);
          return feature && feature.argumentId === arg.id;
        }).length
      })),
      avg_paragraphs_per_feature: this.features.length > 0 
        ? (this.paragraphs.length / this.features.length).toFixed(2)
        : '0',
      avg_tasks_per_paragraph: this.paragraphs.length > 0
        ? (this.tasks.length / this.paragraphs.length).toFixed(2)
        : '0',
      avg_tasks_per_feature: this.features.length > 0
        ? (this.tasks.length / this.features.length).toFixed(2)
        : '0'
    };
    
    return stats;
  }

  /**
   * Convert to structured-todo.json format
   */
  toJSON() {
    return {
      metadata: {
        generated_at: this.metadata.generated_at || new Date().toISOString(),
        parser_version: this.metadata.parser_version || '1.0.0',
        schema_version: this.metadata.schema_version || '1.0',
        total_arguments: this.legalArguments.length,
        total_features: this.features.length,
        total_paragraphs: this.paragraphs.length,
        total_tasks: this.tasks.length
      },
      hierarchy: {
        legal_arguments: this.legalArguments,
        features: this.features,
        paragraphs: this.paragraphs,
        tasks: this.tasks
      },
      statistics: this.generateStatistics()
    };
  }

  /**
   * Print summary
   */
  printSummary() {
    console.log('\n📊 Hierarchical Structure Summary:\n');
    console.log(`  Legal Arguments: ${this.legalArguments.length}`);
    console.log(`  Feature Issues:  ${this.features.length}`);
    console.log(`  Paragraphs:      ${this.paragraphs.length}`);
    console.log(`  Task Issues:     ${this.tasks.length}\n`);
    
    const stats = this.generateStatistics();
    console.log('📈 Statistics:\n');
    console.log(`  Avg Paragraphs per Feature: ${stats.avg_paragraphs_per_feature}`);
    console.log(`  Avg Tasks per Paragraph:    ${stats.avg_tasks_per_paragraph}`);
    console.log(`  Avg Tasks per Feature:      ${stats.avg_tasks_per_feature}\n`);
    
    console.log('🎯 Priority Distribution:\n');
    console.log(`  Critical: ${stats.by_priority.critical}`);
    console.log(`  High:     ${stats.by_priority.high}`);
    console.log(`  Medium:   ${stats.by_priority.medium}`);
    console.log(`  Low:      ${stats.by_priority.low}\n`);
  }

  /**
   * Save to JSON file
   */
  saveJSON(outputPath) {
    const json = this.toJSON();
    fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
    console.log(`✅ Saved to ${outputPath}\n`);
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const inputPath = args[0] || '/tmp/structured-todo.md';
  const outputPath = args[1] || 'structured-todo.json';
  
  console.log('🧠 Structured TODO Markdown Parser\n');
  console.log('='.repeat(70) + '\n');
  
  try {
    const parser = new StructuredTodoMdParser();
    parser.parse(inputPath);
    parser.printSummary();
    parser.saveJSON(outputPath);
    
    console.log('='.repeat(70));
    console.log('🎉 Parsing complete!\n');
    console.log(`Next step: Run generate-hierarchical-issues.js with ${outputPath}`);
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = StructuredTodoMdParser;
