#!/usr/bin/env node
/**
 * Evidence Completeness Validation Script
 * Implementation of Phase 3 - Advanced QA (Line 150 from Repository_Status_and_Critical_Evidence_Collection.md)
 * 
 * This script validates evidence completeness and links each aspect to the underlying revelation:
 * - Dan & Kay Shopify platform was paid by Dan & Jax UK company RegimA Zone Ltd
 * - RWD ZA actually has no revenue stream of its own
 */

const fs = require('fs');
const path = require('path');

class EvidenceCompletenessValidator {
  constructor(repoRoot = process.cwd()) {
    this.repoRoot = repoRoot;
    this.errors = [];
    this.warnings = [];
    this.passed = [];
    
    // Core revelation that all evidence must link to
    this.coreRevelation = {
      keyFact: "Dan & Kay Shopify platform paid by RegimA Zone Ltd (UK company)",
      criticalImplication: "RWD ZA has no independent revenue stream",
      evidenceRequirement: "All financial evidence must demonstrate this payment flow"
    };
    
    // Evidence categories from Repository_Status_and_Critical_Evidence_Collection.md
    this.evidenceCategories = {
      phase1Critical: [
        "JF-RP1",  // Responsible Person documentation (37 jurisdictions)
        "JF-RP2",  // Regulatory risk analysis
        "JF-DLA1", "JF-DLA2", "JF-DLA3",  // Director loan accounts
        "JF-PA1", "JF-PA2", "JF-PA3", "JF-PA4",  // Peter's withdrawals
        "JF-BS1",  // R500K payment statement (16 July 2025)
        "JF5-DRAFT", "JF5-FINAL", "JF5-COMPARISON",  // Settlement agreements
        "JF-UKTAX1",  // UK tax residency
        "JF-CHESNO1", "JF-CHESNO2", "JF-CHESNO3", "JF-CHESNO4",  // Chesno fraud
        "JF-RESTORE1", "JF-RESTORE2", "JF-RESTORE3", "JF-RESTORE4"  // 8-year restoration
      ],
      phase2HighPriority: [
        "JF-SAL1", "JF-EAL1", "JF-FSL1",  // System access logs
        "JF-CORR1",  // Correspondence evidence
        "JF-ITS1",  // IT service invoices
        "JF-HIST1", "JF-HIST2", "JF-HIST3",  // Historical collaborative model
        "JF-RF1", "JF-RF2", "JF-RF3",  // Rynette's access expansion
        "JF-EX1", "JF-EX2", "JF-EX3", "JF-EX4"  // Director exclusion
      ],
      revenueStreamEvidence: [
        // Evidence that directly links to RegimA Zone Ltd payments
        "SHOPIFY_PAYMENT_RECORDS",
        "REGIMA_ZONE_LTD_UK_COMPANY_DOCS",
        "RWD_ZA_REVENUE_ANALYSIS",
        "DAN_KAY_PLATFORM_EVIDENCE",
        "UK_TO_SA_PAYMENT_FLOWS"
      ]
    };
    
    // Evidence completeness thresholds
    this.completenessThresholds = {
      phase1Critical: 0.80,  // 80% required
      phase2HighPriority: 0.60,  // 60% required
      overall: 0.70,  // 70% overall required
      revenueStream: 1.00  // 100% required for core revelation
    };
  }
  
  /**
   * Run complete evidence completeness validation
   */
  async validateAllEvidence() {
    console.log("=".repeat(80));
    console.log("EVIDENCE COMPLETENESS VALIDATION");
    console.log("=".repeat(80));
    console.log(`\nCore Revelation: ${this.coreRevelation.keyFact}`);
    console.log(`Critical Implication: ${this.coreRevelation.criticalImplication}\n`);
    console.log("=".repeat(80));
    console.log();
    
    const results = {
      validationTimestamp: new Date().toISOString(),
      coreRevelation: this.coreRevelation,
      completenessByPhase: {},
      revenueStreamLinkage: {},
      overallCompleteness: 0.0,
      passedThreshold: false,
      recommendations: []
    };
    
    // Validate Phase 1 Critical Evidence
    console.log("📋 Phase 1: Critical Evidence (Must-Do)");
    console.log("-".repeat(80));
    results.completenessByPhase.phase1Critical = this.validateEvidencePhase("phase1Critical");
    
    // Validate Phase 2 High Priority Evidence
    console.log("\n📋 Phase 2: High Priority Evidence (Should-Do)");
    console.log("-".repeat(80));
    results.completenessByPhase.phase2HighPriority = this.validateEvidencePhase("phase2HighPriority");
    
    // Validate Revenue Stream Evidence (Core Revelation)
    console.log("\n💰 Revenue Stream Evidence (Core Revelation)");
    console.log("-".repeat(80));
    results.revenueStreamLinkage = this.validateRevenueStreamEvidence();
    
    // Calculate overall completeness
    const totalEvidence = this.evidenceCategories.phase1Critical.length + 
                         this.evidenceCategories.phase2HighPriority.length;
    const totalFound = results.completenessByPhase.phase1Critical.found + 
                      results.completenessByPhase.phase2HighPriority.found;
    results.overallCompleteness = totalEvidence > 0 ? totalFound / totalEvidence : 0.0;
    results.passedThreshold = results.overallCompleteness >= this.completenessThresholds.overall;
    
    // Generate recommendations
    results.recommendations = this.generateRecommendations(results);
    
    // Print summary
    this.printValidationSummary(results);
    
    return results;
  }
  
  /**
   * Validate evidence completeness for a specific phase
   */
  validateEvidencePhase(phaseKey) {
    const evidenceCodes = this.evidenceCategories[phaseKey];
    const foundEvidence = [];
    const missingEvidence = [];
    
    for (const code of evidenceCodes) {
      const evidenceFiles = this.findEvidenceByCode(code);
      
      if (evidenceFiles.length > 0) {
        const status = "✅ FOUND";
        foundEvidence.push(code);
        this.passed.push({
          code: code,
          files: evidenceFiles,
          phase: phaseKey
        });
        
        // Check linkage to core revelation
        const linkageScore = this.checkRevenueStreamLinkage(evidenceFiles);
        const linkageIndicator = linkageScore > 0 ? "🔗" : "⚪";
        
        console.log(`  ${status} ${linkageIndicator} ${code}: ${evidenceFiles.length} file(s)`);
      } else {
        const status = "❌ MISSING";
        missingEvidence.push(code);
        this.errors.push({
          code: code,
          phase: phaseKey,
          error: "No evidence files found"
        });
        console.log(`  ${status} ${code}`);
      }
    }
    
    const completenessRate = evidenceCodes.length > 0 ? foundEvidence.length / evidenceCodes.length : 0.0;
    const threshold = this.completenessThresholds[phaseKey] || 0.70;
    const meetsThreshold = completenessRate >= threshold;
    
    console.log(`\n  Completeness: ${(completenessRate * 100).toFixed(1)}% (${foundEvidence.length}/${evidenceCodes.length})`);
    console.log(`  Threshold: ${(threshold * 100).toFixed(1)}% - ${meetsThreshold ? '✅ PASS' : '❌ FAIL'}`);
    
    return {
      total: evidenceCodes.length,
      found: foundEvidence.length,
      missing: missingEvidence.length,
      completenessRate: completenessRate,
      meetsThreshold: meetsThreshold,
      missingCodes: missingEvidence
    };
  }
  
  /**
   * Validate evidence linking to core revelation about RegimA Zone Ltd payments
   */
  validateRevenueStreamEvidence() {
    const revenueEvidence = {
      shopifyPaymentRecords: this.findShopifyPaymentEvidence(),
      regimaZoneLtdUk: this.findRegimaZoneEvidence(),
      rwdZaRevenueAnalysis: this.findRwdZaRevenueEvidence(),
      danKayPlatform: this.findDanKayPlatformEvidence(),
      ukSaPaymentFlows: this.findUkSaPaymentFlows()
    };
    
    const totalCategories = Object.keys(revenueEvidence).length;
    const foundCategories = Object.values(revenueEvidence).filter(v => v.found).length;
    
    for (const [category, result] of Object.entries(revenueEvidence)) {
      const status = result.found ? "✅" : "❌";
      console.log(`  ${status} ${category}: ${result.files.length} file(s)`);
      if (result.found) {
        for (const file of result.files.slice(0, 3)) {  // Show first 3 files
          console.log(`      - ${file}`);
        }
      }
    }
    
    const completeness = totalCategories > 0 ? foundCategories / totalCategories : 0.0;
    const meetsThreshold = completeness >= this.completenessThresholds.revenueStream;
    
    console.log(`\n  Revenue Stream Evidence: ${(completeness * 100).toFixed(1)}% (${foundCategories}/${totalCategories})`);
    console.log(`  Threshold: ${(this.completenessThresholds.revenueStream * 100).toFixed(1)}% - ${meetsThreshold ? '✅ PASS' : '⚠️ CRITICAL'}`);
    
    return {
      categories: revenueEvidence,
      completeness: completeness,
      meetsThreshold: meetsThreshold,
      criticalMissing: Object.entries(revenueEvidence)
        .filter(([k, v]) => !v.found)
        .map(([k, v]) => k)
    };
  }
  
  /**
   * Find all evidence files matching a specific code
   */
  findEvidenceByCode(evidenceCode) {
    const evidenceFiles = [];
    const searchPaths = [
      path.join(this.repoRoot, "evidence"),
      path.join(this.repoRoot, "jax-response", "evidence-attachments"),
      path.join(this.repoRoot, "FINAL_AFFIDAVIT_PACKAGE", "ANNEXURES"),
      path.join(this.repoRoot, "case_2025_137857", "02_evidence")
    ];
    
    // Normalize code for searching
    const codeVariants = [
      evidenceCode,
      evidenceCode.replace(/-/g, ""),
      evidenceCode.replace(/-/g, "_"),
      evidenceCode.toLowerCase(),
      evidenceCode.toUpperCase()
    ];
    
    for (const searchPath of searchPaths) {
      if (fs.existsSync(searchPath)) {
        this.searchFilesRecursive(searchPath, codeVariants, evidenceFiles);
      }
    }
    
    return evidenceFiles;
  }
  
  /**
   * Recursively search for files matching code variants
   */
  searchFilesRecursive(dir, codeVariants, results) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          this.searchFilesRecursive(fullPath, codeVariants, results);
        } else {
          // Check if filename contains any variant of the code
          if (codeVariants.some(variant => item.includes(variant))) {
            results.push(path.relative(this.repoRoot, fullPath));
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }
  
  /**
   * Find evidence of Shopify platform payments
   */
  findShopifyPaymentEvidence() {
    const keywords = ["shopify", "payment", "platform", "e-commerce"];
    const files = this.searchByKeywords(keywords);
    return { found: files.length > 0, files: files };
  }
  
  /**
   * Find evidence of RegimA Zone Ltd (UK company)
   */
  findRegimaZoneEvidence() {
    const keywords = ["regima zone", "regima zone ltd", "uk company", "united kingdom"];
    const files = this.searchByKeywords(keywords);
    return { found: files.length > 0, files: files };
  }
  
  /**
   * Find evidence about RWD ZA's revenue stream (or lack thereof)
   */
  findRwdZaRevenueEvidence() {
    const keywords = ["rwd za", "rwd south africa", "revenue stream", "no revenue"];
    const files = this.searchByKeywords(keywords);
    
    // Also check Revenue_Stream_Hijacking_by_Rynette directory
    const hijackingDir = path.join(this.repoRoot, "Revenue_Stream_Hijacking_by_Rynette");
    if (fs.existsSync(hijackingDir)) {
      this.findMarkdownFiles(hijackingDir, files);
    }
    
    // Remove duplicates
    return { found: files.length > 0, files: [...new Set(files)] };
  }
  
  /**
   * Find evidence of Dan & Kay platform operations
   */
  findDanKayPlatformEvidence() {
    const keywords = ["dan", "kay", "daniel", "platform", "shopify"];
    const files = this.searchByKeywords(keywords);
    return { found: files.length > 0, files: files };
  }
  
  /**
   * Find evidence of UK to South Africa payment flows
   */
  findUkSaPaymentFlows() {
    const keywords = ["uk to sa", "united kingdom", "south africa", "payment flow", "cross-border"];
    const files = this.searchByKeywords(keywords);
    return { found: files.length > 0, files: files };
  }
  
  /**
   * Search for files containing specific keywords in content or filename
   */
  searchByKeywords(keywords) {
    const matchingFiles = [];
    const searchPaths = [
      path.join(this.repoRoot, "evidence"),
      path.join(this.repoRoot, "jax-response"),
      path.join(this.repoRoot, "FINAL_AFFIDAVIT_PACKAGE"),
      path.join(this.repoRoot, "Revenue_Stream_Hijacking_by_Rynette"),
      path.join(this.repoRoot, "case_2025_137857")
    ];
    
    for (const searchPath of searchPaths) {
      if (fs.existsSync(searchPath)) {
        this.searchKeywordsRecursive(searchPath, keywords, matchingFiles);
      }
    }
    
    // Remove duplicates
    return [...new Set(matchingFiles)];
  }
  
  /**
   * Recursively search for keywords in markdown files
   */
  searchKeywordsRecursive(dir, keywords, results) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          this.searchKeywordsRecursive(fullPath, keywords, results);
        } else if (fullPath.endsWith('.md')) {
          // Check filename
          const filenameLower = item.toLowerCase();
          if (keywords.some(keyword => filenameLower.includes(keyword.toLowerCase()))) {
            results.push(path.relative(this.repoRoot, fullPath));
            continue;
          }
          
          // Check content
          try {
            const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
            if (keywords.some(keyword => content.includes(keyword.toLowerCase()))) {
              results.push(path.relative(this.repoRoot, fullPath));
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }
  
  /**
   * Find all markdown files in a directory
   */
  findMarkdownFiles(dir, results) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          this.findMarkdownFiles(fullPath, results);
        } else if (fullPath.endsWith('.md')) {
          results.push(path.relative(this.repoRoot, fullPath));
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }
  
  /**
   * Check if evidence files link to the core revenue stream revelation
   * Returns a score from 0.0 to 1.0
   */
  checkRevenueStreamLinkage(evidenceFiles) {
    if (evidenceFiles.length === 0) {
      return 0.0;
    }
    
    const linkageKeywords = [
      "regima zone",
      "shopify",
      "revenue stream",
      "uk company",
      "payment",
      "rwd za"
    ];
    
    let totalScore = 0.0;
    for (const file of evidenceFiles) {
      try {
        const fullPath = path.join(this.repoRoot, file);
        if (fullPath.endsWith('.md')) {
          const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
          const matches = linkageKeywords.filter(keyword => content.includes(keyword)).length;
          totalScore += matches / linkageKeywords.length;
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
    
    return evidenceFiles.length > 0 ? totalScore / evidenceFiles.length : 0.0;
  }
  
  /**
   * Generate actionable recommendations based on validation results
   */
  generateRecommendations(results) {
    const recommendations = [];
    
    // Phase 1 Critical recommendations
    const phase1 = results.completenessByPhase.phase1Critical || {};
    if (!phase1.meetsThreshold) {
      const missing = phase1.missingCodes || [];
      recommendations.push({
        priority: "CRITICAL",
        category: "Phase 1 Critical Evidence",
        action: `Collect ${missing.length} missing critical evidence items: ${missing.slice(0, 5).join(', ')}`,
        impact: "Required to meet 80% Phase 1 threshold"
      });
    }
    
    // Revenue stream recommendations
    const revenue = results.revenueStreamLinkage || {};
    if (!revenue.meetsThreshold) {
      const missing = revenue.criticalMissing || [];
      recommendations.push({
        priority: "CRITICAL",
        category: "Revenue Stream Evidence",
        action: `Document core revelation: ${missing.join(', ')}`,
        impact: "Essential to prove RegimA Zone Ltd payment structure and RWD ZA's lack of independent revenue"
      });
    }
    
    // Phase 2 recommendations
    const phase2 = results.completenessByPhase.phase2HighPriority || {};
    if (!phase2.meetsThreshold) {
      recommendations.push({
        priority: "HIGH",
        category: "Phase 2 High Priority Evidence",
        action: `Collect ${phase2.missing || 0} high priority evidence items`,
        impact: "Strengthens case and provides supporting documentation"
      });
    }
    
    // Overall recommendations
    if (!results.passedThreshold) {
      recommendations.push({
        priority: "HIGH",
        category: "Overall Completeness",
        action: `Increase overall evidence completeness from ${(results.overallCompleteness * 100).toFixed(1)}% to ${(this.completenessThresholds.overall * 100).toFixed(1)}%`,
        impact: "Required for court submission readiness"
      });
    }
    
    return recommendations;
  }
  
  /**
   * Print a comprehensive validation summary
   */
  printValidationSummary(results) {
    console.log("\n" + "=".repeat(80));
    console.log("VALIDATION SUMMARY");
    console.log("=".repeat(80));
    
    console.log(`\nOverall Completeness: ${(results.overallCompleteness * 100).toFixed(1)}%`);
    console.log(`Threshold Required: ${(this.completenessThresholds.overall * 100).toFixed(1)}%`);
    console.log(`Status: ${results.passedThreshold ? '✅ PASS' : '❌ FAIL'}`);
    
    console.log(`\n📊 Phase Breakdown:`);
    for (const [phase, data] of Object.entries(results.completenessByPhase)) {
      const status = data.meetsThreshold ? "✅" : "❌";
      console.log(`  ${status} ${phase}: ${(data.completenessRate * 100).toFixed(1)}% (${data.found}/${data.total})`);
    }
    
    const revenue = results.revenueStreamLinkage || {};
    const status = revenue.meetsThreshold ? "✅" : "⚠️";
    console.log(`  ${status} revenueStreamEvidence: ${((revenue.completeness || 0) * 100).toFixed(1)}%`);
    
    console.log(`\n💡 Recommendations (${results.recommendations.length} items):`);
    for (let i = 0; i < Math.min(5, results.recommendations.length); i++) {
      const rec = results.recommendations[i];
      console.log(`  ${i + 1}. [${rec.priority}] ${rec.category}`);
      console.log(`     Action: ${rec.action}`);
      console.log(`     Impact: ${rec.impact}`);
    }
    
    console.log("\n" + "=".repeat(80));
  }
  
  /**
   * Export validation results to JSON file
   */
  exportResults(results, outputFile = "evidence_completeness_validation_report.json") {
    const outputPath = path.join(this.repoRoot, outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log(`\n📁 Results exported to: ${outputFile}`);
    return outputPath;
  }
}

// Main execution
async function main() {
  const validator = new EvidenceCompletenessValidator();
  const results = await validator.validateAllEvidence();
  
  // Export results
  validator.exportResults(results);
  
  // Exit with appropriate code
  if (results.passedThreshold) {
    console.log("\n✅ Evidence completeness validation PASSED");
    process.exit(0);
  } else {
    console.log("\n❌ Evidence completeness validation FAILED");
    console.log("   Please address the recommendations above before court submission");
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error("❌ Validation failed with error:", error);
    process.exit(1);
  });
}

// Export for use as a module
module.exports = EvidenceCompletenessValidator;
