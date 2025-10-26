;; south_african_trust_law.scm
;; South African Trust Law Framework
;; Based on Trust Property Control Act 57 of 1988
;; Scheme implementation for legal reasoning and rule-based systems

;; =============================================================================
;; METADATA AND VERSION INFORMATION
;; =============================================================================
;; Version: 1.0
;; Last Updated: 2025-10-26
;; Purpose: Comprehensive trust law framework for AD-RES-J7 case analysis
;; Coverage: Trustee duties, beneficiary rights, trust powers, trust administration,
;;           trust asset protection, trust distributions

;; =============================================================================
;; CORE TRUST LAW PRINCIPLES
;; =============================================================================

;; Trust Nature and Creation
(define trust-legal-nature
  (make-principle
   'name 'trust-legal-nature
   'description "Trust is legal relationship where trustee holds property for beneficiaries"
   'domain '(trust)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, common law"
   'related-principles '(trust-property-separation fiduciary-relationship)
   'inference-type 'deductive
   'application-context "Trust nature and legal structure"))

(define trust-property-separation
  (make-principle
   'name 'trust-property-separation
   'description "Trust property is separate from trustee's personal property"
   'domain '(trust property)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, s12"
   'related-principles '(trust-legal-nature trust-property-protection)
   'inference-type 'deductive
   'application-context "Trust property separation"))

;; =============================================================================
;; TRUSTEE FIDUCIARY DUTIES
;; =============================================================================

(define trustee-fiduciary-duty
  (make-principle
   'name 'trustee-fiduciary-duty
   'description "Trustees owe fiduciary duties to beneficiaries and must act in their best interests"
   'domain '(trust fiduciary-duty)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, common law"
   'related-principles '(fiduciary-duty beneficiary-protection)
   'inference-type 'deductive
   'application-context "Trustee fiduciary obligations"))

(define trustee-duty-of-care
  (make-principle
   'name 'trustee-duty-of-care
   'description "Trustees must exercise care, skill and diligence in trust administration"
   'domain '(trust)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, s9"
   'related-principles '(duty-of-care prudent-person-standard)
   'inference-type 'deductive
   'application-context "Trustee standard of care"))

(define trustee-conflict-prohibition
  (make-principle
   'name 'trustee-conflict-prohibition
   'description "Trustees must not place themselves in positions of conflict with beneficiaries"
   'domain '(trust fiduciary-duty)
   'confidence 1.0
   'provenance "Common law fiduciary principles"
   'related-principles '(conflict-of-interest fiduciary-duty)
   'inference-type 'deductive
   'application-context "Trustee conflicts of interest"))

(define trustee-personal-gain-prohibition
  (make-principle
   'name 'trustee-personal-gain-prohibition
   'description "Trustees must not profit from trust position without authorization"
   'domain '(trust fiduciary-duty)
   'confidence 1.0
   'provenance "Common law fiduciary principles"
   'related-principles '(no-profit-from-fiduciary-position)
   'inference-type 'deductive
   'application-context "Trustee personal gain prohibition"))

(define trustee-loyalty-duty
  (make-principle
   'name 'trustee-loyalty-duty
   'description "Trustees must act with undivided loyalty to beneficiaries"
   'domain '(trust fiduciary-duty)
   'confidence 1.0
   'provenance "Common law fiduciary principles"
   'related-principles '(trustee-fiduciary-duty)
   'inference-type 'deductive
   'application-context "Trustee loyalty obligation"))

(define beneficiary-adverse-action-prohibition
  (make-principle
   'name 'beneficiary-adverse-action-prohibition
   'description "Trustees must not take actions adverse to beneficiary interests"
   'domain '(trust fiduciary-duty)
   'confidence 1.0
   'provenance "Common law fiduciary principles"
   'related-principles '(trustee-fiduciary-duty trustee-conflict-prohibition)
   'inference-type 'deductive
   'application-context "Trustee actions adverse to beneficiaries"))

;; =============================================================================
;; TRUST PROPERTY PROTECTION
;; =============================================================================

(define trust-property-protection-duty
  (make-principle
   'name 'trust-property-protection-duty
   'description "Trustees must preserve and protect trust property"
   'domain '(trust)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, s9"
   'related-principles '(trust-asset-preservation prudent-investment)
   'inference-type 'deductive
   'application-context "Trust property protection"))

(define trust-asset-preservation
  (make-principle
   'name 'trust-asset-preservation
   'description "Trustees must preserve trust assets and prevent waste"
   'domain '(trust)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, s9"
   'related-principles '(trust-property-protection-duty)
   'inference-type 'deductive
   'application-context "Trust asset preservation"))

(define trustee-funding-duty
  (make-principle
   'name 'trustee-funding-duty
   'description "Trustees must adequately fund trust operations and assets"
   'domain '(trust)
   'confidence 0.9
   'provenance "Common law trust principles, trustee duty of care"
   'related-principles '(trust-property-protection-duty trustee-duty-of-care)
   'inference-type 'abductive
   'application-context "Trustee funding obligations"))

;; =============================================================================
;; TRUST POWER EXERCISE
;; =============================================================================

(define trust-power-proper-purpose
  (make-principle
   'name 'trust-power-proper-purpose
   'description "Trust powers must be exercised for their proper purpose"
   'domain '(trust)
   'confidence 1.0
   'provenance "Common law trust principles"
   'related-principles '(proper-purpose-test fiduciary-duty)
   'inference-type 'deductive
   'application-context "Exercise of trust powers"))

(define trust-power-proper-purpose-test
  (make-principle
   'name 'trust-power-proper-purpose-test
   'description "Trust powers must be exercised for their proper purpose, not ulterior motives"
   'domain '(trust fiduciary-duty)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, common law"
   'related-principles '(proper-purpose-test fiduciary-duty-trustee)
   'inference-type 'deductive
   'application-context "Exercise of trust powers and trustee discretion"))

(define trustee-discretion-limits
  (make-principle
   'name 'trustee-discretion-limits
   'description "Trustee discretion must be exercised reasonably and in good faith"
   'domain '(trust)
   'confidence 1.0
   'provenance "Common law trust principles"
   'related-principles '(trust-power-proper-purpose bona-fides)
   'inference-type 'deductive
   'application-context "Limits on trustee discretion"))

(define trust-remedy-priority-principle
  (make-principle
   'name 'trust-remedy-priority-principle
   'description "Trustees must exhaust trust remedies before seeking external legal action"
   'domain '(trust procedure)
   'confidence 0.9
   'provenance "Trust law common law principles"
   'related-principles '(trust-power-proper-purpose abuse-of-process)
   'inference-type 'abductive
   'application-context "Trust dispute resolution and remedy selection"))

;; =============================================================================
;; BENEFICIARY RIGHTS
;; =============================================================================

(define beneficiary-rights-principle
  (make-principle
   'name 'beneficiary-rights-principle
   'description "Beneficiaries have rights to trust property and trustee accountability"
   'domain '(trust)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, common law"
   'related-principles '(trust-property-protection trustee-accountability)
   'inference-type 'deductive
   'application-context "Beneficiary rights and protections"))

(define beneficiary-information-right
  (make-principle
   'name 'beneficiary-information-right
   'description "Beneficiaries have right to information about trust administration"
   'domain '(trust)
   'confidence 1.0
   'provenance "Common law trust principles"
   'related-principles '(trustee-accountability transparency)
   'inference-type 'deductive
   'application-context "Beneficiary information rights"))

(define beneficiary-protection-principle
  (make-principle
   'name 'beneficiary-protection-principle
   'description "Beneficiaries protected from trustee breaches and conflicts"
   'domain '(trust)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, common law"
   'related-principles '(trustee-fiduciary-duty beneficiary-rights-principle)
   'inference-type 'deductive
   'application-context "Beneficiary protection from trustee breaches"))

(define beneficiary-entitlement
  (make-principle
   'name 'beneficiary-entitlement
   'description "Beneficiaries entitled to trust distributions per trust deed"
   'domain '(trust)
   'confidence 1.0
   'provenance "Trust deed provisions, common law"
   'related-principles '(beneficiary-rights-principle trust-distribution-authority)
   'inference-type 'deductive
   'application-context "Beneficiary entitlements"))

;; =============================================================================
;; TRUSTEE ACCOUNTABILITY
;; =============================================================================

(define trustee-accounting-duty
  (make-principle
   'name 'trustee-accounting-duty
   'description "Trustees must keep proper accounts and provide accountings to beneficiaries"
   'domain '(trust)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, s16"
   'related-principles '(duty-to-account transparency)
   'inference-type 'deductive
   'application-context "Trustee accounting obligations"))

(define trustee-accountability-principle
  (make-principle
   'name 'trustee-accountability-principle
   'description "Trustees accountable to beneficiaries for trust administration"
   'domain '(trust)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, common law"
   'related-principles '(trustee-accounting-duty beneficiary-information-right)
   'inference-type 'deductive
   'application-context "Trustee accountability"))

(define trustee-liability-for-breach
  (make-principle
   'name 'trustee-liability-for-breach
   'description "Trustees liable for losses resulting from breach of trust"
   'domain '(trust liability)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, common law"
   'related-principles '(trustee-fiduciary-duty trustee-duty-of-care)
   'inference-type 'deductive
   'application-context "Trustee liability for breaches"))

;; =============================================================================
;; TRUST ASSET ABANDONMENT
;; =============================================================================

(define trust-asset-abandonment-principle
  (make-principle
   'name 'trust-asset-abandonment-principle
   'description "Trustee failure to fund and protect trust assets constitutes abandonment"
   'domain '(trust)
   'confidence 0.9
   'provenance "Common law trust principles"
   'related-principles '(trust-property-protection-duty trustee-funding-duty)
   'inference-type 'abductive
   'application-context "Trust asset abandonment"))

(define beneficial-ownership-by-funding-principle
  (make-principle
   'name 'beneficial-ownership-by-funding-principle
   'description "Continuous funding of abandoned trust asset may create beneficial ownership"
   'domain '(trust property)
   'confidence 0.8
   'provenance "Common law property and trust principles"
   'related-principles '(trust-asset-abandonment-principle beneficial-ownership)
   'inference-type 'abductive
   'application-context "Beneficial ownership through continuous funding"))

(define trust-property-relinquishment
  (make-principle
   'name 'trust-property-relinquishment
   'description "Trustee failure to exercise control may constitute relinquishment"
   'domain '(trust property)
   'confidence 0.8
   'provenance "Common law trust and property principles"
   'related-principles '(trust-asset-abandonment-principle)
   'inference-type 'abductive
   'application-context "Trust property relinquishment"))

;; =============================================================================
;; TRUST DISTRIBUTIONS
;; =============================================================================

(define trust-distribution-authority
  (make-principle
   'name 'trust-distribution-authority
   'description "Trustees with discretion may make distributions to beneficiaries"
   'domain '(trust)
   'confidence 1.0
   'provenance "Trust deed provisions, common law"
   'related-principles '(trustee-discretion beneficiary-entitlement)
   'inference-type 'deductive
   'application-context "Trust distributions and beneficiary entitlements"))

(define trust-distribution-reasonableness
  (make-principle
   'name 'trust-distribution-reasonableness
   'description "Trust distributions must be reasonable and in beneficiaries' interests"
   'domain '(trust)
   'confidence 1.0
   'provenance "Common law trust principles"
   'related-principles '(trust-distribution-authority trustee-fiduciary-duty)
   'inference-type 'deductive
   'application-context "Reasonable trust distributions"))

;; =============================================================================
;; BENEFICIARY HARM ASSESSMENT
;; =============================================================================

(define beneficiary-harm-assessment
  (make-principle
   'name 'beneficiary-harm-assessment
   'description "Trustees liable for harm to beneficiaries caused by breach of duty"
   'domain '(trust liability)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, common law"
   'related-principles '(fiduciary-duty-trustee trustee-liability)
   'inference-type 'deductive
   'application-context "Trustee liability and beneficiary remedies"))

(define trust-property-diminution
  (make-principle
   'name 'trust-property-diminution
   'description "Trustee actions causing trust property diminution breach duty"
   'domain '(trust)
   'confidence 1.0
   'provenance "Trust Property Control Act 57 of 1988, s9"
   'related-principles '(trust-property-protection-duty trust-asset-preservation)
   'inference-type 'deductive
   'application-context "Trust property diminution"))

;; =============================================================================
;; TRUST LAW TESTS AND FUNCTIONS
;; =============================================================================

;; Trustee Duty Breach Test
(define trustee-duty-breach-test
  (lambda (action trustee beneficiaries)
    (or (not-in-beneficiaries-interests? action beneficiaries)
        (conflict-of-interest? action trustee)
        (personal-gain? action trustee)
        (improper-purpose? action)
        (lack-of-care? action trustee)
        (trust-property-harm? action))))

;; Beneficiary Adverse Action Test
(define beneficiary-adverse-action-test
  (lambda (action trustee beneficiary)
    (and (trustee-capacity-action? action trustee)
         (harms-beneficiary? action beneficiary)
         (no-trust-benefit? action)
         (personal-interest-evident? action trustee))))

;; Trust Power Abuse Test
(define trust-power-abuse-test
  (lambda (action trustee trust-powers)
    (and (trust-power-available? trustee trust-powers action)
         (bypasses-trust-power? action)
         (seeks-external-remedy? action)
         (ulterior-motive-evident? action))))

;; Trust Power Bypass Test
(define trust-power-bypass-test
  (lambda (action trustee trust-powers)
    (and (trust-power-available? trustee trust-powers)
         (trust-power-adequate? trust-powers action)
         (seeks-external-remedy? action)
         (no-justification-for-bypass? action))))

;; Beneficiary Harm Test
(define beneficiary-harm-test
  (lambda (action beneficiary)
    (and (financial-harm? action beneficiary)
         (operational-harm? action beneficiary)
         (trust-property-diminution? action)
         (causation-established? action beneficiary))))

;; Trust Abandonment Indicators
(define trust-abandonment-indicators
  (lambda (trust-asset trustee third-party timeline)
    (and (no-trust-funding? trust-asset timeline)
         (third-party-continuous-funding? third-party trust-asset timeline)
         (no-trust-protection? trustee trust-asset)
         (trustee-attacks-funder? trustee third-party))))

;; Trust Distribution Test
(define trust-distribution-test
  (lambda (distribution trustee beneficiary trust-deed)
    (and (trustee-has-authority? trustee trust-deed distribution)
         (beneficiary-entitled? beneficiary trust-deed)
         (proper-purpose? distribution)
         (trust-can-afford? distribution))))

;; Trust Operation Indicators
(define trust-operation-indicators
  (lambda (entity)
    (and (holds-property-for-beneficiaries? entity)
         (trustee-administers? entity)
         (beneficiary-entitlements-exist? entity)
         (trust-deed-governs? entity))))

;; =============================================================================
;; PLACEHOLDER FUNCTIONS FOR IMPLEMENTATION
;; =============================================================================

;; These functions provide the structure for future implementation with
;; specific legal rules, algorithms, or machine learning models

(define not-in-beneficiaries-interests? (lambda (action beneficiaries) #f))
(define conflict-of-interest? (lambda (action trustee) #f))
(define personal-gain? (lambda (action trustee) #f))
(define improper-purpose? (lambda (action) #f))
(define lack-of-care? (lambda (action trustee) #f))
(define trust-property-harm? (lambda (action) #f))
(define trustee-capacity-action? (lambda (action trustee) #f))
(define harms-beneficiary? (lambda (action beneficiary) #f))
(define no-trust-benefit? (lambda (action) #f))
(define personal-interest-evident? (lambda (action trustee) #f))
(define trust-power-available? (lambda (trustee trust-powers action) #f))
(define bypasses-trust-power? (lambda (action) #f))
(define seeks-external-remedy? (lambda (action) #f))
(define ulterior-motive-evident? (lambda (action) #f))
(define trust-power-adequate? (lambda (trust-powers action) #f))
(define no-justification-for-bypass? (lambda (action) #f))
(define financial-harm? (lambda (action beneficiary) #f))
(define operational-harm? (lambda (action beneficiary) #f))
(define trust-property-diminution? (lambda (action) #f))
(define causation-established? (lambda (action beneficiary) #f))
(define no-trust-funding? (lambda (trust-asset timeline) #f))
(define third-party-continuous-funding? (lambda (third-party trust-asset timeline) #f))
(define no-trust-protection? (lambda (trustee trust-asset) #f))
(define trustee-attacks-funder? (lambda (trustee third-party) #f))
(define trustee-has-authority? (lambda (trustee trust-deed distribution) #f))
(define beneficiary-entitled? (lambda (beneficiary trust-deed) #f))
(define proper-purpose? (lambda (distribution) #f))
(define trust-can-afford? (lambda (distribution) #f))
(define holds-property-for-beneficiaries? (lambda (entity) #f))
(define trustee-administers? (lambda (entity) #f))
(define beneficiary-entitlements-exist? (lambda (entity) #f))
(define trust-deed-governs? (lambda (entity) #f))

;; =============================================================================
;; INTEGRATION WITH HYPERGRAPHQL ENGINE
;; =============================================================================

;; This module automatically integrates with the HypergraphQL engine
;; for graph traversal, pattern matching, and legal reasoning queries

;; Export all principles for HypergraphQL integration
(define trust-law-principles
  (list
   trust-legal-nature
   trust-property-separation
   trustee-fiduciary-duty
   trustee-duty-of-care
   trustee-conflict-prohibition
   trustee-personal-gain-prohibition
   trustee-loyalty-duty
   beneficiary-adverse-action-prohibition
   trust-property-protection-duty
   trust-asset-preservation
   trustee-funding-duty
   trust-power-proper-purpose
   trust-power-proper-purpose-test
   trustee-discretion-limits
   trust-remedy-priority-principle
   beneficiary-rights-principle
   beneficiary-information-right
   beneficiary-protection-principle
   beneficiary-entitlement
   trustee-accounting-duty
   trustee-accountability-principle
   trustee-liability-for-breach
   trust-asset-abandonment-principle
   beneficial-ownership-by-funding-principle
   trust-property-relinquishment
   trust-distribution-authority
   trust-distribution-reasonableness
   beneficiary-harm-assessment
   trust-property-diminution))

;; Export all test functions
(define trust-law-tests
  (list
   trustee-duty-breach-test
   beneficiary-adverse-action-test
   trust-power-abuse-test
   trust-power-bypass-test
   beneficiary-harm-test
   trust-abandonment-indicators
   trust-distribution-test
   trust-operation-indicators))

;; =============================================================================
;; END OF SOUTH AFRICAN TRUST LAW MODULE
;; =============================================================================

