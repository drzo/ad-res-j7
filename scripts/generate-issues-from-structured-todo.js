#!/usr/bin/env node

/**
 * Complete workflow to generate GitHub issues from structured-todo.md
 * 
 * This script:
 * 1. Downloads or reads the structured-todo.md file
 * 2. Parses it to JSON format
 * 3. Generates GitHub issue definitions
 * 4. Optionally creates the issues in GitHub
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function runCommand(cmd, description) {
  log(`\n${description}...`, 'cyan');
  try {
    const output = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
    log('✅ Success!', 'green');
    return output;
  } catch (error) {
    log(`❌ Failed: ${error.message}`, 'red');
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const inputFile = args[0] || '/tmp/structured-todo.md';
  const createIssues = args.includes('--create-issues');
  const dryRun = args.includes('--dry-run') || !createIssues;

  log('=' .repeat(70), 'bright');
  log('🏗️  GitHub Issue Generation from structured-todo.md', 'bright');
  log('=' .repeat(70), 'bright');
  
  // Check if input file exists
  if (!fs.existsSync(inputFile)) {
    log(`\n❌ Input file not found: ${inputFile}`, 'red');
    log('\nUsage:', 'yellow');
    log('  node scripts/generate-issues-from-structured-todo.js [input-file] [options]', 'yellow');
    log('\nOptions:', 'yellow');
    log('  --dry-run        Preview issues without creating them (default)', 'yellow');
    log('  --create-issues  Actually create GitHub issues', 'yellow');
    log('\nExample:', 'yellow');
    log('  node scripts/generate-issues-from-structured-todo.js /tmp/structured-todo.md --dry-run', 'yellow');
    process.exit(1);
  }

  log(`\n📁 Input file: ${inputFile}`, 'cyan');
  log(`🔧 Mode: ${dryRun ? 'DRY RUN (preview only)' : 'CREATE ISSUES'}`, 'cyan');

  try {
    // Step 1: Parse structured-todo.md to JSON
    log('\n' + '='.repeat(70), 'bright');
    log('STEP 1: Parse structured-todo.md to JSON', 'bright');
    log('='.repeat(70), 'bright');
    
    runCommand(
      `node scripts/parse-structured-todo-md.js ${inputFile} structured-todo.json`,
      '📝 Parsing markdown to JSON'
    );

    // Verify structured-todo.json was created
    if (!fs.existsSync('structured-todo.json')) {
      throw new Error('structured-todo.json was not created');
    }

    // Display metadata
    const structuredData = JSON.parse(fs.readFileSync('structured-todo.json', 'utf8'));
    log('\n📊 Parsed Structure:', 'blue');
    log(`  Legal Arguments: ${structuredData.metadata.total_arguments}`, 'blue');
    log(`  Features:        ${structuredData.metadata.total_features}`, 'blue');
    log(`  Paragraphs:      ${structuredData.metadata.total_paragraphs}`, 'blue');
    log(`  Tasks:           ${structuredData.metadata.total_tasks}`, 'blue');

    // Step 2: Generate GitHub issue definitions
    log('\n' + '='.repeat(70), 'bright');
    log('STEP 2: Generate GitHub Issue Definitions', 'bright');
    log('='.repeat(70), 'bright');

    runCommand(
      'node scripts/generate-hierarchical-issues.js structured-todo.json todo-issues.json',
      '🎯 Generating issue definitions'
    );

    // Verify todo-issues.json was created
    if (!fs.existsSync('todo-issues.json')) {
      throw new Error('todo-issues.json was not created');
    }

    // Display issue summary
    const issuesData = JSON.parse(fs.readFileSync('todo-issues.json', 'utf8'));
    log('\n📋 Generated Issues:', 'blue');
    log(`  Total:    ${issuesData.summary.total_issues}`, 'blue');
    log(`  Critical: ${issuesData.summary.priorities.critical}`, 'blue');
    log(`  High:     ${issuesData.summary.priorities.high}`, 'blue');
    log(`  Medium:   ${issuesData.summary.priorities.medium}`, 'blue');
    log(`  Low:      ${issuesData.summary.priorities.low}`, 'blue');

    // Step 3: Preview or create issues
    log('\n' + '='.repeat(70), 'bright');
    if (dryRun) {
      log('STEP 3: Preview Mode - Issues NOT Created', 'bright');
      log('='.repeat(70), 'bright');
      
      log('\n📝 Sample Issue Preview:', 'yellow');
      log('─'.repeat(70), 'yellow');
      
      // Show first 3 issues
      const sampleIssues = issuesData.issues.slice(0, 3);
      sampleIssues.forEach((issue, index) => {
        log(`\n${index + 1}. ${issue.title}`, 'cyan');
        log(`   Priority: ${issue.metadata.priority}`, 'cyan');
        log(`   Labels: ${issue.labels.join(', ')}`, 'cyan');
        log(`   Feature: ${issue.metadata.feature_title}`, 'cyan');
        log(`   Argument: ${issue.metadata.argument_name}`, 'cyan');
      });

      log('\n' + '─'.repeat(70), 'yellow');
      log('\n✅ Issue definitions generated successfully!', 'green');
      log('\n📄 Files created:', 'yellow');
      log('  - structured-todo.json (hierarchical data)', 'yellow');
      log('  - todo-issues.json (issue definitions)', 'yellow');
      
      log('\n🚀 Next steps:', 'yellow');
      log('  1. Review the generated issues in todo-issues.json', 'yellow');
      log('  2. Run with --create-issues to create GitHub issues:', 'yellow');
      log('     node scripts/generate-issues-from-structured-todo.js /tmp/structured-todo.md --create-issues', 'yellow');
      log('  3. Or trigger the GitHub Actions workflow:', 'yellow');
      log('     gh workflow run todo-to-issues.yml', 'yellow');
      
    } else {
      log('STEP 3: Create GitHub Issues', 'bright');
      log('='.repeat(70), 'bright');
      
      log('\n⚠️  WARNING: This will create 146 GitHub issues!', 'yellow');
      log('Are you sure you want to continue? (Press Ctrl+C to cancel)', 'yellow');
      
      // Wait 5 seconds for user to cancel
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      log('\n🚀 Creating GitHub issues...', 'cyan');
      log('This may take several minutes...', 'cyan');
      
      // Note: Actual issue creation would be done via GitHub API or gh CLI
      // This would require GITHUB_TOKEN to be set
      log('\n⚠️  Direct issue creation from this script is not yet implemented.', 'yellow');
      log('Please use the GitHub Actions workflow instead:', 'yellow');
      log('  gh workflow run todo-to-issues.yml', 'yellow');
    }

    log('\n' + '='.repeat(70), 'bright');
    log('✨ Process completed successfully!', 'green');
    log('='.repeat(70), 'bright');
    
  } catch (error) {
    log('\n' + '='.repeat(70), 'red');
    log('❌ Error occurred:', 'red');
    log(error.message, 'red');
    log('='.repeat(70), 'red');
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
