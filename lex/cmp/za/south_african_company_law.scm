;; south_african_company_law.scm
;; South African Company Law Framework
;; Based on Companies Act 71 of 2008
;; Scheme implementation for legal reasoning and rule-based systems

;; =============================================================================
;; METADATA AND VERSION INFORMATION
;; =============================================================================
;; Version: 1.0
;; Last Updated: 2025-10-26
;; Purpose: Comprehensive company law framework for AD-RES-J7 case analysis
;; Coverage: Director duties, corporate governance, related-party transactions,
;;           shareholder rights, inter-company transactions

;; =============================================================================
;; CORE COMPANY LAW PRINCIPLES
;; =============================================================================

;; Corporate Personality
(define separate-legal-personality
  (make-principle
   'name 'separate-legal-personality
   'description "Company is separate legal person distinct from shareholders and directors"
   'domain '(company)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s19"
   'related-principles '(limited-liability corporate-capacity)
   'inference-type 'deductive
   'application-context "Corporate identity and legal personality"))

(define limited-liability
  (make-principle
   'name 'limited-liability
   'description "Shareholders liability limited to amount unpaid on shares"
   'domain '(company)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s19(2)"
   'related-principles '(separate-legal-personality shareholder-protection)
   'inference-type 'deductive
   'application-context "Shareholder liability limitations"))

(define corporate-capacity
  (make-principle
   'name 'corporate-capacity
   'description "Company has legal capacity and powers of natural person"
   'domain '(company)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s19(1)(b)"
   'related-principles '(separate-legal-personality)
   'inference-type 'deductive
   'application-context "Corporate legal capacity"))

;; =============================================================================
;; DIRECTOR FIDUCIARY DUTIES (Section 76)
;; =============================================================================

(define director-fiduciary-duty
  (make-principle
   'name 'director-fiduciary-duty
   'description "Directors must act in good faith and for proper purpose in company's best interests"
   'domain '(company fiduciary-duty)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s76(3)(a)"
   'related-principles '(bona-fides proper-purpose-test)
   'inference-type 'deductive
   'application-context "Director fiduciary obligations"))

(define director-duty-of-care
  (make-principle
   'name 'director-duty-of-care
   'description "Directors must exercise care, skill and diligence of reasonable person"
   'domain '(company)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s76(3)(c)"
   'related-principles '(duty-of-care reasonable-person-standard)
   'inference-type 'deductive
   'application-context "Director standard of care"))

(define director-conflict-prohibition
  (make-principle
   'name 'director-conflict-prohibition
   'description "Directors must avoid conflicts between personal interests and company duties"
   'domain '(company fiduciary-duty)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s75"
   'related-principles '(conflict-of-interest fiduciary-duty)
   'inference-type 'deductive
   'application-context "Director conflicts of interest"))

(define director-no-personal-gain
  (make-principle
   'name 'director-no-personal-gain
   'description "Directors must not use position or information for personal gain"
   'domain '(company fiduciary-duty)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s76(3)(b)"
   'related-principles '(fiduciary-duty conflict-of-interest)
   'inference-type 'deductive
   'application-context "Director personal gain prohibition"))

(define director-proper-purpose
  (make-principle
   'name 'director-proper-purpose
   'description "Directors must exercise powers for proper purpose"
   'domain '(company fiduciary-duty)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s76(3)(a)"
   'related-principles '(proper-purpose-test fiduciary-duty)
   'inference-type 'deductive
   'application-context "Director proper purpose requirement"))

;; =============================================================================
;; BUSINESS JUDGMENT RULE (Section 76(4))
;; =============================================================================

(define business-judgment-rule
  (make-principle
   'name 'business-judgment-rule
   'description "Directors protected for informed, good faith decisions on rational basis"
   'domain '(company director-protection)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s76(4)"
   'related-principles '(bona-fides rational-basis-test)
   'inference-type 'deductive
   'application-context "Director liability protection"))

(define business-judgment-protection-requirements
  (make-principle
   'name 'business-judgment-protection-requirements
   'description "Protection requires: informed decision, good faith, rational basis, no conflict"
   'domain '(company director-protection)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s76(4)"
   'related-principles '(business-judgment-rule)
   'inference-type 'deductive
   'application-context "Business judgment rule requirements"))

;; =============================================================================
;; CORPORATE GOVERNANCE
;; =============================================================================

(define board-collective-action
  (make-principle
   'name 'board-collective-action
   'description "Board decisions must be made collectively through proper resolutions"
   'domain '(company corporate-governance)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s66"
   'related-principles '(board-authority proper-procedure)
   'inference-type 'deductive
   'application-context "Board decision-making"))

(define director-collective-action-requirement
  (make-principle
   'name 'director-collective-action-requirement
   'description "Directors must act collectively through board resolutions for major decisions"
   'domain '(company corporate-governance)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s66"
   'related-principles '(board-authority proper-purpose-test)
   'inference-type 'deductive
   'application-context "Director decision-making and corporate authority"))

(define board-resolution-requirement
  (make-principle
   'name 'board-resolution-requirement
   'description "Major corporate actions require board resolution"
   'domain '(company corporate-governance)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s66"
   'related-principles '(board-collective-action)
   'inference-type 'deductive
   'application-context "Board resolution requirements"))

(define director-signatory-authority
  (make-principle
   'name 'director-signatory-authority
   'description "Directors with signatory authority may authorize payments within their mandate"
   'domain '(company corporate-authority)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s66; MOI provisions"
   'related-principles '(corporate-authority board-delegation)
   'inference-type 'deductive
   'application-context "Director payment authorization and corporate transactions"))

(define director-information-duty
  (make-principle
   'name 'director-information-duty
   'description "Directors must provide accurate information for company records and reporting"
   'domain '(company corporate-governance)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s76(3)"
   'related-principles '(duty-to-account transparency-principle)
   'inference-type 'deductive
   'application-context "Director reporting obligations and corporate transparency"))

;; =============================================================================
;; RELATED-PARTY TRANSACTIONS (Section 75)
;; =============================================================================

(define related-party-transaction-disclosure
  (make-principle
   'name 'related-party-transaction-disclosure
   'description "Directors must disclose personal financial interests in company matters"
   'domain '(company disclosure)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s75"
   'related-principles '(conflict-of-interest disclosure-duty)
   'inference-type 'deductive
   'application-context "Related-party transaction disclosure"))

(define director-self-dealing-prohibition
  (make-principle
   'name 'director-self-dealing-prohibition
   'description "Directors must not engage in self-dealing without disclosure and approval"
   'domain '(company fiduciary-duty)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s75"
   'related-principles '(conflict-of-interest related-party-transaction-disclosure)
   'inference-type 'deductive
   'application-context "Director self-dealing transactions"))

(define related-party-transaction-test
  (make-principle
   'name 'related-party-transaction-test
   'description "Related-party transactions must be disclosed, fair, and at arm's length"
   'domain '(company corporate-governance)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s75; IFRS"
   'related-principles '(arm's-length-transaction fairness-test disclosure-duty)
   'inference-type 'deductive
   'application-context "Related-party transactions and conflict management"))

(define interested-director-transaction-rules
  (make-principle
   'name 'interested-director-transaction-rules
   'description "Interested directors must disclose interest and may not vote on transaction"
   'domain '(company corporate-governance)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s75"
   'related-principles '(related-party-transaction-disclosure conflict-of-interest)
   'inference-type 'deductive
   'application-context "Interested director transaction procedures"))

;; =============================================================================
;; SHAREHOLDER RIGHTS AND REMEDIES
;; =============================================================================

(define shareholder-oppression-remedy
  (make-principle
   'name 'shareholder-oppression-remedy
   'description "Shareholders have remedy for oppressive or unfairly prejudicial conduct"
   'domain '(company shareholder-rights)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s163"
   'related-principles '(shareholder-protection unfair-prejudice)
   'inference-type 'deductive
   'application-context "Shareholder oppression remedies"))

(define shareholder-rights-principle
  (make-principle
   'name 'shareholder-rights-principle
   'description "Shareholders have rights to information, dividends, and participation"
   'domain '(company shareholder-rights)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008"
   'related-principles '(shareholder-protection)
   'inference-type 'deductive
   'application-context "Shareholder rights and protections"))

(define minority-shareholder-protection
  (make-principle
   'name 'minority-shareholder-protection
   'description "Minority shareholders protected from oppression by majority"
   'domain '(company shareholder-rights)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s163"
   'related-principles '(shareholder-oppression-remedy)
   'inference-type 'deductive
   'application-context "Minority shareholder protection"))

;; =============================================================================
;; INTER-COMPANY TRANSACTION PRINCIPLES
;; =============================================================================

(define arm's-length-transaction-principle
  (make-principle
   'name 'arm's-length-transaction-principle
   'description "Inter-company transactions must be at arm's length and market-related"
   'domain '(company tax)
   'confidence 1.0
   'provenance "Transfer pricing rules, OECD guidelines"
   'related-principles '(market-value fair-dealing)
   'inference-type 'deductive
   'application-context "Inter-company transactions and transfer pricing"))

(define transfer-pricing-compliance
  (make-principle
   'name 'transfer-pricing-compliance
   'description "Inter-company pricing must comply with transfer pricing regulations"
   'domain '(company tax)
   'confidence 1.0
   'provenance "Income Tax Act 58 of 1962, s31"
   'related-principles '(arm's-length-transaction-principle tax-compliance)
   'inference-type 'deductive
   'application-context "Transfer pricing and inter-company transactions"))

(define inter-company-transaction-fairness
  (make-principle
   'name 'inter-company-transaction-fairness
   'description "Inter-company transactions must be fair to all companies involved"
   'domain '(company corporate-governance)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, fiduciary duties"
   'related-principles '(arm's-length-transaction-principle fairness-test)
   'inference-type 'deductive
   'application-context "Inter-company transaction fairness"))

;; =============================================================================
;; CORPORATE VEIL PIERCING
;; =============================================================================

(define corporate-veil-piercing-principle
  (make-principle
   'name 'corporate-veil-piercing-principle
   'description "Corporate veil may be pierced for fraud, sham, or abuse of corporate form"
   'domain '(company)
   'confidence 0.9
   'provenance "Common law, Companies Act 71 of 2008, s20(9)"
   'related-principles '(fraud-principle abuse-of-corporate-form)
   'inference-type 'abductive
   'application-context "Corporate veil piercing and alter ego liability"))

(define abuse-of-corporate-form
  (make-principle
   'name 'abuse-of-corporate-form
   'description "Corporate form may not be used to perpetrate fraud or injustice"
   'domain '(company)
   'confidence 1.0
   'provenance "Common law, Companies Act 71 of 2008, s20(9)"
   'related-principles '(corporate-veil-piercing-principle fraud-principle)
   'inference-type 'abductive
   'application-context "Abuse of corporate form"))

;; =============================================================================
;; DIRECTOR WRONGFUL ACTIONS
;; =============================================================================

(define unilateral-director-action-wrongfulness
  (make-principle
   'name 'unilateral-director-action-wrongfulness
   'description "Unilateral director actions causing company harm are wrongful"
   'domain '(company delict)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s76; delict law"
   'related-principles '(wrongfulness director-collective-action-requirement)
   'inference-type 'deductive
   'application-context "Director wrongful actions and company harm"))

(define director-liability-for-breach
  (make-principle
   'name 'director-liability-for-breach
   'description "Directors liable for losses resulting from breach of duties"
   'domain '(company liability)
   'confidence 1.0
   'provenance "Companies Act 71 of 2008, s77"
   'related-principles '(director-fiduciary-duty director-duty-of-care)
   'inference-type 'deductive
   'application-context "Director liability for duty breaches"))

;; =============================================================================
;; COMPANY LAW TESTS AND FUNCTIONS
;; =============================================================================

;; Director Duty Breach Test
(define director-duty-breach-test
  (lambda (action director company)
    (or (bad-faith? action)
        (improper-purpose? action)
        (lack-of-care? action director)
        (conflict-of-interest? action director)
        (personal-gain? action director)
        (competition-with-company? action director company))))

;; Self-Dealing Transaction Test
(define self-dealing-transaction-test
  (lambda (transaction director company)
    (and (director-has-interest? director transaction)
         (company-is-party? company transaction)
         (or (no-disclosure? transaction)
             (no-independent-approval? transaction)
             (not-arm's-length? transaction)))))

;; Unilateral Director Action Test
(define unilateral-director-action-test
  (lambda (action director board)
    (and (major-decision? action)
         (no-board-resolution? action)
         (no-emergency-circumstances? action)
         (harm-to-company? action))))

;; Business Judgment Protection Test
(define business-judgment-protection-test
  (lambda (decision director)
    (and (informed-decision? decision director)
         (good-faith? decision director)
         (rational-basis? decision)
         (no-conflict-of-interest? decision director))))

;; Related-Party Transaction Test
(define related-party-transaction-test-function
  (lambda (transaction parties)
    (and (parties-related? parties)
         (or (common-ownership? parties)
             (common-control? parties)
             (director-interest? parties transaction)))))

;; Arm's Length Transaction Test
(define arm's-length-transaction-test
  (lambda (transaction market-comparables)
    (and (market-related-pricing? transaction market-comparables)
         (commercial-terms? transaction)
         (independent-negotiation? transaction)
         (no-preferential-treatment? transaction))))

;; Shareholder Oppression Test
(define shareholder-oppression-test
  (lambda (conduct shareholder)
    (or (unfairly-prejudicial? conduct shareholder)
        (unfairly-disregards-interests? conduct shareholder)
        (oppressive-conduct? conduct shareholder))))

;; Veil Piercing Test
(define veil-piercing-test
  (lambda (company conduct)
    (or (fraud-or-dishonesty? conduct)
        (sham-transaction? company conduct)
        (abuse-of-corporate-form? company conduct)
        (unconscionable-injustice? conduct))))

;; Operational Disruption Test
(define operational-disruption-test
  (lambda (action company)
    (and (business-operations-impaired? action company)
         (no-board-authorization? action)
         (no-emergency-justification? action)
         (financial-harm-caused? action company))))

;; Excessive Profit Extraction Test
(define excessive-profit-extraction-test
  (lambda (transaction profit-margin industry-average)
    (and (profit-margin-excessive? profit-margin industry-average)
         (no-value-justification? transaction)
         (shareholder-harm? transaction)
         (oppression-indicators? transaction))))

;; =============================================================================
;; PLACEHOLDER FUNCTIONS FOR IMPLEMENTATION
;; =============================================================================

;; These functions provide the structure for future implementation with
;; specific legal rules, algorithms, or machine learning models

(define bad-faith? (lambda (action) #f))
(define improper-purpose? (lambda (action) #f))
(define lack-of-care? (lambda (action director) #f))
(define conflict-of-interest? (lambda (action director) #f))
(define personal-gain? (lambda (action director) #f))
(define competition-with-company? (lambda (action director company) #f))
(define director-has-interest? (lambda (director transaction) #f))
(define company-is-party? (lambda (company transaction) #f))
(define no-disclosure? (lambda (transaction) #f))
(define no-independent-approval? (lambda (transaction) #f))
(define not-arm's-length? (lambda (transaction) #f))
(define major-decision? (lambda (action) #f))
(define no-board-resolution? (lambda (action) #f))
(define no-emergency-circumstances? (lambda (action) #f))
(define harm-to-company? (lambda (action) #f))
(define informed-decision? (lambda (decision director) #f))
(define good-faith? (lambda (decision director) #f))
(define rational-basis? (lambda (decision) #f))
(define parties-related? (lambda (parties) #f))
(define common-ownership? (lambda (parties) #f))
(define common-control? (lambda (parties) #f))
(define director-interest? (lambda (parties transaction) #f))
(define market-related-pricing? (lambda (transaction market-comparables) #f))
(define commercial-terms? (lambda (transaction) #f))
(define independent-negotiation? (lambda (transaction) #f))
(define no-preferential-treatment? (lambda (transaction) #f))
(define unfairly-prejudicial? (lambda (conduct shareholder) #f))
(define unfairly-disregards-interests? (lambda (conduct shareholder) #f))
(define oppressive-conduct? (lambda (conduct shareholder) #f))
(define fraud-or-dishonesty? (lambda (conduct) #f))
(define sham-transaction? (lambda (company conduct) #f))
(define unconscionable-injustice? (lambda (conduct) #f))
(define business-operations-impaired? (lambda (action company) #f))
(define no-board-authorization? (lambda (action) #f))
(define no-emergency-justification? (lambda (action) #f))
(define financial-harm-caused? (lambda (action company) #f))
(define profit-margin-excessive? (lambda (profit-margin industry-average) #f))
(define no-value-justification? (lambda (transaction) #f))
(define shareholder-harm? (lambda (transaction) #f))
(define oppression-indicators? (lambda (transaction) #f))

;; =============================================================================
;; INTEGRATION WITH HYPERGRAPHQL ENGINE
;; =============================================================================

;; This module automatically integrates with the HypergraphQL engine
;; for graph traversal, pattern matching, and legal reasoning queries

;; Export all principles for HypergraphQL integration
(define company-law-principles
  (list
   separate-legal-personality
   limited-liability
   corporate-capacity
   director-fiduciary-duty
   director-duty-of-care
   director-conflict-prohibition
   director-no-personal-gain
   director-proper-purpose
   business-judgment-rule
   business-judgment-protection-requirements
   board-collective-action
   director-collective-action-requirement
   board-resolution-requirement
   director-signatory-authority
   director-information-duty
   related-party-transaction-disclosure
   director-self-dealing-prohibition
   related-party-transaction-test
   interested-director-transaction-rules
   shareholder-oppression-remedy
   shareholder-rights-principle
   minority-shareholder-protection
   arm's-length-transaction-principle
   transfer-pricing-compliance
   inter-company-transaction-fairness
   corporate-veil-piercing-principle
   abuse-of-corporate-form
   unilateral-director-action-wrongfulness
   director-liability-for-breach))

;; Export all test functions
(define company-law-tests
  (list
   director-duty-breach-test
   self-dealing-transaction-test
   unilateral-director-action-test
   business-judgment-protection-test
   related-party-transaction-test-function
   arm's-length-transaction-test
   shareholder-oppression-test
   veil-piercing-test
   operational-disruption-test
   excessive-profit-extraction-test))

;; =============================================================================
;; END OF SOUTH AFRICAN COMPANY LAW MODULE
;; =============================================================================

