#!/usr/bin/env node

const { db, pool } = require('./config');
const { sql } = require('drizzle-orm');
const fs = require('fs');
const path = require('path');

class CaseManager {
  // Add a case document to the database
  async addCaseDocument(caseNumber, documentType, title, content, filePath = null) {
    try {
      const result = await db.execute(sql`
        INSERT INTO case_documents (case_number, document_type, title, content, file_path)
        VALUES (${caseNumber}, ${documentType}, ${title}, ${content}, ${filePath})
        RETURNING *
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding case document:', error);
      throw error;
    }
  }

  // Add evidence record
  async addEvidence(caseNumber, evidenceType, description, filePath, source = null) {
    try {
      const result = await db.execute(sql`
        INSERT INTO evidence_records (case_number, evidence_type, description, file_path, source, date_collected)
        VALUES (${caseNumber}, ${evidenceType}, ${description}, ${filePath}, ${source}, NOW())
        RETURNING *
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding evidence:', error);
      throw error;
    }
  }

  // Track an issue
  async trackIssue(issueNumber, title, description, priority = 'medium', labels = []) {
    try {
      const result = await db.execute(sql`
        INSERT INTO issues (issue_number, title, description, priority, labels, status)
        VALUES (${issueNumber}, ${title}, ${description}, ${priority}, ${JSON.stringify(labels)}, 'open')
        RETURNING *
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error tracking issue:', error);
      throw error;
    }
  }

  // Update issue status
  async updateIssueStatus(issueNumber, status) {
    try {
      const completedAt = status === 'completed' ? sql`NOW()` : null;
      const result = await db.execute(sql`
        UPDATE issues 
        SET status = ${status}, 
            updated_at = NOW(),
            completed_at = ${completedAt}
        WHERE issue_number = ${issueNumber}
        RETURNING *
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating issue status:', error);
      throw error;
    }
  }

  // Add affidavit amendment
  async addAmendment(sectionNumber, paragraphNumber, originalText, amendedText, justification) {
    try {
      const result = await db.execute(sql`
        INSERT INTO affidavit_amendments 
        (section_number, paragraph_number, original_text, amended_text, justification)
        VALUES (${sectionNumber}, ${paragraphNumber}, ${originalText}, ${amendedText}, ${justification})
        RETURNING *
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding amendment:', error);
      throw error;
    }
  }

  // Save test results
  async saveTestResults(testType, totalTests, passed, failed, errors = null, fullResults = null) {
    try {
      const successRate = Math.round((passed / totalTests) * 100);
      const result = await db.execute(sql`
        INSERT INTO test_results 
        (test_type, total_tests, passed, failed, success_rate, errors, results)
        VALUES (${testType}, ${totalTests}, ${passed}, ${failed}, ${successRate}, 
                ${errors ? JSON.stringify(errors) : null}, 
                ${fullResults ? JSON.stringify(fullResults) : null})
        RETURNING *
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error saving test results:', error);
      throw error;
    }
  }

  // Get all documents for a case
  async getCaseDocuments(caseNumber) {
    try {
      const result = await db.execute(sql`
        SELECT * FROM case_documents 
        WHERE case_number = ${caseNumber}
        ORDER BY created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error getting case documents:', error);
      throw error;
    }
  }

  // Get all evidence for a case
  async getCaseEvidence(caseNumber) {
    try {
      const result = await db.execute(sql`
        SELECT * FROM evidence_records 
        WHERE case_number = ${caseNumber}
        ORDER BY date_collected DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error getting case evidence:', error);
      throw error;
    }
  }

  // Get open issues
  async getOpenIssues() {
    try {
      const result = await db.execute(sql`
        SELECT * FROM issues 
        WHERE status != 'completed'
        ORDER BY priority DESC, created_at ASC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error getting open issues:', error);
      throw error;
    }
  }

  // Get issues by priority
  async getIssuesByPriority(priority) {
    try {
      const result = await db.execute(sql`
        SELECT * FROM issues 
        WHERE priority = ${priority} AND status != 'completed'
        ORDER BY created_at ASC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error getting issues by priority:', error);
      throw error;
    }
  }

  // Get draft amendments
  async getDraftAmendments() {
    try {
      const result = await db.execute(sql`
        SELECT * FROM affidavit_amendments 
        WHERE status = 'draft'
        ORDER BY section_number, paragraph_number
      `);
      return result.rows;
    } catch (error) {
      console.error('Error getting draft amendments:', error);
      throw error;
    }
  }

  // Get latest test results
  async getLatestTestResults(testType = null) {
    try {
      let query;
      if (testType) {
        query = sql`
          SELECT * FROM test_results 
          WHERE test_type = ${testType}
          ORDER BY run_at DESC
          LIMIT 10
        `;
      } else {
        query = sql`
          SELECT * FROM test_results 
          ORDER BY run_at DESC
          LIMIT 10
        `;
      }
      const result = await db.execute(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting test results:', error);
      throw error;
    }
  }

  // Import documents from file system
  async importDocumentsFromFS(directory, caseNumber = '2025-137857') {
    const files = fs.readdirSync(directory);
    let imported = 0;
    
    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.json')) {
        const filePath = path.join(directory, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const documentType = file.endsWith('.json') ? 'json' : 'markdown';
        
        try {
          await this.addCaseDocument(
            caseNumber,
            documentType,
            file,
            content,
            filePath
          );
          imported++;
          console.log(`✅ Imported: ${file}`);
        } catch (error) {
          console.log(`❌ Failed to import: ${file}`);
        }
      }
    }
    
    return imported;
  }
}

module.exports = CaseManager;

// CLI interface
if (require.main === module) {
  const caseManager = new CaseManager();
  const args = process.argv.slice(2);
  const command = args[0];

  async function run() {
    try {
      switch(command) {
        case 'list-documents':
          const docs = await caseManager.getCaseDocuments('2025-137857');
          console.log(`Found ${docs.length} documents:`);
          docs.forEach(doc => {
            console.log(`- [${doc.document_type}] ${doc.title}`);
          });
          break;
          
        case 'list-issues':
          const issues = await caseManager.getOpenIssues();
          console.log(`Found ${issues.length} open issues:`);
          issues.forEach(issue => {
            console.log(`- #${issue.issue_number} [${issue.priority}] ${issue.title}`);
          });
          break;
          
        case 'list-evidence':
          const evidence = await caseManager.getCaseEvidence('2025-137857');
          console.log(`Found ${evidence.length} evidence records:`);
          evidence.forEach(ev => {
            console.log(`- [${ev.evidence_type}] ${ev.description}`);
          });
          break;
          
        case 'import':
          const directory = args[1];
          if (!directory) {
            console.log('Usage: node case-manager.js import <directory>');
            break;
          }
          const count = await caseManager.importDocumentsFromFS(directory);
          console.log(`\nImported ${count} documents`);
          break;
          
        default:
          console.log('Available commands:');
          console.log('  list-documents - List all case documents');
          console.log('  list-issues    - List all open issues');
          console.log('  list-evidence  - List all evidence records');
          console.log('  import <dir>   - Import documents from directory');
      }
      process.exit(0);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }
  
  run();
}