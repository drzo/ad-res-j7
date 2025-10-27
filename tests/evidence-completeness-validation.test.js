#!/usr/bin/env node
/**
 * Test suite for evidence completeness validation scripts
 * Ensures both Python and JavaScript implementations work correctly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class EvidenceCompletenessValidationTest {
  constructor() {
    this.repoRoot = process.cwd();
    this.testsPassed = 0;
    this.testsFailed = 0;
    this.errors = [];
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('='.repeat(80));
    console.log('EVIDENCE COMPLETENESS VALIDATION TEST SUITE');
    console.log('='.repeat(80));
    console.log();

    // Test 1: Python script executes successfully
    await this.testPythonScriptExecution();

    // Test 2: JavaScript script executes successfully
    await this.testJavaScriptScriptExecution();

    // Test 3: Both scripts produce valid JSON reports
    await this.testJsonReportGeneration();

    // Test 4: Report contains core revelation information
    await this.testCoreRevelationPresent();

    // Test 5: Report validates all required phases
    await this.testRequiredPhasesValidated();

    // Test 6: Revenue stream linkage is validated
    await this.testRevenueStreamLinkage();

    // Print summary
    this.printTestSummary();

    // Return exit code
    return this.testsFailed === 0 ? 0 : 1;
  }

  /**
   * Test Python script execution
   */
  async testPythonScriptExecution() {
    const testName = "Python script executes successfully";
    console.log(`🧪 Testing: ${testName}`);

    try {
      const output = execSync(
        'python3 scripts/validate_evidence_completeness.py',
        { cwd: this.repoRoot, encoding: 'utf8', timeout: 60000 }
      );

      if (output.includes('EVIDENCE COMPLETENESS VALIDATION') && 
          output.includes('VALIDATION SUMMARY')) {
        this.testPassed(testName);
      } else {
        this.testFailed(testName, 'Output does not contain expected sections');
      }
    } catch (error) {
      this.testFailed(testName, error.message);
    }
  }

  /**
   * Test JavaScript script execution
   */
  async testJavaScriptScriptExecution() {
    const testName = "JavaScript script executes successfully";
    console.log(`🧪 Testing: ${testName}`);

    try {
      const output = execSync(
        'node scripts/validate-evidence-completeness.js',
        { cwd: this.repoRoot, encoding: 'utf8', timeout: 60000 }
      );

      if (output.includes('EVIDENCE COMPLETENESS VALIDATION') && 
          output.includes('VALIDATION SUMMARY')) {
        this.testPassed(testName);
      } else {
        this.testFailed(testName, 'Output does not contain expected sections');
      }
    } catch (error) {
      this.testFailed(testName, error.message);
    }
  }

  /**
   * Test JSON report generation
   */
  async testJsonReportGeneration() {
    const testName = "JSON report is generated and valid";
    console.log(`🧪 Testing: ${testName}`);

    try {
      const reportPath = path.join(this.repoRoot, 'evidence_completeness_validation_report.json');
      
      if (!fs.existsSync(reportPath)) {
        this.testFailed(testName, 'Report file does not exist');
        return;
      }

      const reportContent = fs.readFileSync(reportPath, 'utf8');
      const report = JSON.parse(reportContent);

      if (report.validationTimestamp && report.coreRevelation && report.completenessByPhase) {
        this.testPassed(testName);
      } else {
        this.testFailed(testName, 'Report missing required fields');
      }
    } catch (error) {
      this.testFailed(testName, error.message);
    }
  }

  /**
   * Test core revelation is present in report
   */
  async testCoreRevelationPresent() {
    const testName = "Core revelation about RegimA Zone Ltd is documented";
    console.log(`🧪 Testing: ${testName}`);

    try {
      const reportPath = path.join(this.repoRoot, 'evidence_completeness_validation_report.json');
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

      const revelation = report.coreRevelation;
      if (revelation && 
          revelation.keyFact && 
          revelation.keyFact.includes('RegimA Zone Ltd') &&
          revelation.criticalImplication &&
          revelation.criticalImplication.includes('RWD ZA')) {
        this.testPassed(testName);
      } else {
        this.testFailed(testName, 'Core revelation missing or incomplete');
      }
    } catch (error) {
      this.testFailed(testName, error.message);
    }
  }

  /**
   * Test all required phases are validated
   */
  async testRequiredPhasesValidated() {
    const testName = "All required phases are validated";
    console.log(`🧪 Testing: ${testName}`);

    try {
      const reportPath = path.join(this.repoRoot, 'evidence_completeness_validation_report.json');
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

      const phases = report.completenessByPhase;
      if (phases && 
          phases.phase1Critical && 
          phases.phase2HighPriority &&
          typeof phases.phase1Critical.completenessRate === 'number' &&
          typeof phases.phase2HighPriority.completenessRate === 'number') {
        this.testPassed(testName);
      } else {
        this.testFailed(testName, 'Required phases missing or incomplete');
      }
    } catch (error) {
      this.testFailed(testName, error.message);
    }
  }

  /**
   * Test revenue stream linkage validation
   */
  async testRevenueStreamLinkage() {
    const testName = "Revenue stream linkage is validated";
    console.log(`🧪 Testing: ${testName}`);

    try {
      const reportPath = path.join(this.repoRoot, 'evidence_completeness_validation_report.json');
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

      const linkage = report.revenueStreamLinkage;
      if (linkage && 
          linkage.categories &&
          linkage.completeness !== undefined &&
          linkage.meetsThreshold !== undefined) {
        this.testPassed(testName);
      } else {
        this.testFailed(testName, 'Revenue stream linkage missing or incomplete');
      }
    } catch (error) {
      this.testFailed(testName, error.message);
    }
  }

  /**
   * Mark test as passed
   */
  testPassed(testName) {
    console.log(`  ✅ PASS: ${testName}\n`);
    this.testsPassed++;
  }

  /**
   * Mark test as failed
   */
  testFailed(testName, reason) {
    console.log(`  ❌ FAIL: ${testName}`);
    console.log(`     Reason: ${reason}\n`);
    this.testsFailed++;
    this.errors.push({ test: testName, reason: reason });
  }

  /**
   * Print test summary
   */
  printTestSummary() {
    console.log('='.repeat(80));
    console.log('TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`\nTotal Tests: ${this.testsPassed + this.testsFailed}`);
    console.log(`✅ Passed: ${this.testsPassed}`);
    console.log(`❌ Failed: ${this.testsFailed}`);

    if (this.errors.length > 0) {
      console.log('\n❌ Failed Tests:');
      this.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.test}`);
        console.log(`     ${error.reason}`);
      });
    }

    console.log('\n' + '='.repeat(80));

    if (this.testsFailed === 0) {
      console.log('✅ All evidence completeness validation tests PASSED');
    } else {
      console.log('❌ Some evidence completeness validation tests FAILED');
    }
  }
}

// Main execution
async function main() {
  const tester = new EvidenceCompletenessValidationTest();
  const exitCode = await tester.runAllTests();
  process.exit(exitCode);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Test suite failed with error:', error);
    process.exit(1);
  });
}

module.exports = EvidenceCompletenessValidationTest;
