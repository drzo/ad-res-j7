#!/usr/bin/env node

/**
 * Script to create GitHub Issues from hierarchical issue structure
 * Creates issues in the repository based on the database hierarchy
 */

const HierarchicalIssueManager = require('../db/hierarchical-issue-manager');

/**
 * Create GitHub issue using GitHub API
 * This would require @actions/github or octokit
 */
async function createGitHubIssue(octokit, owner, repo, issueData) {
  try {
    const response = await octokit.rest.issues.create({
      owner,
      repo,
      title: issueData.title,
      body: issueData.body,
      labels: issueData.labels || []
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error creating issue: ${error.message}`);
    throw error;
  }
}

/**
 * Generate issue body from hierarchical data
 */
function generateIssueBody(type, data, context = {}) {
  let body = '';
  
  if (type === 'argument') {
    body += `## Legal Argument: ${data.argument_name}\n\n`;
    body += `**Type:** ${data.argument_type}\n\n`;
    body += `**Description:** ${data.description}\n\n`;
    body += `**Strategy:** ${data.strategy}\n\n`;
    
    if (context.features && context.features.length > 0) {
      body += `### Related Features (${context.features.length})\n\n`;
      context.features.forEach(feat => {
        body += `- #${feat.issue_number || feat.id} - ${feat.title}\n`;
      });
    }
  } else if (type === 'feature') {
    body += `## Feature Issue: ${data.title}\n\n`;
    body += `**Description:** ${data.description}\n\n`;
    body += `**Priority:** ${data.priority}\n\n`;
    
    if (context.argument) {
      body += `**Legal Argument:** ${context.argument.argument_name}\n\n`;
    }
    
    if (context.paragraphs && context.paragraphs.length > 0) {
      body += `### Paragraphs (${context.paragraphs.length})\n\n`;
      context.paragraphs.forEach(para => {
        body += `${para.paragraph_number}. **${para.title}** (Rank: ${para.rank_order}, Weight: ${para.weight})\n`;
        body += `   ${para.content}\n\n`;
      });
    }
  } else if (type === 'task') {
    body += `## Task Issue: ${data.title}\n\n`;
    body += `**Description:** ${data.description}\n\n`;
    body += `**Priority:** ${data.priority}\n`;
    body += `**Rank:** ${data.rank_order}\n`;
    body += `**Weight:** ${data.weight}\n\n`;
    
    if (context.feature) {
      body += `**Feature:** #${context.feature.issue_number || context.feature.id} - ${context.feature.title}\n\n`;
    }
    
    if (context.paragraph) {
      body += `**Paragraph:** ${context.paragraph.paragraph_number} - ${context.paragraph.title}\n\n`;
    }
  }
  
  return body;
}

/**
 * Main function to create issues from hierarchy
 */
async function createIssuesFromHierarchy(manager, options = {}) {
  const {
    argumentId,
    dryRun = true,
    octokit = null,
    owner = '',
    repo = ''
  } = options;
  
  console.log('📋 Creating GitHub Issues from Hierarchical Structure\n');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}\n`);
  
  // Get the complete hierarchy
  const hierarchy = await manager.getArgumentHierarchy(argumentId);
  
  const issuesCreated = [];
  
  // Create argument issue
  const argIssueData = {
    title: `[ARGUMENT] ${hierarchy.argument.argument_name}`,
    body: generateIssueBody('argument', hierarchy.argument, { features: hierarchy.features }),
    labels: ['legal-argument', hierarchy.argument.argument_type]
  };
  
  console.log(`📚 ${dryRun ? '[DRY RUN]' : 'Creating'} Argument Issue:`);
  console.log(`   Title: ${argIssueData.title}`);
  
  if (!dryRun && octokit) {
    const argIssue = await createGitHubIssue(octokit, owner, repo, argIssueData);
    issuesCreated.push({ type: 'argument', data: argIssue });
    console.log(`   ✅ Created #${argIssue.number}`);
  }
  console.log('');
  
  // Create feature issues
  for (const feature of hierarchy.features) {
    const featIssueData = {
      title: `[FEATURE #${feature.issue_number}] ${feature.title}`,
      body: generateIssueBody('feature', feature, { 
        argument: hierarchy.argument,
        paragraphs: feature.paragraphs 
      }),
      labels: ['feature-issue', feature.priority, 'hierarchical']
    };
    
    console.log(`  📊 ${dryRun ? '[DRY RUN]' : 'Creating'} Feature Issue #${feature.issue_number}:`);
    console.log(`     Title: ${featIssueData.title}`);
    
    if (!dryRun && octokit) {
      const featIssue = await createGitHubIssue(octokit, owner, repo, featIssueData);
      issuesCreated.push({ type: 'feature', data: featIssue });
      console.log(`     ✅ Created #${featIssue.number}`);
    }
    
    // Create task issues for this feature
    for (const paragraph of feature.paragraphs) {
      for (const task of paragraph.issues) {
        const taskIssueData = {
          title: `[TASK #${task.issue_number}] ${task.title}`,
          body: generateIssueBody('task', task, {
            feature: feature,
            paragraph: paragraph
          }),
          labels: ['task-issue', task.priority, 'hierarchical']
        };
        
        console.log(`    ✓ ${dryRun ? '[DRY RUN]' : 'Creating'} Task Issue #${task.issue_number}:`);
        console.log(`       Title: ${taskIssueData.title}`);
        
        if (!dryRun && octokit) {
          const taskIssue = await createGitHubIssue(octokit, owner, repo, taskIssueData);
          issuesCreated.push({ type: 'task', data: taskIssue });
          console.log(`       ✅ Created #${taskIssue.number}`);
        }
      }
    }
    console.log('');
  }
  
  console.log(`\n✨ Summary:`);
  console.log(`   Arguments: 1`);
  console.log(`   Features:  ${hierarchy.features.length}`);
  console.log(`   Tasks:     ${hierarchy.features.reduce((sum, f) => sum + f.paragraphs.reduce((s, p) => s + p.issues.length, 0), 0)}`);
  
  if (!dryRun) {
    console.log(`   GitHub Issues Created: ${issuesCreated.length}`);
  }
  
  return issuesCreated;
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable not set');
    process.exit(1);
  }
  
  const manager = new HierarchicalIssueManager();
  
  switch (command) {
    case 'dry-run':
      const argumentId = parseInt(args[1]) || 1;
      await createIssuesFromHierarchy(manager, {
        argumentId,
        dryRun: true
      });
      break;
      
    case 'create':
      // This would require GitHub token and octokit setup
      console.log('Live creation requires GITHUB_TOKEN');
      console.log('Use dry-run to preview issues first');
      break;
      
    default:
      console.log('Usage:');
      console.log('  node create-github-issues.js dry-run [argumentId]  - Preview issues');
      console.log('  node create-github-issues.js create [argumentId]    - Create issues (requires GITHUB_TOKEN)');
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

module.exports = { createIssuesFromHierarchy, generateIssueBody };
