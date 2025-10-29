#!/usr/bin/env python3
"""
Test Suite for Automated Cross-Reference Checking System

Tests the automated cross-reference checker that validates links to:
1. Dan & Kay Shopify platform paid by RegimA Zone Ltd (UK)
2. RWD ZA has no independent revenue stream

This test validates:
- Core revelation detection accuracy
- Critical file validation
- Report generation
- Error and warning detection
"""

import sys
import os
import json
import unittest
from pathlib import Path

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from automated_cross_reference_checker import CrossReferenceChecker, CoreRevelation


class TestAutomatedCrossReferenceChecker(unittest.TestCase):
    """Test cases for automated cross-reference checker"""
    
    @classmethod
    def setUpClass(cls):
        """Set up test environment"""
        cls.repo_root = Path(__file__).parent.parent
        cls.checker = CrossReferenceChecker(str(cls.repo_root))
    
    def test_initialization(self):
        """Test checker initializes correctly"""
        self.assertIsNotNone(self.checker)
        self.assertEqual(len(self.checker.core_revelations), 4)
        self.assertGreater(len(self.checker.critical_files), 0)
        self.assertGreater(len(self.checker.scan_directories), 0)
    
    def test_core_revelations_defined(self):
        """Test core revelations are properly defined"""
        expected_revelations = [
            "shopify_platform_payment",
            "rwd_no_revenue",
            "platform_cost_nonpayment",
            "unjust_enrichment"
        ]
        
        for rev_key in expected_revelations:
            self.assertIn(rev_key, self.checker.core_revelations)
            revelation = self.checker.core_revelations[rev_key]
            self.assertIsInstance(revelation, CoreRevelation)
            self.assertGreater(len(revelation.keywords), 0)
            self.assertGreater(len(revelation.evidence_codes), 0)
    
    def test_shopify_platform_revelation(self):
        """Test Shopify platform payment revelation keywords"""
        revelation = self.checker.core_revelations["shopify_platform_payment"]
        
        # Check key keywords are present
        keywords = [k.lower() for k in revelation.keywords]
        self.assertTrue(any("regima zone" in k for k in keywords))
        self.assertTrue(any("shopify" in k for k in keywords))
        self.assertTrue(any("uk" in k for k in keywords))
        
        # Check evidence codes
        self.assertIn("JF02", revelation.evidence_codes)
        self.assertIn("JF08", revelation.evidence_codes)
    
    def test_rwd_no_revenue_revelation(self):
        """Test RWD no revenue stream revelation keywords"""
        revelation = self.checker.core_revelations["rwd_no_revenue"]
        
        # Check key keywords are present
        keywords = [k.lower() for k in revelation.keywords]
        self.assertTrue(any("rwd" in k and "revenue" in k for k in keywords))
        self.assertTrue(any("no stock" in k for k in keywords))
        self.assertTrue(any("no inventory" in k for k in keywords))
    
    def test_find_markdown_files(self):
        """Test markdown file discovery"""
        # Test with a directory that exists
        md_files = self.checker.find_markdown_files("jax-response/AD/1-Critical")
        self.assertGreater(len(md_files), 0)
        
        # All results should be Path objects
        for f in md_files:
            self.assertIsInstance(f, Path)
            self.assertTrue(f.suffix == ".md")
    
    def test_check_file_for_revelation(self):
        """Test checking a file for revelation references"""
        # Use RWD_REVENUE_INTEGRITY_ANALYSIS.md which should have all revelations
        test_file = self.repo_root / "jax-response/AD/1-Critical/RWD_REVENUE_INTEGRITY_ANALYSIS.md"
        
        if test_file.exists():
            revelation = self.checker.core_revelations["shopify_platform_payment"]
            result = self.checker.check_file_for_revelation(test_file, revelation)
            
            self.assertIn("file", result)
            self.assertIn("matches", result)
            self.assertIn("has_reference", result)
            
            # This file should have references to Shopify platform payment
            self.assertTrue(result["has_reference"])
            self.assertGreater(len(result["matches"]), 0)
    
    def test_validate_critical_files(self):
        """Test critical file validation"""
        results = self.checker.validate_critical_files()
        
        self.assertIn("missing_references", results)
        self.assertIn("complete_references", results)
        self.assertIn("file_not_found", results)
        
        # At least some files should have complete references
        total_validated = (len(results["complete_references"]) + 
                          len(results["missing_references"]))
        self.assertGreater(total_validated, 0)
    
    def test_generate_cross_reference_report(self):
        """Test report generation"""
        report = self.checker.generate_cross_reference_report()
        
        # Check report structure
        self.assertIn("generated_at", report)
        self.assertIn("summary", report)
        self.assertIn("core_revelations", report)
        self.assertIn("critical_files_validation", report)
        self.assertIn("document_scan", report)
        self.assertIn("errors", report)
        self.assertIn("warnings", report)
        
        # Check summary
        summary = report["summary"]
        self.assertIn("total_errors", summary)
        self.assertIn("total_warnings", summary)
        self.assertIn("critical_files_validated", summary)
        
        # Check core revelations stats
        for rev_key in self.checker.core_revelations.keys():
            self.assertIn(rev_key, report["core_revelations"])
            rev_stats = report["core_revelations"][rev_key]
            self.assertIn("name", rev_stats)
            self.assertIn("total_documents_referencing", rev_stats)
            self.assertIn("documents", rev_stats)
    
    def test_scan_all_documents(self):
        """Test document scanning functionality"""
        results = self.checker.scan_all_documents()
        
        # Check that results contain data for scanned directories
        self.assertIsInstance(results, dict)
        
        # Check structure of results
        for directory, dir_results in results.items():
            self.assertIn("total_files", dir_results)
            self.assertIn("files_with_references", dir_results)
            self.assertIn("revelation_breakdown", dir_results)
            
            # files_with_references should not exceed total_files
            self.assertLessEqual(
                dir_results["files_with_references"],
                dir_results["total_files"]
            )
    
    def test_revelation_evidence_codes(self):
        """Test that all revelations have proper evidence codes"""
        for rev_key, revelation in self.checker.core_revelations.items():
            self.assertGreater(len(revelation.evidence_codes), 0)
            
            # All evidence codes should follow JF pattern
            for code in revelation.evidence_codes:
                self.assertTrue(
                    code.startswith("JF"),
                    f"Evidence code {code} doesn't follow JF pattern"
                )
    
    def test_critical_files_exist(self):
        """Test that critical files are properly defined"""
        # At least some critical files should exist
        existing_files = 0
        for critical_file in self.checker.critical_files:
            if (self.repo_root / critical_file).exists():
                existing_files += 1
        
        # At least 50% of critical files should exist
        self.assertGreater(existing_files, len(self.checker.critical_files) * 0.5)
    
    def test_no_duplicate_keywords(self):
        """Test that keywords are not duplicated within a revelation"""
        for rev_key, revelation in self.checker.core_revelations.items():
            keywords_lower = [k.lower() for k in revelation.keywords]
            # Check for exact duplicates
            self.assertEqual(
                len(keywords_lower),
                len(set(keywords_lower)),
                f"Duplicate keywords found in {rev_key}"
            )
    
    def test_report_json_serializable(self):
        """Test that generated report is JSON serializable"""
        report = self.checker.generate_cross_reference_report()
        
        try:
            json_str = json.dumps(report, indent=2)
            self.assertIsInstance(json_str, str)
            
            # Verify it can be loaded back
            loaded = json.loads(json_str)
            self.assertEqual(loaded["summary"]["total_errors"], report["summary"]["total_errors"])
        except Exception as e:
            self.fail(f"Report is not JSON serializable: {e}")


class TestCoreRevelationClass(unittest.TestCase):
    """Test the CoreRevelation class"""
    
    def test_core_revelation_initialization(self):
        """Test CoreRevelation initializes correctly"""
        revelation = CoreRevelation(
            name="Test Revelation",
            keywords=["keyword1", "keyword2"],
            evidence_codes=["JF01", "JF02"]
        )
        
        self.assertEqual(revelation.name, "Test Revelation")
        self.assertEqual(len(revelation.keywords), 2)
        self.assertEqual(len(revelation.evidence_codes), 2)
        self.assertEqual(len(revelation.documents_referencing), 0)
    
    def test_documents_referencing_is_set(self):
        """Test that documents_referencing is a set"""
        revelation = CoreRevelation(
            name="Test",
            keywords=["test"],
            evidence_codes=["JF01"]
        )
        
        self.assertIsInstance(revelation.documents_referencing, set)
        
        # Test adding documents
        revelation.documents_referencing.add("doc1.md")
        revelation.documents_referencing.add("doc2.md")
        revelation.documents_referencing.add("doc1.md")  # Duplicate
        
        # Should only have 2 unique documents
        self.assertEqual(len(revelation.documents_referencing), 2)


def run_tests():
    """Run all tests"""
    print("╔═══════════════════════════════════════════════════════════════════╗")
    print("║  AUTOMATED CROSS-REFERENCE CHECKER TEST SUITE                   ║")
    print("║  Testing Core Revelation Detection and Validation               ║")
    print("╚═══════════════════════════════════════════════════════════════════╝")
    print()
    
    # Run tests
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add all test cases
    suite.addTests(loader.loadTestsFromTestCase(TestAutomatedCrossReferenceChecker))
    suite.addTests(loader.loadTestsFromTestCase(TestCoreRevelationClass))
    
    # Run with verbosity
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Skipped: {len(result.skipped)}")
    
    if result.wasSuccessful():
        print("\n✅ ALL TESTS PASSED")
        return 0
    else:
        print("\n❌ SOME TESTS FAILED")
        return 1


if __name__ == "__main__":
    sys.exit(run_tests())
