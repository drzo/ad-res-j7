#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { db } = require('../db/config');
const { sql } = require('drizzle-orm');

/**
 * Cross-Repository Evidence Tracker
 * Manages evidence across multiple repositories for Case 2025-137857
 */
class CrossRepoEvidenceTracker {
  constructor() {
    this.repositories = [
      { 
        name: 'ad-res-j7', 
        owner: 'cogpy',
        url: 'https://github.com/cogpy/ad-res-j7',
        status: 'active',
        local_path: '.'
      },
      { 
        name: 'analysss', 
        owner: 'EchoCog',
        url: 'https://github.com/EchoCog/analysss',
        status: 'unknown',
        local_path: null
      },
      { 
        name: 'analysis', 
        owner: 'rzonedevops',
        url: 'https://github.com/rzonedevops/analysis',
        status: 'unknown',
        local_path: null
      },
      { 
        name: 'avtomaatoctory', 
        owner: 'rzonedevops',
        url: 'https://github.com/rzonedevops/avtomaatoctory',
        status: 'unknown',
        local_path: null
      },
      { 
        name: 'analyticase', 
        owner: 'rzonedevops',
        url: 'https://github.com/rzonedevops/analyticase',
        status: 'unknown',
        local_path: null
      }
    ];

    this.evidenceTypes = [
      'bank_records',
      'email_forensics',
      'financial_analysis',
      'witness_statements',
      'court_documents',
      'affidavits',
      'correspondence',
      'shopify_reports',
      'invoices',
      'timeline_analysis'
    ];
  }

  /**
   * Scan a repository for evidence
   */
  async scanRepository(repoName) {
    const repo = this.repositories.find(r => r.name === repoName);
    if (!repo || !repo.local_path) {
      console.log(`Repository ${repoName} not available for scanning`);
      return null;
    }

    const evidence = {
      repository: repoName,
      scan_date: new Date().toISOString(),
      evidence_found: {},
      document_count: 0,
      issues_tracked: 0
    };

    // Scan for evidence types
    for (const type of this.evidenceTypes) {
      evidence.evidence_found[type] = await this.findEvidenceOfType(repo.local_path, type);
    }

    // Count documents
    evidence.document_count = Object.values(evidence.evidence_found)
      .reduce((sum, files) => sum + files.length, 0);

    // Get issue count from database
    try {
      const result = await db.execute(sql`
        SELECT COUNT(*) as count FROM issues WHERE status != 'completed'
      `);
      evidence.issues_tracked = parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error counting issues:', error);
    }

    return evidence;
  }

  /**
   * Find evidence files of a specific type
   */
  async findEvidenceOfType(repoPath, evidenceType) {
    const files = [];
    const searchPaths = this.getSearchPathsForType(evidenceType);

    for (const searchPath of searchPaths) {
      const fullPath = path.join(repoPath, searchPath);
      if (fs.existsSync(fullPath)) {
        const items = this.scanDirectory(fullPath);
        files.push(...items);
      }
    }

    return files;
  }

  /**
   * Get search paths for evidence type
   */
  getSearchPathsForType(evidenceType) {
    const pathMap = {
      'bank_records': ['evidence/bank_records', 'bank_records', 'financial/bank'],
      'email_forensics': ['evidence/correspondence', 'email', 'forensics'],
      'financial_analysis': ['evidence', 'financial', 'analysis'],
      'witness_statements': ['affidavit_work', 'witness', 'statements'],
      'court_documents': ['case_2025_137857', 'court', 'legal'],
      'affidavits': ['affidavit_work', 'jax-response/source-documents'],
      'correspondence': ['evidence/correspondence', 'jax-response'],
      'shopify_reports': ['evidence/shopify_reports', 'shopify'],
      'invoices': ['evidence/invoices', 'invoices'],
      'timeline_analysis': ['jax-response/analysis-output', 'timeline']
    };

    return pathMap[evidenceType] || [];
  }

  /**
   * Scan a directory for relevant files
   */
  scanDirectory(dirPath) {
    const files = [];
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isFile() && this.isRelevantFile(item)) {
          files.push({
            name: item,
            path: itemPath,
            size: stat.size,
            modified: stat.mtime
          });
        } else if (stat.isDirectory() && !item.startsWith('.')) {
          // Recursively scan subdirectories
          files.push(...this.scanDirectory(itemPath));
        }
      }
    } catch (error) {
      console.error(`Error scanning ${dirPath}:`, error.message);
    }

    return files;
  }

  /**
   * Check if file is relevant evidence
   */
  isRelevantFile(filename) {
    const relevantExtensions = ['.pdf', '.docx', '.md', '.json', '.txt', '.xlsx'];
    const ext = path.extname(filename).toLowerCase();
    return relevantExtensions.includes(ext);
  }

  /**
   * Compare evidence across repositories
   */
  async compareRepositories() {
    const comparison = {
      timestamp: new Date().toISOString(),
      repositories: {},
      evidence_matrix: {},
      gaps: [],
      duplicates: [],
      recommendations: []
    };

    // Scan each available repository
    for (const repo of this.repositories) {
      if (repo.status === 'active') {
        const evidence = await this.scanRepository(repo.name);
        if (evidence) {
          comparison.repositories[repo.name] = evidence;
        }
      }
    }

    // Build evidence matrix
    for (const type of this.evidenceTypes) {
      comparison.evidence_matrix[type] = {};
      
      for (const repoName in comparison.repositories) {
        const repo = comparison.repositories[repoName];
        comparison.evidence_matrix[type][repoName] = 
          repo.evidence_found[type]?.length || 0;
      }
    }

    // Identify gaps
    comparison.gaps = this.identifyGaps(comparison.evidence_matrix);

    // Generate recommendations
    comparison.recommendations = this.generateRecommendations(comparison);

    return comparison;
  }

  /**
   * Identify evidence gaps
   */
  identifyGaps(matrix) {
    const gaps = [];

    for (const type in matrix) {
      const repos = matrix[type];
      const totalFiles = Object.values(repos).reduce((sum, count) => sum + count, 0);
      
      if (totalFiles === 0) {
        gaps.push({
          type: type,
          severity: 'critical',
          message: `No ${type} found in any repository`
        });
      } else if (totalFiles < 3) {
        gaps.push({
          type: type,
          severity: 'warning',
          message: `Limited ${type} (only ${totalFiles} files found)`
        });
      }
    }

    return gaps;
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(comparison) {
    const recommendations = [];

    // Check for critical evidence gaps
    const criticalGaps = comparison.gaps.filter(g => g.severity === 'critical');
    if (criticalGaps.length > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Collect missing critical evidence',
        details: criticalGaps.map(g => g.type).join(', ')
      });
    }

    // Check repository accessibility
    const inaccessibleRepos = this.repositories.filter(r => r.status === 'unknown');
    if (inaccessibleRepos.length > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Gain access to repositories',
        details: inaccessibleRepos.map(r => `${r.owner}/${r.name}`).join(', ')
      });
    }

    // Check for document organization
    for (const repoName in comparison.repositories) {
      const repo = comparison.repositories[repoName];
      if (repo.document_count > 50) {
        recommendations.push({
          priority: 'medium',
          action: `Organize documents in ${repoName}`,
          details: `Repository has ${repo.document_count} documents`
        });
      }
    }

    return recommendations;
  }

  /**
   * Save comparison to database
   */
  async saveComparison(comparison) {
    try {
      const result = await db.execute(sql`
        INSERT INTO case_documents 
        (case_number, document_type, title, content, file_path)
        VALUES (
          '2025-137857',
          'repository_comparison',
          ${`Repository Comparison - ${comparison.timestamp}`},
          ${JSON.stringify(comparison)},
          'repo-analysis/comparisons/'
        )
        RETURNING id
      `);
      
      console.log(`✅ Comparison saved with ID: ${result.rows[0].id}`);
      return result.rows[0].id;
    } catch (error) {
      console.error('Error saving comparison:', error);
      return null;
    }
  }

  /**
   * Generate markdown report
   */
  generateReport(comparison) {
    let report = `# Cross-Repository Evidence Analysis\n`;
    report += `## Generated: ${comparison.timestamp}\n\n`;

    // Repository Summary
    report += `## Repository Summary\n\n`;
    report += `| Repository | Documents | Issues | Status |\n`;
    report += `|------------|-----------|--------|--------|\n`;
    
    for (const repoName in comparison.repositories) {
      const repo = comparison.repositories[repoName];
      report += `| ${repoName} | ${repo.document_count} | ${repo.issues_tracked} | ✅ Active |\n`;
    }

    // Evidence Matrix
    report += `\n## Evidence Matrix\n\n`;
    report += `| Evidence Type | ad-res-j7 | analysss | analysis | avtomaatoctory | analyticase |\n`;
    report += `|---------------|-----------|----------|----------|----------------|-------------|\n`;
    
    for (const type of this.evidenceTypes) {
      report += `| ${type} |`;
      for (const repo of this.repositories) {
        const count = comparison.evidence_matrix[type]?.[repo.name] || '?';
        report += ` ${count} |`;
      }
      report += `\n`;
    }

    // Gaps Analysis
    if (comparison.gaps.length > 0) {
      report += `\n## Evidence Gaps\n\n`;
      for (const gap of comparison.gaps) {
        const icon = gap.severity === 'critical' ? '🔴' : '⚠️';
        report += `- ${icon} ${gap.message}\n`;
      }
    }

    // Recommendations
    if (comparison.recommendations.length > 0) {
      report += `\n## Recommendations\n\n`;
      for (const rec of comparison.recommendations) {
        const priority = rec.priority === 'high' ? '🔥' : '📌';
        report += `### ${priority} ${rec.action}\n`;
        report += `${rec.details}\n\n`;
      }
    }

    return report;
  }
}

// CLI Interface
if (require.main === module) {
  const tracker = new CrossRepoEvidenceTracker();
  const command = process.argv[2];

  async function run() {
    try {
      switch(command) {
        case 'scan':
          const repoName = process.argv[3] || 'ad-res-j7';
          console.log(`Scanning repository: ${repoName}`);
          const evidence = await tracker.scanRepository(repoName);
          if (evidence) {
            console.log(JSON.stringify(evidence, null, 2));
          }
          break;

        case 'compare':
          console.log('Comparing all repositories...');
          const comparison = await tracker.compareRepositories();
          
          // Save to database
          await tracker.saveComparison(comparison);
          
          // Generate and save report
          const report = tracker.generateReport(comparison);
          const reportPath = `repo-analysis/comparison-${Date.now()}.md`;
          fs.writeFileSync(reportPath, report);
          
          console.log(`\n${report}`);
          console.log(`Report saved to: ${reportPath}`);
          break;

        case 'gaps':
          console.log('Analyzing evidence gaps...');
          const gapAnalysis = await tracker.compareRepositories();
          console.log('\nEvidence Gaps:');
          for (const gap of gapAnalysis.gaps) {
            console.log(`- [${gap.severity}] ${gap.message}`);
          }
          break;

        default:
          console.log('Cross-Repository Evidence Tracker');
          console.log('\nUsage:');
          console.log('  node evidence-tracking.js scan [repo]  - Scan a repository');
          console.log('  node evidence-tracking.js compare      - Compare all repositories');
          console.log('  node evidence-tracking.js gaps         - Analyze evidence gaps');
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }

  run();
}

module.exports = CrossRepoEvidenceTracker;