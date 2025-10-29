#!/usr/bin/env node

/**
 * Repository Structure Integrity Test
 * 
 * Purpose: Validate repository structure integrity and evidence organization
 * Context: Implementation of Nice-to-Have (Phase 3) - Advanced QA
 * Source: todo/Repository_Status_and_Critical_Evidence_Collection.md line 178
 * 
 * Key Validation Areas:
 * 1. Core directory structure presence and organization
 * 2. Evidence file organization and accessibility
 * 3. Shopify payment evidence trail verification
 * 4. RegimA Zone Ltd payment documentation linkage
 * 5. RWD ZA revenue stream analysis verification
 * 
 * Critical Context (per agent instructions):
 * - Dan & Kay Shopify platform was paid by Dan & Jax UK company RegimA Zone Ltd
 * - RWD ZA actually has no revenue stream of its own
 * - All aspects of structure should link to this underlying revelation
 */

const fs = require('fs');
const path = require('path');

class RepositoryStructureIntegrityTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.repoRoot = path.resolve(__dirname, '..');
    this.structureMetrics = {
      required_directories: 0,
      missing_directories: 0,
      evidence_files: 0,
      shopify_references: 0,
      regima_zone_references: 0,
      revenue_stream_evidence: 0
    };
  }

  log(message) {
    console.log(message);
  }

  assert(condition, message) {
    if (!condition) {
      this.errors.push(message);
      throw new Error(message);
    }
  }

  runTest(testName, testFn) {
    try {
      testFn();
      this.testResults.push({
        name: testName,
        passed: true,
        message: `✓ ${testName}`
      });
      this.log(`✓ ${testName}`);
      return true;
    } catch (error) {
      this.testResults.push({
        name: testName,
        passed: false,
        message: `✗ ${testName}: ${error.message}`
      });
      this.log(`✗ ${testName}: ${error.message}`);
      return false;
    }
  }

  // Test 1: Core Directory Structure Validation
  testCoreDirectoryStructure() {
    return this.runTest('Core directory structure is intact', () => {
      const requiredDirs = [
        'affidavit_work',
        'evidence',
        'jax-response',
        'FINAL_AFFIDAVIT_PACKAGE',
        'tests',
        'todo',
        'db',
        'scripts',
        'docs'
      ];

      let missingDirs = [];
      requiredDirs.forEach(dir => {
        const dirPath = path.join(this.repoRoot, dir);
        if (fs.existsSync(dirPath)) {
          this.structureMetrics.required_directories++;
        } else {
          this.structureMetrics.missing_directories++;
          missingDirs.push(dir);
        }
      });

      this.assert(
        missingDirs.length === 0,
        `Missing required directories: ${missingDirs.join(', ')}`
      );
    });
  }

  // Test 2: Evidence Organization Validation
  testEvidenceOrganization() {
    return this.runTest('Evidence directory is properly organized', () => {
      const evidenceDir = path.join(this.repoRoot, 'evidence');
      this.assert(
        fs.existsSync(evidenceDir),
        'Evidence directory must exist'
      );

      const expectedSubdirs = [
        'annexures',
        'correspondence',
        'bank_records',
        'shopify_reports'
      ];

      let foundSubdirs = 0;
      expectedSubdirs.forEach(subdir => {
        const subdirPath = path.join(evidenceDir, subdir);
        if (fs.existsSync(subdirPath)) {
          foundSubdirs++;
        }
      });

      // At least 2 of the expected subdirectories should exist
      this.assert(
        foundSubdirs >= 2,
        `Evidence directory should contain at least 2 of these subdirectories: ${expectedSubdirs.join(', ')}`
      );
    });
  }

  // Test 3: Shopify Payment Evidence Trail Verification
  testShopifyPaymentEvidenceTrail() {
    return this.runTest('Shopify payment evidence trail is documented', () => {
      // Search for Shopify-related evidence files
      const searchDirs = [
        path.join(this.repoRoot, 'evidence'),
        path.join(this.repoRoot, 'FINAL_AFFIDAVIT_PACKAGE'),
        path.join(this.repoRoot, 'jax-response')
      ];

      let shopifyReferences = 0;
      
      const searchForShopifyReferences = (dir) => {
        if (!fs.existsSync(dir)) return;
        
        const files = fs.readdirSync(dir, { withFileTypes: true });
        files.forEach(file => {
          const fullPath = path.join(dir, file.name);
          
          if (file.isDirectory()) {
            searchForShopifyReferences(fullPath);
          } else if (file.isFile() && file.name.endsWith('.md')) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              if (content.toLowerCase().includes('shopify')) {
                shopifyReferences++;
              }
            } catch (err) {
              // Skip files that can't be read
            }
          }
        });
      };

      searchDirs.forEach(dir => searchForShopifyReferences(dir));
      this.structureMetrics.shopify_references = shopifyReferences;

      this.assert(
        shopifyReferences > 0,
        'Repository must contain Shopify payment evidence documentation'
      );
    });
  }

  // Test 4: RegimA Zone Ltd Payment Documentation
  testRegimaZonePaymentDocumentation() {
    return this.runTest('RegimA Zone Ltd payment documentation exists', () => {
      // Search for RegimA Zone references
      const searchDirs = [
        path.join(this.repoRoot, 'evidence'),
        path.join(this.repoRoot, 'FINAL_AFFIDAVIT_PACKAGE'),
        path.join(this.repoRoot, 'jax-response')
      ];

      let regimaReferences = 0;
      
      const searchForRegimaReferences = (dir) => {
        if (!fs.existsSync(dir)) return;
        
        const files = fs.readdirSync(dir, { withFileTypes: true });
        files.forEach(file => {
          const fullPath = path.join(dir, file.name);
          
          if (file.isDirectory()) {
            searchForRegimaReferences(fullPath);
          } else if (file.isFile() && file.name.endsWith('.md')) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              if (content.includes('RegimA Zone')) {
                regimaReferences++;
              }
            } catch (err) {
              // Skip files that can't be read
            }
          }
        });
      };

      searchDirs.forEach(dir => searchForRegimaReferences(dir));
      this.structureMetrics.regima_zone_references = regimaReferences;

      this.assert(
        regimaReferences > 0,
        'Repository must contain RegimA Zone Ltd payment documentation linking to Shopify platform payments'
      );
    });
  }

  // Test 5: Revenue Stream Evidence Validation
  testRevenueStreamEvidence() {
    return this.runTest('RWD ZA revenue stream analysis is documented', () => {
      // Search for revenue stream analysis
      const jaxResponseDir = path.join(this.repoRoot, 'jax-response');
      
      this.assert(
        fs.existsSync(jaxResponseDir),
        'jax-response directory must exist for revenue analysis'
      );

      // Check for revenue-related directories
      const revenueRelatedDirs = [
        'revenue-theft',
        'financial-flows',
        'family-trust'
      ];

      let foundRevenueDirs = 0;
      revenueRelatedDirs.forEach(dir => {
        const dirPath = path.join(jaxResponseDir, dir);
        if (fs.existsSync(dirPath)) {
          foundRevenueDirs++;
          this.structureMetrics.revenue_stream_evidence++;
        }
      });

      this.assert(
        foundRevenueDirs > 0,
        'Repository must contain revenue stream analysis documenting RWD ZA lack of independent revenue stream'
      );
    });
  }

  // Test 6: Critical Evidence Cross-Reference
  testCriticalEvidenceCrossReference() {
    return this.runTest('Critical evidence files are cross-referenced', () => {
      // Check for comprehensive evidence index
      const indexFiles = [
        'COMPREHENSIVE_EVIDENCE_INDEX.md',
        'COMPREHENSIVE_EVIDENCE_INDEX.json',
        'REPOSITORY_STRUCTURE.md',
        'REPOSITORY_STRUCTURE.json'
      ];

      let foundIndexFiles = 0;
      indexFiles.forEach(file => {
        const filePath = path.join(this.repoRoot, file);
        if (fs.existsSync(filePath)) {
          foundIndexFiles++;
        }
      });

      this.assert(
        foundIndexFiles >= 2,
        'Repository must contain comprehensive evidence index for cross-referencing'
      );
    });
  }

  // Test 7: Payment Trail Linkage Documentation
  testPaymentTrailLinkage() {
    return this.runTest('Dan & Jax UK to Shopify payment trail is documented', () => {
      // Search for documentation linking Dan & Jax UK company payments to Shopify
      const searchDirs = [
        path.join(this.repoRoot, 'jax-response'),
        path.join(this.repoRoot, 'FINAL_AFFIDAVIT_PACKAGE')
      ];

      let paymentLinkageFound = false;
      
      const searchForPaymentLinkage = (dir) => {
        if (!fs.existsSync(dir)) return;
        
        const files = fs.readdirSync(dir, { withFileTypes: true });
        files.forEach(file => {
          const fullPath = path.join(dir, file.name);
          
          if (file.isDirectory()) {
            searchForPaymentLinkage(fullPath);
          } else if (file.isFile() && file.name.endsWith('.md')) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              // Check if document contains references to both Shopify and UK company payments
              if ((content.includes('Shopify') || content.includes('shopify')) &&
                  (content.includes('RegimA Zone') || content.includes('UK'))) {
                paymentLinkageFound = true;
              }
            } catch (err) {
              // Skip files that can't be read
            }
          }
        });
      };

      searchDirs.forEach(dir => searchForPaymentLinkage(dir));

      this.assert(
        paymentLinkageFound,
        'Repository must document the payment trail from Dan & Jax UK company (RegimA Zone Ltd) to Shopify platform'
      );
    });
  }

  // Test 8: Repository Structure Metadata
  testRepositoryStructureMetadata() {
    return this.runTest('Repository structure metadata is up-to-date', () => {
      const structureFile = path.join(this.repoRoot, 'REPOSITORY_STRUCTURE.md');
      
      this.assert(
        fs.existsSync(structureFile),
        'REPOSITORY_STRUCTURE.md must exist'
      );

      const content = fs.readFileSync(structureFile, 'utf8');
      
      // Verify it contains key sections
      const requiredSections = [
        'jax-response',
        'evidence',
        'affidavit'
      ];

      let foundSections = 0;
      requiredSections.forEach(section => {
        if (content.toLowerCase().includes(section.toLowerCase())) {
          foundSections++;
        }
      });

      this.assert(
        foundSections === requiredSections.length,
        `REPOSITORY_STRUCTURE.md must document key sections: ${requiredSections.join(', ')}`
      );
    });
  }

  // Main test runner
  runAllTests() {
    this.log('\n🏗️  Repository Structure Integrity Test Suite');
    this.log('=' .repeat(80));
    this.log('Purpose: Validate repository structure and evidence organization');
    this.log('Context: Shopify platform paid by RegimA Zone Ltd (Dan & Jax UK)');
    this.log('Critical: RWD ZA has no independent revenue stream');
    this.log('=' .repeat(80) + '\n');

    // Run all tests
    this.testCoreDirectoryStructure();
    this.testEvidenceOrganization();
    this.testShopifyPaymentEvidenceTrail();
    this.testRegimaZonePaymentDocumentation();
    this.testRevenueStreamEvidence();
    this.testCriticalEvidenceCrossReference();
    this.testPaymentTrailLinkage();
    this.testRepositoryStructureMetadata();

    // Summary
    this.log('\n' + '=' .repeat(80));
    this.log('📊 Structure Integrity Metrics:');
    this.log(`   Required Directories Found: ${this.structureMetrics.required_directories}`);
    this.log(`   Missing Directories: ${this.structureMetrics.missing_directories}`);
    this.log(`   Shopify References: ${this.structureMetrics.shopify_references}`);
    this.log(`   RegimA Zone References: ${this.structureMetrics.regima_zone_references}`);
    this.log(`   Revenue Stream Evidence Dirs: ${this.structureMetrics.revenue_stream_evidence}`);
    this.log('=' .repeat(80));

    const passed = this.testResults.filter(t => t.passed).length;
    const failed = this.testResults.filter(t => !t.passed).length;

    this.log(`\n✅ Tests Passed: ${passed}`);
    this.log(`❌ Tests Failed: ${failed}`);
    this.log(`📈 Success Rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%\n`);

    if (failed > 0) {
      this.log('⚠️  Failed Tests:');
      this.testResults.filter(t => !t.passed).forEach(t => {
        this.log(`   - ${t.message}`);
      });
      this.log('');
    }

    return failed === 0;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const test = new RepositoryStructureIntegrityTest();
  const success = test.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = RepositoryStructureIntegrityTest;
