#!/usr/bin/env python3
"""
Evidence Completeness Validation Script
Implementation of Phase 3 - Advanced QA (Line 150 from Repository_Status_and_Critical_Evidence_Collection.md)

This script validates evidence completeness and links each aspect to the underlying revelation:
- Dan & Kay Shopify platform was paid by Dan & Jax UK company RegimA Zone Ltd
- RWD ZA actually has no revenue stream of its own
"""

import json
import os
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Any


class EvidenceCompletenessValidator:
    """
    Validates evidence completeness and links to core revenue stream revelation
    """
    
    def __init__(self, repo_root="/home/runner/work/ad-res-j7/ad-res-j7"):
        self.repo_root = Path(repo_root)
        self.errors = []
        self.warnings = []
        self.passed = []
        
        # Core revelation that all evidence must link to
        self.core_revelation = {
            "key_fact": "Dan & Kay Shopify platform paid by RegimA Zone Ltd (UK company)",
            "critical_implication": "RWD ZA has no independent revenue stream",
            "evidence_requirement": "All financial evidence must demonstrate this payment flow"
        }
        
        # Evidence categories from Repository_Status_and_Critical_Evidence_Collection.md
        self.evidence_categories = {
            "phase1_critical": [
                "JF-RP1",  # Responsible Person documentation (37 jurisdictions)
                "JF-RP2",  # Regulatory risk analysis
                "JF-DLA1", "JF-DLA2", "JF-DLA3",  # Director loan accounts
                "JF-PA1", "JF-PA2", "JF-PA3", "JF-PA4",  # Peter's withdrawals
                "JF-BS1",  # R500K payment statement (16 July 2025)
                "JF5-DRAFT", "JF5-FINAL", "JF5-COMPARISON",  # Settlement agreements
                "JF-UKTAX1",  # UK tax residency
                "JF-CHESNO1", "JF-CHESNO2", "JF-CHESNO3", "JF-CHESNO4",  # Chesno fraud
                "JF-RESTORE1", "JF-RESTORE2", "JF-RESTORE3", "JF-RESTORE4"  # 8-year restoration
            ],
            "phase2_high_priority": [
                "JF-SAL1", "JF-EAL1", "JF-FSL1",  # System access logs
                "JF-CORR1",  # Correspondence evidence
                "JF-ITS1",  # IT service invoices
                "JF-HIST1", "JF-HIST2", "JF-HIST3",  # Historical collaborative model
                "JF-RF1", "JF-RF2", "JF-RF3",  # Rynette's access expansion
                "JF-EX1", "JF-EX2", "JF-EX3", "JF-EX4"  # Director exclusion
            ],
            "revenue_stream_evidence": [
                # Evidence that directly links to RegimA Zone Ltd payments
                "SHOPIFY_PAYMENT_RECORDS",
                "REGIMA_ZONE_LTD_UK_COMPANY_DOCS",
                "RWD_ZA_REVENUE_ANALYSIS",
                "DAN_KAY_PLATFORM_EVIDENCE",
                "UK_TO_SA_PAYMENT_FLOWS"
            ]
        }
        
        # Evidence completeness thresholds
        self.completeness_thresholds = {
            "phase1_critical": 0.80,  # 80% required
            "phase2_high_priority": 0.60,  # 60% required
            "overall": 0.70,  # 70% overall required
            "revenue_stream": 1.00  # 100% required for core revelation
        }
        
    def validate_all_evidence(self) -> Dict[str, Any]:
        """
        Run complete evidence completeness validation
        """
        print("=" * 80)
        print("EVIDENCE COMPLETENESS VALIDATION")
        print("=" * 80)
        print(f"\nCore Revelation: {self.core_revelation['key_fact']}")
        print(f"Critical Implication: {self.core_revelation['critical_implication']}\n")
        print("=" * 80)
        print()
        
        results = {
            "validation_timestamp": datetime.now().isoformat(),
            "core_revelation": self.core_revelation,
            "completeness_by_phase": {},
            "revenue_stream_linkage": {},
            "overall_completeness": 0.0,
            "passed_threshold": False,
            "recommendations": []
        }
        
        # Validate Phase 1 Critical Evidence
        print("📋 Phase 1: Critical Evidence (Must-Do)")
        print("-" * 80)
        phase1_results = self.validate_evidence_phase("phase1_critical")
        results["completeness_by_phase"]["phase1_critical"] = phase1_results
        
        # Validate Phase 2 High Priority Evidence
        print("\n📋 Phase 2: High Priority Evidence (Should-Do)")
        print("-" * 80)
        phase2_results = self.validate_evidence_phase("phase2_high_priority")
        results["completeness_by_phase"]["phase2_high_priority"] = phase2_results
        
        # Validate Revenue Stream Evidence (Core Revelation)
        print("\n💰 Revenue Stream Evidence (Core Revelation)")
        print("-" * 80)
        revenue_results = self.validate_revenue_stream_evidence()
        results["revenue_stream_linkage"] = revenue_results
        
        # Calculate overall completeness
        total_evidence = len(self.evidence_categories["phase1_critical"]) + \
                        len(self.evidence_categories["phase2_high_priority"])
        total_found = phase1_results["found"] + phase2_results["found"]
        results["overall_completeness"] = total_found / total_evidence if total_evidence > 0 else 0.0
        results["passed_threshold"] = results["overall_completeness"] >= self.completeness_thresholds["overall"]
        
        # Generate recommendations
        results["recommendations"] = self.generate_recommendations(results)
        
        # Print summary
        self.print_validation_summary(results)
        
        return results
        
    def validate_evidence_phase(self, phase_key: str) -> Dict[str, Any]:
        """
        Validate evidence completeness for a specific phase
        """
        evidence_codes = self.evidence_categories[phase_key]
        found_evidence = []
        missing_evidence = []
        
        for code in evidence_codes:
            evidence_files = self.find_evidence_by_code(code)
            
            if evidence_files:
                status = "✅ FOUND"
                found_evidence.append(code)
                self.passed.append({
                    "code": code,
                    "files": evidence_files,
                    "phase": phase_key
                })
                
                # Check linkage to core revelation
                linkage_score = self.check_revenue_stream_linkage(evidence_files)
                linkage_indicator = "🔗" if linkage_score > 0 else "⚪"
                
                print(f"  {status} {linkage_indicator} {code}: {len(evidence_files)} file(s)")
            else:
                status = "❌ MISSING"
                missing_evidence.append(code)
                self.errors.append({
                    "code": code,
                    "phase": phase_key,
                    "error": "No evidence files found"
                })
                print(f"  {status} {code}")
        
        completeness_rate = len(found_evidence) / len(evidence_codes) if evidence_codes else 0.0
        threshold = self.completeness_thresholds.get(phase_key, 0.70)
        meets_threshold = completeness_rate >= threshold
        
        print(f"\n  Completeness: {completeness_rate:.1%} ({len(found_evidence)}/{len(evidence_codes)})")
        print(f"  Threshold: {threshold:.1%} - {'✅ PASS' if meets_threshold else '❌ FAIL'}")
        
        return {
            "total": len(evidence_codes),
            "found": len(found_evidence),
            "missing": len(missing_evidence),
            "completeness_rate": completeness_rate,
            "meets_threshold": meets_threshold,
            "missing_codes": missing_evidence
        }
        
    def validate_revenue_stream_evidence(self) -> Dict[str, Any]:
        """
        Validate evidence linking to core revelation about RegimA Zone Ltd payments
        """
        revenue_evidence = {
            "shopify_payment_records": self.find_shopify_payment_evidence(),
            "regima_zone_ltd_uk": self.find_regima_zone_evidence(),
            "rwd_za_revenue_analysis": self.find_rwd_za_revenue_evidence(),
            "dan_kay_platform": self.find_dan_kay_platform_evidence(),
            "uk_sa_payment_flows": self.find_uk_sa_payment_flows()
        }
        
        total_categories = len(revenue_evidence)
        found_categories = sum(1 for v in revenue_evidence.values() if v["found"])
        
        for category, result in revenue_evidence.items():
            status = "✅" if result["found"] else "❌"
            print(f"  {status} {category}: {len(result['files'])} file(s)")
            if result["found"]:
                for file in result["files"][:3]:  # Show first 3 files
                    print(f"      - {file}")
        
        completeness = found_categories / total_categories if total_categories > 0 else 0.0
        meets_threshold = completeness >= self.completeness_thresholds["revenue_stream"]
        
        print(f"\n  Revenue Stream Evidence: {completeness:.1%} ({found_categories}/{total_categories})")
        print(f"  Threshold: {self.completeness_thresholds['revenue_stream']:.1%} - {'✅ PASS' if meets_threshold else '⚠️ CRITICAL'}")
        
        return {
            "categories": revenue_evidence,
            "completeness": completeness,
            "meets_threshold": meets_threshold,
            "critical_missing": [k for k, v in revenue_evidence.items() if not v["found"]]
        }
        
    def find_evidence_by_code(self, evidence_code: str) -> List[str]:
        """
        Find all evidence files matching a specific code
        """
        evidence_files = []
        search_paths = [
            self.repo_root / "evidence",
            self.repo_root / "jax-response" / "evidence-attachments",
            self.repo_root / "FINAL_AFFIDAVIT_PACKAGE" / "ANNEXURES",
            self.repo_root / "case_2025_137857" / "02_evidence"
        ]
        
        # Normalize code for searching
        code_variants = [
            evidence_code,
            evidence_code.replace("-", ""),
            evidence_code.replace("-", "_"),
            evidence_code.lower(),
            evidence_code.upper()
        ]
        
        for search_path in search_paths:
            if search_path.exists():
                for file_path in search_path.rglob("*"):
                    if file_path.is_file():
                        # Check if filename contains any variant of the code
                        if any(variant in file_path.name for variant in code_variants):
                            evidence_files.append(str(file_path.relative_to(self.repo_root)))
        
        return evidence_files
        
    def find_shopify_payment_evidence(self) -> Dict[str, Any]:
        """
        Find evidence of Shopify platform payments
        """
        keywords = ["shopify", "payment", "platform", "e-commerce"]
        files = self.search_by_keywords(keywords)
        return {"found": len(files) > 0, "files": files}
        
    def find_regima_zone_evidence(self) -> Dict[str, Any]:
        """
        Find evidence of RegimA Zone Ltd (UK company)
        """
        keywords = ["regima zone", "regima zone ltd", "uk company", "united kingdom"]
        files = self.search_by_keywords(keywords)
        return {"found": len(files) > 0, "files": files}
        
    def find_rwd_za_revenue_evidence(self) -> Dict[str, Any]:
        """
        Find evidence about RWD ZA's revenue stream (or lack thereof)
        """
        keywords = ["rwd za", "rwd south africa", "revenue stream", "no revenue"]
        files = self.search_by_keywords(keywords)
        
        # Also check Revenue_Stream_Hijacking_by_Rynette directory
        hijacking_dir = self.repo_root / "Revenue_Stream_Hijacking_by_Rynette"
        if hijacking_dir.exists():
            for file_path in hijacking_dir.rglob("*.md"):
                files.append(str(file_path.relative_to(self.repo_root)))
        
        return {"found": len(files) > 0, "files": list(set(files))}
        
    def find_dan_kay_platform_evidence(self) -> Dict[str, Any]:
        """
        Find evidence of Dan & Kay platform operations
        """
        keywords = ["dan", "kay", "daniel", "platform", "shopify"]
        files = self.search_by_keywords(keywords)
        return {"found": len(files) > 0, "files": files}
        
    def find_uk_sa_payment_flows(self) -> Dict[str, Any]:
        """
        Find evidence of UK to South Africa payment flows
        """
        keywords = ["uk to sa", "united kingdom", "south africa", "payment flow", "cross-border"]
        files = self.search_by_keywords(keywords)
        return {"found": len(files) > 0, "files": files}
        
    def search_by_keywords(self, keywords: List[str]) -> List[str]:
        """
        Search for files containing specific keywords in content or filename
        """
        matching_files = []
        search_paths = [
            self.repo_root / "evidence",
            self.repo_root / "jax-response",
            self.repo_root / "FINAL_AFFIDAVIT_PACKAGE",
            self.repo_root / "Revenue_Stream_Hijacking_by_Rynette",
            self.repo_root / "case_2025_137857"
        ]
        
        for search_path in search_paths:
            if not search_path.exists():
                continue
                
            for file_path in search_path.rglob("*.md"):
                try:
                    # Check filename
                    filename_lower = file_path.name.lower()
                    if any(keyword.lower() in filename_lower for keyword in keywords):
                        matching_files.append(str(file_path.relative_to(self.repo_root)))
                        continue
                    
                    # Check content for markdown files only (to avoid binary files)
                    content = file_path.read_text(encoding='utf-8', errors='ignore').lower()
                    if any(keyword.lower() in content for keyword in keywords):
                        matching_files.append(str(file_path.relative_to(self.repo_root)))
                except Exception as e:
                    # Skip files that can't be read
                    pass
        
        return list(set(matching_files))  # Remove duplicates
        
    def check_revenue_stream_linkage(self, evidence_files: List[str]) -> float:
        """
        Check if evidence files link to the core revenue stream revelation
        Returns a score from 0.0 to 1.0
        """
        if not evidence_files:
            return 0.0
            
        linkage_keywords = [
            "regima zone",
            "shopify",
            "revenue stream",
            "uk company",
            "payment",
            "rwd za"
        ]
        
        total_score = 0.0
        for file_path in evidence_files:
            try:
                full_path = self.repo_root / file_path
                if full_path.suffix == ".md":
                    content = full_path.read_text(encoding='utf-8', errors='ignore').lower()
                    matches = sum(1 for keyword in linkage_keywords if keyword in content)
                    total_score += matches / len(linkage_keywords)
            except Exception:
                pass
        
        return total_score / len(evidence_files) if evidence_files else 0.0
        
    def generate_recommendations(self, results: Dict[str, Any]) -> List[Dict[str, str]]:
        """
        Generate actionable recommendations based on validation results
        """
        recommendations = []
        
        # Phase 1 Critical recommendations
        phase1 = results["completeness_by_phase"].get("phase1_critical", {})
        if not phase1.get("meets_threshold", False):
            missing = phase1.get("missing_codes", [])
            recommendations.append({
                "priority": "CRITICAL",
                "category": "Phase 1 Critical Evidence",
                "action": f"Collect {len(missing)} missing critical evidence items: {', '.join(missing[:5])}",
                "impact": "Required to meet 80% Phase 1 threshold"
            })
        
        # Revenue stream recommendations
        revenue = results.get("revenue_stream_linkage", {})
        if not revenue.get("meets_threshold", False):
            missing = revenue.get("critical_missing", [])
            recommendations.append({
                "priority": "CRITICAL",
                "category": "Revenue Stream Evidence",
                "action": f"Document core revelation: {', '.join(missing)}",
                "impact": "Essential to prove RegimA Zone Ltd payment structure and RWD ZA's lack of independent revenue"
            })
        
        # Phase 2 recommendations
        phase2 = results["completeness_by_phase"].get("phase2_high_priority", {})
        if not phase2.get("meets_threshold", False):
            recommendations.append({
                "priority": "HIGH",
                "category": "Phase 2 High Priority Evidence",
                "action": f"Collect {phase2.get('missing', 0)} high priority evidence items",
                "impact": "Strengthens case and provides supporting documentation"
            })
        
        # Overall recommendations
        if not results.get("passed_threshold", False):
            recommendations.append({
                "priority": "HIGH",
                "category": "Overall Completeness",
                "action": f"Increase overall evidence completeness from {results['overall_completeness']:.1%} to {self.completeness_thresholds['overall']:.1%}",
                "impact": "Required for court submission readiness"
            })
        
        return recommendations
        
    def print_validation_summary(self, results: Dict[str, Any]):
        """
        Print a comprehensive validation summary
        """
        print("\n" + "=" * 80)
        print("VALIDATION SUMMARY")
        print("=" * 80)
        
        print(f"\nOverall Completeness: {results['overall_completeness']:.1%}")
        print(f"Threshold Required: {self.completeness_thresholds['overall']:.1%}")
        print(f"Status: {'✅ PASS' if results['passed_threshold'] else '❌ FAIL'}")
        
        print(f"\n📊 Phase Breakdown:")
        for phase, data in results["completeness_by_phase"].items():
            status = "✅" if data["meets_threshold"] else "❌"
            print(f"  {status} {phase}: {data['completeness_rate']:.1%} ({data['found']}/{data['total']})")
        
        revenue = results.get("revenue_stream_linkage", {})
        status = "✅" if revenue.get("meets_threshold", False) else "⚠️"
        print(f"  {status} revenue_stream_evidence: {revenue.get('completeness', 0):.1%}")
        
        print(f"\n💡 Recommendations ({len(results['recommendations'])} items):")
        for i, rec in enumerate(results["recommendations"][:5], 1):
            print(f"  {i}. [{rec['priority']}] {rec['category']}")
            print(f"     Action: {rec['action']}")
            print(f"     Impact: {rec['impact']}")
        
        print("\n" + "=" * 80)
        
    def export_results(self, results: Dict[str, Any], output_file: str = "evidence_completeness_validation_report.json"):
        """
        Export validation results to JSON file
        """
        output_path = self.repo_root / output_file
        with open(output_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n📁 Results exported to: {output_file}")
        return str(output_path)


def main():
    """
    Main execution function
    """
    validator = EvidenceCompletenessValidator()
    results = validator.validate_all_evidence()
    
    # Export results
    validator.export_results(results)
    
    # Exit with appropriate code
    if results["passed_threshold"]:
        print("\n✅ Evidence completeness validation PASSED")
        return 0
    else:
        print("\n❌ Evidence completeness validation FAILED")
        print("   Please address the recommendations above before court submission")
        return 1


if __name__ == "__main__":
    exit(main())
