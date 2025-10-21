# Repository Structure Guide

This document provides a comprehensive overview of the repository structure for the AD Response J7 project (Case 2025-137857).

## Directory Organization

The repository is organized into several main directories, each serving a specific purpose in the case management and analysis workflow.

### Root Directory

The root directory contains the main README.md file, which provides an overview of the case and the repository structure. It also contains configuration files and utility scripts.

### `affidavit_work/`

This directory contains all work related to the drafting and analysis of affidavits for Case 2025-137857. It is organized into the following subdirectories:

- **`analysis/`**: Contains in-depth analysis of the applicant's affidavit and supporting documents. This includes a three-part classification of the evidence (Irrefutable Proof, Strong Evidence, and Circumstantial/Inferred).
- **`corrections/`**: Contains critical corrections to the information presented in the applicant's affidavit.
- **`recommendations/`**: Contains recommendations for the responding affidavit.
- **`versions/`**: Contains different versions of the responding affidavit.

### `analysis_outputs/`

This directory is reserved for the output of automated analysis tools and scripts.

### `backups/`

This directory contains backups of important documents, particularly affidavits.

- **`affidavits/`**: Contains backup copies of all affidavit versions.

### `case_2025_137857/`

This directory contains all documents directly related to the High Court case 2025-137857. It is organized into the following subdirectories:

- **`01_court_documents/`**: Contains official court filings, including the main application and any subsequent motions or orders.
- **`02_evidence/`**: Contains evidence submitted to the court.
- **`03_analysis/`**: Contains analysis of the case, evidence, and legal arguments.
- **`04_financial_records/`**: Contains financial records relevant to the case.
- **`05_affidavits/`**: Contains affidavits from all parties.
- **`06_legal_research/`**: Contains legal research and precedents related to the case.

### `config/`

This directory contains configuration files for tools and scripts used in the analysis.

### `docs/`

This directory contains additional documentation, including technical and legal analysis. It is organized into the following subdirectories:

- **`analysis/`**: Contains analytical documents and reports.
- **`evidence/`**: Contains documentation related to evidence.
- **`legal/`**: Contains legal documentation and research.
- **`technical/`**: Contains technical documentation.

### `evidence/`

This directory contains raw evidence collected for Case 2025-137857. It is organized into the following subdirectories:

- **`bank_records/`**: Contains personal and business bank records.
- **`shopify_reports/`**: Contains sales and financial reports from Shopify.
- **`invoices/`**: Contains invoices for various business expenses.
- **`correspondence/`**: Contains email and other correspondence relevant to the case.

### `jax-response/`

**Complete forensic evidence analysis with three major components documenting over R10.227M in financial losses.**

Consolidated structure combining Jacqueline and Daniel Faucitt's responses to Peter Faucitt's interdict application (Case 2025-137857). This directory contains comprehensive forensic analysis, evidence, and legal response materials.

#### Sub-directories:

- **`AD/`**: Structured response framework with paragraph-by-paragraph analysis organized by priority rating
  - **`1-Critical/` through `5-Meaningless/`**: Jacqueline's comprehensive legal responses
  - **`dan-perspective/`**: Daniel's technical perspective as CIO, focusing on technical infrastructure and regulatory compliance
    - Contains specialized technical analysis for IT, compliance systems, and business continuity

- **`revenue-theft/`**: Forensic analysis of coordinated revenue hijacking scheme (5 events, R3.1M+ losses)
  - **`14-apr-bank-letter/`**: Bank account change fraud (April 14, 2025)
  - **`22-may-shopify-audit/`**: Shopify audit trail destruction (May 22, 2025)
  - **`29-may-domain-registration/`**: Domain registration by son for identity fraud (May 29, 2025)
  - **`20-june-gee-gayane-email/`**: Administrative instruction coordination evidence (June 20, 2025)
  - **`08-july-warehouse-popi/`**: Business sabotage and POPI violations (July 8, 2025)
  - **`email-impersonation-pattern-jf3a/`**: Email impersonation pattern analysis
  - **`shopify-system-comparison/`**: Shopify system comparison analysis
  - Key files: `README.md` (forensic analysis overview), `FORENSIC_EVIDENCE_INDEX.md` (evidence catalog and prosecution framework)

- **`family-trust/`**: Analysis of systematic family trust manipulation (5 events, R2.851M+ losses)
  - **`15-mar-trust-establishment/`**: Trust structure establishment documentation (March 15, 2025)
  - **`02-may-beneficiary-changes/`**: Unauthorized beneficiary modifications (May 2, 2025)
  - **`18-june-trust-violation/`**: Systematic trust obligation breaches (June 18, 2025)
  - **`25-july-asset-misappropriation/`**: Trust asset misappropriation scheme (July 25, 2025)
  - **`10-aug-trust-breach-evidence/`**: Comprehensive trust breach documentation (August 10, 2025)
  - Key files: `README.md` (trust violation forensic analysis), trust law violation framework

- **`financial-flows/`**: Analysis of financial manipulation and fund diversion (5 events, R4.276M+ losses)
  - **`01-apr-payment-redirection/`**: Systematic payment redirection scheme (April 1, 2025)
  - **`15-may-unauthorized-transfers/`**: Large-scale unauthorized financial transfers (May 15, 2025)
  - **`30-june-fund-diversions/`**: Coordinated fund diversion operations (June 30, 2025)
  - **`12-july-account-manipulations/`**: Bank account manipulation and control seizure (July 12, 2025)
  - **`20-aug-financial-concealment/`**: Financial evidence concealment and destruction (August 20, 2025)
  - Key files: `README.md` (financial crime forensic analysis), financial flow network analysis

- **`source-documents/`**: Original affidavit drafts and source materials
  - Contains Jacqueline's materials: Enhanced answering affidavit with AD PARAGRAPH structure, final drafts
  - **`dan-materials/`**: Daniel's source documents including technical affidavit drafts and infrastructure documentation

- **`evidence-attachments/`**: Supporting evidence and analysis documents
  - Settlement agreement evidence (JF5 draft vs final)
  - Chesno fraud documentation (JF-CHESNO1-4)
  - Financial analysis and director loan evidence
  - UK tax residency and restoration evidence
  - **`dan-technical/`**: Daniel's technical infrastructure evidence including:
    - Technical Infrastructure Affidavit
    - IT spend industry comparative analysis
    - System access audit and regulatory crisis documentation
    - Business continuity impact assessments
  - **`settlement-agreement-jf5/`**: Settlement agreement analysis and comparison documents

- **`dan-response-materials/`**: Daniel's strategic documents and response materials
  - Comprehensive response structure and evidence mapping
  - Criminal enterprise evidence structure
  - Burden of proof analysis from technical perspective
  - Implementation optimization and strategy reports

- **`peter-interdict/`**: Peter Faucitt's interdict application and court order
  - Complete interdict application documents
  - Court order for Case 2025-137857
  - Combined and dated versions of interdict documents

- **`analysis-output/`**: Comprehensive analysis and revised affidavit versions
  - **Legal Analysis**: Interdict analysis, comprehensive legal analysis (JSON), reference indexes
  - **Strategic Recommendations**: Amendment recommendations, strategic contradictions analysis, trustee contradictions analysis
  - **Revised Affidavit Versions**:
    - `REVISED_Answering_Affidavit_Jax_TRACKED_CHANGES_v3.md` (v3) - **CURRENT VERSION** with critical corrections
    - `REVISED_Answering_Affidavit_Jax_TRACKED_CHANGES_v4.md` (v4) - Enhanced version
    - `REVISED_Answering_Affidavit_Jax_TRACKED_CHANGES_v5.md` (v5) - Latest version with comprehensive updates
  - **Critical Corrections**: Detailed corrections for paragraphs 48 & 129, settlement agreement manipulation, Isaac Chesno fraud correction
  - **Summaries**: Complete change overviews and version history

- **Key Files**:
  - `README.md`: Complete overview of consolidated response structure
  - `FORENSIC_EVIDENCE_INDEX.json` and `FORENSIC_EVIDENCE_INDEX.md`: Comprehensive evidence catalogs

**Current Version**: v3 (`analysis-output/REVISED_Answering_Affidavit_Jax_TRACKED_CHANGES_v3.md`)

**Strategic Framework**: Seven key arguments including material non-disclosure, Peter's inconsistency, pattern of misrepresentation, and regulatory crisis.

**Case Information**:
- Case Number: 2025-137857
- Court: High Court of South Africa, Gauteng Division, Pretoria
- Applicant: Peter Andrew Faucitt
- First Respondent: Jacqueline Faucitt
- Second Respondent: Daniel James Faucitt

### `1-CIVIL-RESPONSE/`

Civil case response materials and analysis framework.

### `2-CRIMINAL-CASE/`

Criminal prosecution framework for Peter Faucitt, Rynette Farrar, and others. Currently blocked by interdict pending civil case resolution.

### `3-EXTERNAL-VALIDATION/`

External validation and cross-repository analysis integration.

### `todo/`

Automated task generation system for case management. Contains comprehensive action plans automatically processed by GitHub Actions to generate tracked issues.

### `tests/`

Comprehensive automated testing pipeline for workflow validation with 118 tests achieving 92%+ success rate.

### `scripts/`

Utility scripts and automation tools for repository management and case processing.

## File Naming Conventions

Files in this repository follow consistent naming conventions to ensure clarity and organization:

- **Court Documents**: Use the official case reference number and date (e.g., `KF0019-SecondApplication-03.10.2025.pdf`).
- **Evidence Files**: Use descriptive names that indicate the content and date (e.g., `D_FAUCITT_PERSONAL_BANK_RECORDS_20250604.pdf`).
- **Analysis Documents**: Use descriptive names that indicate the type of analysis and classification (e.g., `Affidavit_Analysis_-_Part_1_Irrefutable_Proof.docx`).
- **README Files**: Each major directory contains a `README.md` file that explains the purpose and contents of that directory.

## Workflow

The typical workflow for working with this repository is as follows:

1. **Evidence Collection**: Collect raw evidence and place it in the appropriate subdirectory within the `evidence/` directory.
2. **Document Organization**: Organize court documents and other official filings in the `case_2025_137857/` directory.
3. **Analysis**: Conduct analysis of the evidence and documents, and place the results in the `affidavit_work/analysis/` or `docs/analysis/` directories.
4. **Affidavit Drafting**: Draft the responding affidavit based on the analysis, and place different versions in the `affidavit_work/versions/` directory.
5. **Review and Correction**: Review the affidavit for accuracy and completeness, and place any corrections in the `affidavit_work/corrections/` directory.
6. **Finalization**: Finalize the affidavit and prepare it for submission to the court.

## Version Control

This repository uses Git for version control. All changes should be committed with clear and descriptive commit messages that explain the nature of the changes. The repository is hosted on GitHub at `https://github.com/cogpy/ad-res-j7`.

## Collaboration

This repository is designed to facilitate collaboration between legal professionals, analysts, and other stakeholders involved in Case 2025-137857. All contributors should follow the established directory structure and file naming conventions to ensure consistency and clarity.

## Maintenance

The repository should be regularly updated with new evidence, analysis, and documents as they become available. Backups should be created regularly to prevent data loss. The repository structure should be reviewed periodically to ensure that it continues to meet the needs of the project.

---

*Last Updated: 2025-10-21*  
*Repository: cogpy/ad-res-j7*
