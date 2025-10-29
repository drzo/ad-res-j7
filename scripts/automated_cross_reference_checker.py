#!/usr/bin/env python3
"""
Automated Cross-Reference Checking System

This script automatically validates that all evidence and analysis documents
properly link to the core revelations:
1. Dan & Kay Shopify platform was paid by Dan & Jax UK company RegimA Zone Ltd
2. RWD ZA has no revenue stream of its own

Purpose: Ensure comprehensive evidence trail linking all aspects to these
fundamental revelations that expose the true nature of the financial arrangements.

Usage:
    python3 scripts/automated_cross_reference_checker.py
    python3 scripts/automated_cross_reference_checker.py --verbose
    python3 scripts/automated_cross_reference_checker.py --output report.json
"""

import os
import re
import json
import argparse
from pathlib import Path
from typing import Dict, List, Set, Tuple
from datetime import datetime


class CoreRevelation:
    """Represents a core revelation that must be cross-referenced"""
    
    def __init__(self, name: str, keywords: List[str], evidence_codes: List[str]):
        self.name = name
        self.keywords = keywords
        self.evidence_codes = evidence_codes
        self.documents_referencing = set()


class CrossReferenceChecker:
    """Main automated cross-reference checking system"""
    
    def __init__(self, repo_root: str = "/home/runner/work/ad-res-j7/ad-res-j7"):
        self.repo_root = Path(repo_root)
        self.errors = []
        self.warnings = []
        self.info = []
        self.verbose = False
        
        # Define core revelations
        self.core_revelations = {
            "shopify_platform_payment": CoreRevelation(
                name="Shopify Platform Paid by RegimA Zone Ltd (UK)",
                keywords=[
                    "RegimA Zone Ltd",
                    "RegimA Zone",
                    "UK entity",
                    "UK company",
                    "Shopify platform",
                    "platform owner",
                    "platform paid",
                    "Daniel's UK",
                    "Dan.*UK",
                    "RegimA Zone.*Shopify",
                    "Shopify.*RegimA Zone"
                ],
                evidence_codes=["JF02", "JF08", "JF-ITS1"]
            ),
            "rwd_no_revenue": CoreRevelation(
                name="RWD ZA Has No Independent Revenue Stream",
                keywords=[
                    "RWD.*no revenue",
                    "RWD.*revenue stream",
                    "RWD.*no stock",
                    "RWD.*no inventory",
                    "RWD.*revenue integrity",
                    "RWD.*trust vehicle",
                    "RWD.*revenue generation",
                    "RWD.*appropriat",
                    "unjust enrichment",
                    "RWD.*capacity"
                ],
                evidence_codes=["JF02", "JF-DLA1", "JF-DLA2", "JF-DLA3"]
            ),
            "platform_cost_nonpayment": CoreRevelation(
                name="RWD Never Compensated Platform Owner",
                keywords=[
                    "never compensat",
                    "never paid.*platform",
                    "platform.*non-payment",
                    "R140K.*R280K",
                    "platform costs",
                    "28 months",
                    "July 2023",
                    "distributor.*not paid",
                    "distributor.*never"
                ],
                evidence_codes=["JF02", "JF-ITS1", "JF-BS1"]
            ),
            "unjust_enrichment": CoreRevelation(
                name="RWD Unjust Enrichment from Platform Use",
                keywords=[
                    "R2.94M.*R6.88M",
                    "unjust enrichment",
                    "appropriat.*revenue",
                    "revenue.*Daniel's platform",
                    "platform.*no compensation",
                    "distributor.*no payment"
                ],
                evidence_codes=["JF02", "JF-DLA1", "JF-DLA2", "JF-DLA3"]
            )
        }
        
        # Critical files that MUST reference these revelations
        self.critical_files = [
            "jax-response/AD/1-Critical/RWD_REVENUE_INTEGRITY_ANALYSIS.md",
            "jax-response/AD/1-Critical/PARA_7_9-7_11.md",
            "jax-response/AD/1-Critical/PARA_7_7-7_8.md",
            "jax-response/AD/1-Critical/PARA_7_6.md",
            "jax-response/revenue-theft/README.md",
            "jax-response/README.md",
            "FINAL_ANSWERING_AFFIDAVIT_ABRIDGED.md",
            "FINAL_ANSWERING_AFFIDAVIT_COMPLETE.md"
        ]
        
        # Directories to scan for cross-references
        self.scan_directories = [
            "jax-response/AD",
            "jax-response/revenue-theft",
            "jax-response/financial-flows",
            "jax-response/family-trust",
            "jax-response/analysis-output",
            "FINAL_AFFIDAVIT_PACKAGE/ANNEXURES",
            "evidence"
        ]
    
    def log(self, message: str, level: str = "info"):
        """Log messages based on verbosity"""
        if level == "error":
            self.errors.append(message)
            print(f"❌ ERROR: {message}")
        elif level == "warning":
            self.warnings.append(message)
            print(f"⚠️  WARNING: {message}")
        elif self.verbose:
            self.info.append(message)
            print(f"ℹ️  INFO: {message}")
    
    def find_markdown_files(self, directory: str) -> List[Path]:
        """Find all markdown files in a directory"""
        dir_path = self.repo_root / directory
        if not dir_path.exists():
            self.log(f"Directory not found: {directory}", "warning")
            return []
        
        md_files = list(dir_path.rglob("*.md"))
        self.log(f"Found {len(md_files)} markdown files in {directory}")
        return md_files
    
    def check_file_for_revelation(self, file_path: Path, revelation: CoreRevelation) -> Dict:
        """Check if a file references a core revelation"""
        try:
            content = file_path.read_text(encoding='utf-8', errors='ignore')
            
            matches = []
            for keyword in revelation.keywords:
                pattern = re.compile(keyword, re.IGNORECASE | re.MULTILINE)
                found = pattern.findall(content)
                if found:
                    matches.append({
                        "keyword": keyword,
                        "count": len(found),
                        "samples": found[:3]  # First 3 matches
                    })
            
            if matches:
                revelation.documents_referencing.add(str(file_path.relative_to(self.repo_root)))
            
            return {
                "file": str(file_path.relative_to(self.repo_root)),
                "matches": matches,
                "has_reference": len(matches) > 0
            }
        except Exception as e:
            self.log(f"Error reading {file_path}: {e}", "error")
            return {"file": str(file_path.relative_to(self.repo_root)), "matches": [], "has_reference": False, "error": str(e)}
    
    def validate_critical_files(self) -> Dict[str, List]:
        """Validate that critical files reference core revelations"""
        results = {
            "missing_references": [],
            "complete_references": [],
            "file_not_found": []
        }
        
        print("\n🔍 Validating Critical Files for Core Revelation References...")
        print("=" * 70)
        
        for critical_file in self.critical_files:
            file_path = self.repo_root / critical_file
            
            if not file_path.exists():
                results["file_not_found"].append(critical_file)
                self.log(f"Critical file not found: {critical_file}", "warning")
                continue
            
            file_revelations = {
                "file": critical_file,
                "revelations_found": [],
                "revelations_missing": []
            }
            
            for rev_key, revelation in self.core_revelations.items():
                check_result = self.check_file_for_revelation(file_path, revelation)
                
                if check_result["has_reference"]:
                    file_revelations["revelations_found"].append({
                        "revelation": revelation.name,
                        "matches": len(check_result["matches"])
                    })
                else:
                    file_revelations["revelations_missing"].append(revelation.name)
            
            # A critical file should reference at least 2 core revelations
            if len(file_revelations["revelations_found"]) >= 2:
                results["complete_references"].append(file_revelations)
                self.log(f"✅ {critical_file}: {len(file_revelations['revelations_found'])}/4 revelations")
            else:
                results["missing_references"].append(file_revelations)
                self.log(f"Missing references in {critical_file}: {file_revelations['revelations_missing']}", "warning")
        
        return results
    
    def scan_all_documents(self) -> Dict[str, Dict]:
        """Scan all documents in specified directories"""
        print("\n🔍 Scanning All Documents for Core Revelation Cross-References...")
        print("=" * 70)
        
        all_results = {}
        
        for directory in self.scan_directories:
            md_files = self.find_markdown_files(directory)
            
            dir_results = {
                "total_files": len(md_files),
                "files_with_references": 0,
                "revelation_breakdown": {rev_key: [] for rev_key in self.core_revelations.keys()}
            }
            
            for md_file in md_files:
                file_has_reference = False
                
                for rev_key, revelation in self.core_revelations.items():
                    check_result = self.check_file_for_revelation(md_file, revelation)
                    
                    if check_result["has_reference"]:
                        file_has_reference = True
                        dir_results["revelation_breakdown"][rev_key].append({
                            "file": check_result["file"],
                            "match_count": sum(m["count"] for m in check_result["matches"])
                        })
                
                if file_has_reference:
                    dir_results["files_with_references"] += 1
            
            all_results[directory] = dir_results
            
            coverage = (dir_results["files_with_references"] / dir_results["total_files"] * 100) if dir_results["total_files"] > 0 else 0
            print(f"📂 {directory}: {dir_results['files_with_references']}/{dir_results['total_files']} files ({coverage:.1f}%) reference core revelations")
        
        return all_results
    
    def generate_cross_reference_report(self) -> Dict:
        """Generate comprehensive cross-reference report"""
        print("\n📊 Generating Cross-Reference Report...")
        print("=" * 70)
        
        # Validate critical files
        critical_validation = self.validate_critical_files()
        
        # Scan all documents
        document_scan = self.scan_all_documents()
        
        # Compile revelation statistics
        revelation_stats = {}
        for rev_key, revelation in self.core_revelations.items():
            revelation_stats[rev_key] = {
                "name": revelation.name,
                "keywords": revelation.keywords,
                "evidence_codes": revelation.evidence_codes,
                "total_documents_referencing": len(revelation.documents_referencing),
                "documents": sorted(list(revelation.documents_referencing))
            }
        
        report = {
            "generated_at": datetime.now().isoformat(),
            "summary": {
                "total_errors": len(self.errors),
                "total_warnings": len(self.warnings),
                "critical_files_validated": len(self.critical_files),
                "critical_files_complete": len(critical_validation["complete_references"]),
                "critical_files_missing": len(critical_validation["missing_references"]),
                "critical_files_not_found": len(critical_validation["file_not_found"])
            },
            "core_revelations": revelation_stats,
            "critical_files_validation": critical_validation,
            "document_scan": document_scan,
            "errors": self.errors,
            "warnings": self.warnings
        }
        
        return report
    
    def print_summary(self, report: Dict):
        """Print human-readable summary"""
        print("\n" + "=" * 70)
        print("📋 AUTOMATED CROSS-REFERENCE CHECKING SYSTEM - SUMMARY")
        print("=" * 70)
        
        print(f"\n🎯 Core Revelations Tracked: {len(self.core_revelations)}")
        for rev_key, stats in report["core_revelations"].items():
            print(f"  • {stats['name']}: {stats['total_documents_referencing']} documents")
        
        print(f"\n📁 Critical Files Analysis:")
        print(f"  ✅ Complete references: {report['summary']['critical_files_complete']}")
        print(f"  ⚠️  Missing references: {report['summary']['critical_files_missing']}")
        print(f"  ❌ Files not found: {report['summary']['critical_files_not_found']}")
        
        print(f"\n📊 Overall Statistics:")
        print(f"  • Total Errors: {report['summary']['total_errors']}")
        print(f"  • Total Warnings: {report['summary']['total_warnings']}")
        
        if report["summary"]["total_errors"] == 0:
            if report["summary"]["total_warnings"] == 0:
                print("\n✅ ALL CHECKS PASSED - Cross-reference system is comprehensive")
                return 0
            else:
                print(f"\n⚠️  PASSED WITH WARNINGS - {report['summary']['total_warnings']} warnings to review")
                return 0
        else:
            print(f"\n❌ VALIDATION FAILED - {report['summary']['total_errors']} errors found")
            return 1
    
    def run(self, output_file: str = None) -> int:
        """Run the automated cross-reference checker"""
        print("╔═══════════════════════════════════════════════════════════════════╗")
        print("║  AUTOMATED CROSS-REFERENCE CHECKING SYSTEM                       ║")
        print("║  Linking Evidence to Core Revelations                            ║")
        print("╚═══════════════════════════════════════════════════════════════════╝")
        
        report = self.generate_cross_reference_report()
        
        if output_file:
            output_path = self.repo_root / output_file
            with open(output_path, 'w') as f:
                json.dump(report, f, indent=2)
            print(f"\n💾 Full report saved to: {output_file}")
        
        return self.print_summary(report)


def main():
    parser = argparse.ArgumentParser(
        description="Automated Cross-Reference Checking System"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable verbose output"
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        help="Output file for JSON report"
    )
    
    args = parser.parse_args()
    
    checker = CrossReferenceChecker()
    checker.verbose = args.verbose
    
    exit_code = checker.run(output_file=args.output)
    return exit_code


if __name__ == "__main__":
    exit(main())
