#!/usr/bin/env node

const { db } = require('./config');
const { sql } = require('drizzle-orm');

/**
 * Hierarchical Issue Manager for Case 2025-137857
 * Manages feature-level issues, paragraphs, and task-level issues
 * with rank ordering and weighting for legal argument strength analysis
 * 
 * ENHANCED WITH CROSS-REFERENCE INTEGRATION:
 * - Links issues to documents, evidence, and annexures
 * - Detects consolidation opportunities to prevent issue explosion
 * - Enables evidence-based deduplication
 */
class HierarchicalIssueManager {

  // ===== LEGAL ARGUMENT OPERATIONS =====

  /**
   * Create a legal argument/strategy
   */
  async createLegalArgument(argumentName, description, argumentType = 'defense', strategy = null) {
    try {
      const result = await db.execute(sql`
        INSERT INTO legal_arguments (argument_name, description, argument_type, strategy)
        VALUES (${argumentName}, ${description}, ${argumentType}, ${strategy})
        RETURNING *
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating legal argument:', error);
      throw error;
    }
  }

  /**
   * Get legal argument by ID
   */
  async getLegalArgument(argumentId) {
    const result = await db.execute(sql`
      SELECT * FROM legal_arguments WHERE id = ${argumentId}
    `);
    return result.rows[0];
  }

  /**
   * List all legal arguments
   */
  async listLegalArguments(status = 'active') {
    const result = await db.execute(sql`
      SELECT * FROM legal_arguments 
      WHERE status = ${status}
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  // ===== FEATURE ISSUE OPERATIONS =====

  /**
   * Create a feature-level issue
   */
  async createFeatureIssue(issueNumber, title, description, priority = 'medium', argumentId = null) {
    try {
      const result = await db.execute(sql`
        INSERT INTO issues (
          issue_number, title, description, priority, 
          issue_type, status
        )
        VALUES (
          ${issueNumber}, ${title}, ${description}, ${priority},
          'feature', 'open'
        )
        RETURNING *
      `);
      
      const issue = result.rows[0];
      
      // Link to legal argument if provided
      if (argumentId) {
        await this.linkIssueToArgument(issue.id, argumentId, 'proves', 90);
      }
      
      return issue;
    } catch (error) {
      console.error('Error creating feature issue:', error);
      throw error;
    }
  }

  /**
   * Create a task-level issue under a feature
   */
  async createTaskIssue(
    issueNumber, 
    title, 
    description, 
    parentFeatureId, 
    paragraphId = null,
    rankOrder = null, 
    weight = 50,
    priority = 'medium'
  ) {
    try {
      const result = await db.execute(sql`
        INSERT INTO issues (
          issue_number, title, description, priority,
          issue_type, parent_issue_id, rank_order, weight, status
        )
        VALUES (
          ${issueNumber}, ${title}, ${description}, ${priority},
          'task', ${parentFeatureId}, ${rankOrder}, ${weight}, 'open'
        )
        RETURNING *
      `);
      
      const issue = result.rows[0];
      
      // Link to paragraph if provided
      if (paragraphId && rankOrder !== null) {
        await this.linkIssueToParagraph(paragraphId, issue.id, rankOrder, weight);
      }
      
      return issue;
    } catch (error) {
      console.error('Error creating task issue:', error);
      throw error;
    }
  }

  /**
   * Get all task issues under a feature
   */
  async getFeatureTaskIssues(featureIssueId) {
    const result = await db.execute(sql`
      SELECT * FROM issues 
      WHERE parent_issue_id = ${featureIssueId}
      ORDER BY rank_order ASC NULLS LAST, weight DESC
    `);
    return result.rows;
  }

  /**
   * Get feature issues for a legal argument
   */
  async getArgumentFeatures(argumentId) {
    const result = await db.execute(sql`
      SELECT i.* FROM issues i
      JOIN issue_argument_links ial ON i.id = ial.issue_id
      WHERE ial.argument_id = ${argumentId}
        AND i.issue_type = 'feature'
      ORDER BY ial.strength DESC
    `);
    return result.rows;
  }

  // ===== PARAGRAPH OPERATIONS =====

  /**
   * Create a paragraph within a feature issue
   */
  async createParagraph(featureIssueId, paragraphNumber, title, content, rankOrder, weight) {
    try {
      const result = await db.execute(sql`
        INSERT INTO issue_paragraphs (
          feature_issue_id, paragraph_number, title, content,
          rank_order, weight
        )
        VALUES (
          ${featureIssueId}, ${paragraphNumber}, ${title}, ${content},
          ${rankOrder}, ${weight}
        )
        RETURNING *
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating paragraph:', error);
      throw error;
    }
  }

  /**
   * Get all paragraphs for a feature issue
   */
  async getFeatureParagraphs(featureIssueId) {
    const result = await db.execute(sql`
      SELECT * FROM issue_paragraphs 
      WHERE feature_issue_id = ${featureIssueId}
      ORDER BY rank_order ASC
    `);
    return result.rows;
  }

  /**
   * Get paragraph with all linked task issues
   */
  async getParagraphWithIssues(paragraphId) {
    const paragraph = await db.execute(sql`
      SELECT * FROM issue_paragraphs WHERE id = ${paragraphId}
    `);
    
    const issues = await db.execute(sql`
      SELECT i.*, pil.rank_order as para_rank, pil.weight as para_weight
      FROM issues i
      JOIN paragraph_issue_links pil ON i.id = pil.issue_id
      WHERE pil.paragraph_id = ${paragraphId}
      ORDER BY pil.rank_order ASC, pil.weight DESC
    `);
    
    return {
      paragraph: paragraph.rows[0],
      issues: issues.rows
    };
  }

  // ===== LINKING OPERATIONS =====

  /**
   * Link an issue to a legal argument
   */
  async linkIssueToArgument(issueId, argumentId, linkType = 'proves', strength = 80) {
    try {
      const result = await db.execute(sql`
        INSERT INTO issue_argument_links (issue_id, argument_id, link_type, strength)
        VALUES (${issueId}, ${argumentId}, ${linkType}, ${strength})
        RETURNING *
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error linking issue to argument:', error);
      throw error;
    }
  }

  /**
   * Link a task issue to a paragraph
   */
  async linkIssueToParagraph(paragraphId, issueId, rankOrder, weight) {
    try {
      const result = await db.execute(sql`
        INSERT INTO paragraph_issue_links (paragraph_id, issue_id, rank_order, weight)
        VALUES (${paragraphId}, ${issueId}, ${rankOrder}, ${weight})
        RETURNING *
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error linking issue to paragraph:', error);
      throw error;
    }
  }

  // ===== UPDATE OPERATIONS =====

  /**
   * Update issue rank order
   */
  async updateIssueRank(issueId, newRank) {
    const result = await db.execute(sql`
      UPDATE issues 
      SET rank_order = ${newRank}, updated_at = NOW()
      WHERE id = ${issueId}
      RETURNING *
    `);
    return result.rows[0];
  }

  /**
   * Update issue weight
   */
  async updateIssueWeight(issueId, newWeight) {
    const result = await db.execute(sql`
      UPDATE issues 
      SET weight = ${newWeight}, updated_at = NOW()
      WHERE id = ${issueId}
      RETURNING *
    `);
    return result.rows[0];
  }

  /**
   * Update paragraph rank and weight
   */
  async updateParagraphRank(paragraphId, newRank, newWeight) {
    const result = await db.execute(sql`
      UPDATE issue_paragraphs 
      SET rank_order = ${newRank}, weight = ${newWeight}, updated_at = NOW()
      WHERE id = ${paragraphId}
      RETURNING *
    `);
    return result.rows[0];
  }

  // ===== HIERARCHICAL QUERIES =====

  /**
   * Get complete hierarchical structure for a legal argument
   */
  async getArgumentHierarchy(argumentId) {
    // Get the legal argument
    const argument = await this.getLegalArgument(argumentId);
    
    // Get all feature issues for this argument
    const features = await this.getArgumentFeatures(argumentId);
    
    // For each feature, get paragraphs and task issues
    const hierarchy = await Promise.all(features.map(async (feature) => {
      const paragraphs = await this.getFeatureParagraphs(feature.id);
      
      const paragraphsWithIssues = await Promise.all(paragraphs.map(async (paragraph) => {
        const { issues } = await this.getParagraphWithIssues(paragraph.id);
        return {
          ...paragraph,
          issues: issues
        };
      }));
      
      return {
        ...feature,
        paragraphs: paragraphsWithIssues
      };
    }));
    
    return {
      argument,
      features: hierarchy
    };
  }

  /**
   * Calculate aggregate strength of a feature based on paragraph and issue weights
   */
  async calculateFeatureStrength(featureIssueId) {
    const paragraphs = await this.getFeatureParagraphs(featureIssueId);
    
    let totalStrength = 0;
    let totalWeight = 0;
    
    for (const paragraph of paragraphs) {
      const { issues } = await this.getParagraphWithIssues(paragraph.id);
      
      // Calculate paragraph strength from its issues
      const paragraphIssueWeight = issues.reduce((sum, issue) => sum + (issue.para_weight || 0), 0);
      const paragraphIssueCount = issues.length || 1;
      const avgIssueWeight = paragraphIssueWeight / paragraphIssueCount;
      
      // Paragraph contributes to feature strength based on its weight and issue quality
      totalStrength += paragraph.weight * (avgIssueWeight / 100);
      totalWeight += paragraph.weight;
    }
    
    return totalWeight > 0 ? (totalStrength / totalWeight) * 100 : 0;
  }

  /**
   * Get top-ranked paragraphs by influence
   */
  async getTopParagraphs(featureIssueId, limit = 5) {
    const result = await db.execute(sql`
      SELECT * FROM issue_paragraphs 
      WHERE feature_issue_id = ${featureIssueId}
      ORDER BY weight DESC, rank_order ASC
      LIMIT ${limit}
    `);
    return result.rows;
  }

  /**
   * Get top-ranked task issues for a paragraph
   */
  async getTopParagraphIssues(paragraphId, limit = 5) {
    const result = await db.execute(sql`
      SELECT i.*, pil.rank_order as para_rank, pil.weight as para_weight
      FROM issues i
      JOIN paragraph_issue_links pil ON i.id = pil.issue_id
      WHERE pil.paragraph_id = ${paragraphId}
      ORDER BY pil.weight DESC, pil.rank_order ASC
      LIMIT ${limit}
    `);
    return result.rows;
  }

  // ===== CROSS-REFERENCE OPERATIONS =====

  /**
   * Add a cross-reference linking an issue to a document, evidence, or annexure
   * 
   * @param {number} issueId - The issue ID
   * @param {string} referenceType - Type: 'document', 'evidence', 'annexure', 'paragraph', 'timeline_event', 'analysis'
   * @param {string} referenceId - Identifier for the referenced item
   * @param {string} referencePath - File path or location
   * @param {string} referenceTitle - Human-readable title
   * @param {string} referenceSection - Specific section within the reference
   * @param {string} relationshipType - How the issue relates: 'proves', 'supports', 'contradicts', 'analyzes', etc.
   * @param {string} notes - Additional context
   * @returns {Object} The created cross-reference
   */
  async addCrossReference(
    issueId,
    referenceType,
    referenceId,
    referencePath = null,
    referenceTitle = null,
    referenceSection = null,
    relationshipType = 'references',
    notes = null
  ) {
    try {
      const result = await db.execute(sql`
        INSERT INTO issue_cross_references (
          issue_id, reference_type, reference_id, reference_path,
          reference_title, reference_section, relationship_type, notes
        )
        VALUES (
          ${issueId}, ${referenceType}, ${referenceId}, ${referencePath},
          ${referenceTitle}, ${referenceSection}, ${relationshipType}, ${notes}
        )
        RETURNING *
      `);
      
      // Trigger consolidation analysis
      await this.detectConsolidationOpportunities(referenceType, referenceId);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error adding cross-reference:', error);
      throw error;
    }
  }

  /**
   * Get all cross-references for an issue
   */
  async getIssueCrossReferences(issueId) {
    const result = await db.execute(sql`
      SELECT * FROM issue_cross_references
      WHERE issue_id = ${issueId}
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  /**
   * Get all issues that reference a specific document/evidence/annexure
   */
  async getIssuesByReference(referenceType, referenceId) {
    const result = await db.execute(sql`
      SELECT i.*, icr.relationship_type, icr.reference_section, icr.notes
      FROM issues i
      JOIN issue_cross_references icr ON i.id = icr.issue_id
      WHERE icr.reference_type = ${referenceType}
        AND icr.reference_id = ${referenceId}
      ORDER BY i.priority DESC, i.created_at ASC
    `);
    return result.rows;
  }

  /**
   * Detect consolidation opportunities when multiple issues reference the same evidence
   */
  async detectConsolidationOpportunities(referenceType, referenceId) {
    // Count how many issues reference this item
    const result = await db.execute(sql`
      SELECT 
        COUNT(DISTINCT issue_id) as issue_count,
        json_agg(DISTINCT issue_id) as issue_ids
      FROM issue_cross_references
      WHERE reference_type = ${referenceType}
        AND reference_id = ${referenceId}
    `);
    
    const { issue_count, issue_ids } = result.rows[0];
    
    // If 2+ issues reference the same thing, flag for consolidation
    if (parseInt(issue_count) >= 2) {
      // Check if already tracked
      const existing = await db.execute(sql`
        SELECT id FROM cross_reference_consolidations
        WHERE reference_type = ${referenceType}
          AND reference_id = ${referenceId}
          AND consolidation_status != 'resolved'
      `);
      
      if (existing.rows.length === 0) {
        // Create new consolidation opportunity
        const recommendedAction = `${issue_count} issues reference the same ${referenceType}: ${referenceId}. Consider consolidating into a single feature issue with ${issue_count} task issues.`;
        
        await db.execute(sql`
          INSERT INTO cross_reference_consolidations (
            reference_type, reference_id, issue_count, issue_ids, recommended_action
          )
          VALUES (
            ${referenceType}, ${referenceId}, ${issue_count}, ${JSON.stringify(issue_ids)}, ${recommendedAction}
          )
        `);
      } else {
        // Update existing
        await db.execute(sql`
          UPDATE cross_reference_consolidations
          SET issue_count = ${issue_count},
              issue_ids = ${JSON.stringify(issue_ids)},
              updated_at = NOW()
          WHERE reference_type = ${referenceType}
            AND reference_id = ${referenceId}
            AND consolidation_status != 'resolved'
        `);
      }
    }
  }

  /**
   * Get all detected consolidation opportunities
   */
  async getConsolidationOpportunities(status = 'detected') {
    const result = await db.execute(sql`
      SELECT * FROM cross_reference_consolidations
      WHERE consolidation_status = ${status}
      ORDER BY issue_count DESC, created_at ASC
    `);
    return result.rows;
  }

  /**
   * Mark a consolidation opportunity as reviewed or consolidated
   */
  async updateConsolidationStatus(consolidationId, status, resolvedAt = null) {
    const result = await db.execute(sql`
      UPDATE cross_reference_consolidations
      SET consolidation_status = ${status},
          resolved_at = ${resolvedAt || sql`NOW()`},
          updated_at = NOW()
      WHERE id = ${consolidationId}
      RETURNING *
    `);
    return result.rows[0];
  }

  /**
   * Find related issues based on shared cross-references
   * Useful for identifying issues that should be consolidated
   */
  async findRelatedIssues(issueId, minSharedReferences = 1) {
    const result = await db.execute(sql`
      SELECT 
        i2.id,
        i2.issue_number,
        i2.title,
        i2.issue_type,
        COUNT(DISTINCT icr2.reference_id) as shared_reference_count,
        json_agg(DISTINCT jsonb_build_object(
          'type', icr2.reference_type,
          'id', icr2.reference_id,
          'title', icr2.reference_title
        )) as shared_references
      FROM issue_cross_references icr1
      JOIN issue_cross_references icr2 
        ON icr1.reference_type = icr2.reference_type 
        AND icr1.reference_id = icr2.reference_id
      JOIN issues i2 ON icr2.issue_id = i2.id
      WHERE icr1.issue_id = ${issueId}
        AND icr2.issue_id != ${issueId}
      GROUP BY i2.id, i2.issue_number, i2.title, i2.issue_type
      HAVING COUNT(DISTINCT icr2.reference_id) >= ${minSharedReferences}
      ORDER BY shared_reference_count DESC
    `);
    return result.rows;
  }

  /**
   * Get comprehensive cross-reference statistics
   */
  async getCrossReferenceStatistics() {
    const totalRefs = await db.execute(sql`SELECT COUNT(*) FROM issue_cross_references`);
    const byType = await db.execute(sql`
      SELECT reference_type, COUNT(*) as count
      FROM issue_cross_references
      GROUP BY reference_type
      ORDER BY count DESC
    `);
    const consolidations = await db.execute(sql`
      SELECT consolidation_status, COUNT(*) as count
      FROM cross_reference_consolidations
      GROUP BY consolidation_status
      ORDER BY count DESC
    `);
    
    return {
      total_cross_references: parseInt(totalRefs.rows[0].count),
      references_by_type: byType.rows,
      consolidation_opportunities: consolidations.rows
    };
  }

  // ===== STATISTICS =====

  /**
   * Get statistics for hierarchical structure
   */
  async getHierarchyStatistics() {
    const featureCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM issues WHERE issue_type = 'feature'
    `);
    
    const taskCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM issues WHERE issue_type = 'task'
    `);
    
    const paragraphCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM issue_paragraphs
    `);
    
    const argumentCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM legal_arguments WHERE status = 'active'
    `);
    
    return {
      total_arguments: parseInt(argumentCount.rows[0].count),
      total_features: parseInt(featureCount.rows[0].count),
      total_paragraphs: parseInt(paragraphCount.rows[0].count),
      total_tasks: parseInt(taskCount.rows[0].count)
    };
  }
}

module.exports = HierarchicalIssueManager;

// CLI Interface
if (require.main === module) {
  const manager = new HierarchicalIssueManager();
  const command = process.argv[2];

  async function run() {
    try {
      switch(command) {
        case 'stats':
          const stats = await manager.getHierarchyStatistics();
          console.log('Hierarchical Issue Statistics:');
          console.log(JSON.stringify(stats, null, 2));
          break;

        case 'demo':
          console.log('Creating demo hierarchical structure...\n');
          
          // Create legal argument
          const arg = await manager.createLegalArgument(
            'Payment Structure Defense',
            'Prove RegimA Zone Ltd invested R1M while charging only R1K admin fee',
            'defense',
            'Show legitimate business structure, not profiteering'
          );
          console.log(`✅ Created legal argument: ${arg.argument_name}`);
          
          // Create feature issue
          const feature = await manager.createFeatureIssue(
            1001,
            'Revenue Stream Analysis',
            'Analyze payment structure to prove legitimate investment',
            'critical',
            arg.id
          );
          console.log(`✅ Created feature issue #${feature.issue_number}`);
          
          // Create paragraphs
          const para1 = await manager.createParagraph(
            feature.id,
            1,
            'Investment Structure',
            'RegimA Zone Ltd (UK) invested R1,000,000 in ZA operations',
            1,
            95
          );
          console.log(`✅ Created paragraph 1 (weight: 95)`);
          
          const para2 = await manager.createParagraph(
            feature.id,
            2,
            'Admin Fee Structure',
            'Only R1,000 (0.1%) charged as admin fee',
            2,
            90
          );
          console.log(`✅ Created paragraph 2 (weight: 90)`);
          
          // Create task issues
          const task1 = await manager.createTaskIssue(
            2001,
            'Document investment transactions',
            'Gather bank records showing R1M transfer',
            feature.id,
            para1.id,
            1,
            100,
            'high'
          );
          console.log(`✅ Created task issue #${task1.issue_number} under paragraph 1`);
          
          const task2 = await manager.createTaskIssue(
            2002,
            'Verify admin fee structure',
            'Show invoices with R1K admin fee',
            feature.id,
            para2.id,
            1,
            85,
            'high'
          );
          console.log(`✅ Created task issue #${task2.issue_number} under paragraph 2`);
          
          // Add cross-references
          console.log('\n🔗 Adding cross-references...');
          await manager.addCrossReference(
            task1.id,
            'evidence',
            'BANK_TRANSFER_R1M_001',
            'evidence/bank_records/regima_zone_transfer.pdf',
            'Bank Transfer Evidence - R1M Investment',
            'Page 3',
            'proves',
            'Primary evidence of R1M investment from UK entity'
          );
          console.log(`✅ Cross-referenced task #${task1.issue_number} to bank transfer evidence`);
          
          await manager.addCrossReference(
            task2.id,
            'document',
            'INVOICE_R1K_ADMIN_FEE',
            'evidence/invoices/admin_fee_invoice.pdf',
            'Admin Fee Invoice - R1K',
            null,
            'proves',
            'Shows 0.1% admin fee structure'
          );
          console.log(`✅ Cross-referenced task #${task2.issue_number} to admin fee invoice`);
          
          // Show hierarchy
          console.log('\n📊 Hierarchy Structure:');
          const hierarchy = await manager.getArgumentHierarchy(arg.id);
          console.log(JSON.stringify(hierarchy, null, 2));
          
          // Calculate strength
          const strength = await manager.calculateFeatureStrength(feature.id);
          console.log(`\n💪 Feature Strength: ${strength.toFixed(2)}%`);
          
          // Show cross-reference stats
          const xrefStats = await manager.getCrossReferenceStatistics();
          console.log('\n🔗 Cross-Reference Statistics:');
          console.log(JSON.stringify(xrefStats, null, 2));
          
          break;

        case 'consolidations':
          const opportunities = await manager.getConsolidationOpportunities();
          console.log('🔍 Consolidation Opportunities:');
          if (opportunities.length === 0) {
            console.log('  No consolidation opportunities detected.');
          } else {
            opportunities.forEach(opp => {
              console.log(`\n📦 ${opp.reference_type}: ${opp.reference_id}`);
              console.log(`   Issues affected: ${opp.issue_count}`);
              console.log(`   Status: ${opp.consolidation_status}`);
              console.log(`   Recommendation: ${opp.recommended_action}`);
            });
          }
          break;

        case 'xref-stats':
          const xrefStatsOnly = await manager.getCrossReferenceStatistics();
          console.log('📊 Cross-Reference Statistics:');
          console.log(JSON.stringify(xrefStatsOnly, null, 2));
          break;

        default:
          console.log('Hierarchical Issue Manager for Case 2025-137857');
          console.log('\nUsage:');
          console.log('  node hierarchical-issue-manager.js stats           - Show hierarchy statistics');
          console.log('  node hierarchical-issue-manager.js demo            - Run demo with cross-references');
          console.log('  node hierarchical-issue-manager.js consolidations  - Show consolidation opportunities');
          console.log('  node hierarchical-issue-manager.js xref-stats      - Show cross-reference statistics');
      }
      process.exit(0);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }

  run();
}
