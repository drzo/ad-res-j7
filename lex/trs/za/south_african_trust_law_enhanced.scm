;; South African Trust Law - Enhanced for Case 2025-137857
;; Trust Property Control Act 57 of 1988 - Trustee Duties, Beneficiary Rights, Trust Administration
;; =============================================================================
;; Version: 2.0 (Enhanced)
;; Last Updated: 2025-10-27
;; Case-Specific Enhancements: Faucitt v. Faucitt
;; =============================================================================

;; Import Level 1 first-order principles
(require "../../lv1/known_laws.scm")

;; Initialize principle registry
(initialize-principle-registry!)

;; =============================================================================
;; FRAMEWORK METADATA
;; =============================================================================

(define framework-metadata
  (make-hash-table
   'name "South African Trust Law (Enhanced)"
   'jurisdiction "za"
   'legal-domain '(trust fiduciary)
   'version "2.0"
   'last-updated "2025-10-27"
   'derived-from-level 1
   'confidence-base 0.95
   'statutory-basis "Trust Property Control Act 57 of 1988"
   'language "en"
   'case-specific-enhancements "Faucitt v. Faucitt (2025-137857)"))

;; =============================================================================
;; PART 1: TRUSTEE FIDUCIARY DUTIES
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 1.1 General Trustee Fiduciary Duty Framework
;; -----------------------------------------------------------------------------

(define trustee-fiduciary-duty-comprehensive
  (derive-from-principles
   'name 'trustee-fiduciary-duty-comprehensive
   'base-principles (list fiduciary-duty bona-fides)
   'inference-type 'deductive
   'jurisdiction "za"
   'statutory-basis "Trust Property Control Act 57 of 1988, common law"
   'description "Trustee owes highest fiduciary duty to beneficiaries and trust"
   'confidence 0.98
   'duties '(duty-of-loyalty duty-of-care duty-of-prudence 
            duty-of-impartiality duty-to-account duty-to-preserve-trust-property)
   'standard "Highest standard of good faith and loyalty"
   'related-principles '(bona-fides fiduciary-duty duty-of-care)))

(define trustee-duty-of-loyalty
  (make-principle
   'name 'trustee-duty-of-loyalty
   'description "Trustee must act with undivided loyalty to beneficiaries"
   'domain '(trust fiduciary)
   'confidence 0.98
   'jurisdiction "za"
   'statutory-basis "Common law fiduciary duty"
   'provenance "Equity, common law"
   'requirements '(undivided-loyalty no-conflict-of-interest 
                  no-personal-benefit act-in-beneficiary-interests)
   'prohibitions '(self-dealing conflict-of-interest 
                  adverse-action-against-beneficiary personal-profit)
   'inference-type 'deductive))

(define trustee-duty-of-care
  (make-principle
   'name 'trustee-duty-of-care
   'description "Trustee must exercise care, skill and diligence in trust administration"
   'domain '(trust fiduciary)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Trust Property Control Act 57 of 1988, common law"
   'standard "Reasonable trustee in similar circumstances"
   'factors '(trustee-knowledge trustee-experience nature-of-trust 
             complexity-of-trust-property)
   'breach-consequences '(personal-liability removal-as-trustee 
                         account-for-losses surcharge)
   'inference-type 'deductive))

(define trustee-duty-of-prudence
  (make-principle
   'name 'trustee-duty-of-prudence
   'description "Trustee must exercise prudence in managing trust property"
   'domain '(trust fiduciary)
   'confidence 0.97
   'jurisdiction "za"
   'requirements '(prudent-investment preservation-of-capital 
                  diversification risk-management)
   'prohibited-actions '(speculation reckless-investment 
                        self-dealing unauthorized-transactions)
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 1.2 Trustee Conflict of Interest
;; -----------------------------------------------------------------------------

(define trustee-conflict-prohibition
  (make-principle
   'name 'trustee-conflict-prohibition
   'description "Trustee must avoid conflicts between personal interests and trust interests"
   'domain '(trust fiduciary)
   'confidence 0.98
   'jurisdiction "za"
   'statutory-basis "Common law fiduciary duty"
   'provenance "Equity - no conflict rule"
   'absolute-prohibition "Trustee cannot place self in position of conflict"
   'examples '(trustee-dealing-with-trust-property 
              trustee-competing-with-trust
              trustee-taking-trust-opportunity
              trustee-acting-adversely-to-beneficiary)
   'case-application "Peter as trustee seeking interdict against Jax (beneficiary) (Faucitt case)"
   'consequences '(transaction-voidable account-for-profits 
                  removal-as-trustee personal-liability)
   'related-principles '(nemo-iudex-in-causa-sua fiduciary-duty)
   'inference-type 'deductive))

(define beneficiary-adverse-action-prohibition
  (make-principle
   'name 'beneficiary-adverse-action-prohibition
   'description "Trustee cannot take action adverse to beneficiary interests"
   'domain '(trust fiduciary)
   'confidence 0.97
   'jurisdiction "za"
   'provenance "Common law fiduciary duty"
   'prohibition "Trustee cannot sue, attack, or act against beneficiary in trustee capacity"
   'exceptions '(beneficiary-breach-of-trust-deed 
                beneficiary-fraud-against-trust
                beneficiary-claiming-beyond-entitlement)
   'case-application "Peter (trustee) seeking interdict against Jax (beneficiary) (Faucitt case)"
   'analysis "Why seek court relief when trustee has power to act directly within trust?"
   'inference "Seeking court relief suggests ulterior motive beyond trust administration"
   'consequences '(breach-of-fiduciary-duty 
                  removal-as-trustee
                  abuse-of-trust-powers)
   'related-principles '(trustee-conflict-prohibition proper-purpose-of-trust-powers)
   'inference-type 'deductive))

(define trustee-self-dealing-prohibition
  (make-principle
   'name 'trustee-self-dealing-prohibition
   'description "Trustee cannot deal with trust property for personal benefit"
   'domain '(trust fiduciary)
   'confidence 0.98
   'jurisdiction "za"
   'provenance "Equity - no profit rule"
   'absolute-prohibition "Trustee cannot profit from trust position"
   'examples '(buying-trust-property selling-to-trust 
              lending-to-trust borrowing-from-trust
              using-trust-property-personally)
   'exceptions '(express-trust-deed-authorization 
                beneficiary-informed-consent
                court-approval)
   'consequences '(transaction-voidable account-for-profits 
                  constructive-trust removal-as-trustee)
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 1.3 Trust Powers and Proper Purpose
;; -----------------------------------------------------------------------------

(define trust-power-proper-purpose
  (make-principle
   'name 'trust-power-proper-purpose
   'description "Trustee must exercise trust powers for proper purpose, not ulterior motive"
   'domain '(trust fiduciary)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Trust Property Control Act 57 of 1988, common law"
   'requirement "Powers must be exercised for purpose for which they were granted"
   'improper-purposes '(personal-benefit ulterior-motive 
                       collateral-purpose abuse-of-power)
   'case-application "Peter bypassing trust powers to seek court interdict (Faucitt case)"
   'analysis "If Peter has absolute trust powers, why seek court relief?"
   'inference "Seeking court relief suggests improper purpose (leverage, harassment, delay)"
   'related-principles '(proper-purpose-test bona-fides)
   'inference-type 'deductive))

(define trust-power-abuse-test
  (make-principle
   'name 'trust-power-abuse-test
   'description "Test for whether trustee has abused trust powers"
   'domain '(trust fiduciary)
   'confidence 0.95
   'jurisdiction "za"
   'test-elements '(identify-power identify-purpose 
                   assess-legitimacy assess-dominant-purpose
                   consider-timing consider-context)
   'abuse-indicators '(ulterior-motive personal-benefit 
                      inconsistent-with-trust-purpose
                      disproportionate-action timing-suspicious
                      bypassing-available-powers)
   'case-application "Peter has absolute trust powers but seeks court interdict (Faucitt case)"
   'inference "Bypassing available powers suggests abuse or improper purpose"
   'consequences '(action-invalid removal-as-trustee 
                  personal-liability breach-of-fiduciary-duty)
   'inference-type 'inductive))

(define ulterior-motive-analysis
  (make-principle
   'name 'ulterior-motive-analysis
   'description "Analysis framework for identifying ulterior motives in trustee actions"
   'domain '(trust fiduciary procedural)
   'confidence 0.93
   'jurisdiction "za"
   'indicators '(action-inconsistent-with-stated-purpose 
                timing-coordinated-with-other-events
                disproportionate-to-stated-concern
                personal-benefit-from-action
                bypassing-available-alternatives)
   'case-application "Peter's interdict timing with settlement negotiation (Faucitt case)"
   'inference-type 'inductive
   'evidential-weight "Multiple indicators strengthen inference of ulterior motive"
   'legal-consequences '(rebuts-good-faith-presumption 
                        breach-of-proper-purpose
                        abuse-of-process)
   'related-principles '(proper-purpose-test bona-fides)))

;; -----------------------------------------------------------------------------
;; 1.4 Trust Administration Duties
;; -----------------------------------------------------------------------------

(define trust-administration-duty
  (make-principle
   'name 'trust-administration-duty
   'description "Trustee must properly administer trust according to trust deed and law"
   'domain '(trust fiduciary)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Trust Property Control Act 57 of 1988"
   'duties '(follow-trust-deed preserve-trust-property 
            keep-accounts provide-information
            act-impartially invest-prudently
            distribute-according-to-deed)
   'breach-consequences '(personal-liability removal-as-trustee 
                         account-for-losses surcharge)
   'inference-type 'deductive))

(define trust-property-preservation-duty
  (make-principle
   'name 'trust-property-preservation-duty
   'description "Trustee must preserve and protect trust property"
   'domain '(trust fiduciary)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Trust Property Control Act 57 of 1988"
   'requirements '(maintain-property prevent-waste 
                  insure-property secure-property
                  prevent-unauthorized-use)
   'breach-examples '(allowing-deterioration failing-to-insure 
                     unauthorized-use neglect)
   'inference-type 'deductive))

(define trustee-duty-to-account
  (make-principle
   'name 'trustee-duty-to-account
   'description "Trustee must keep proper accounts and provide information to beneficiaries"
   'domain '(trust fiduciary)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Trust Property Control Act 57 of 1988, s16"
   'requirements '(keep-proper-accounts annual-financial-statements 
                  provide-information-to-beneficiaries
                  transparency-in-administration)
   'beneficiary-rights '(inspect-accounts request-information 
                        challenge-transactions demand-accounting)
   'breach-consequences '(removal-as-trustee personal-liability 
                         adverse-inference)
   'inference-type 'deductive))

;; =============================================================================
;; PART 2: BENEFICIARY RIGHTS
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 2.1 General Beneficiary Rights Framework
;; -----------------------------------------------------------------------------

(define beneficiary-rights-comprehensive
  (make-principle
   'name 'beneficiary-rights-comprehensive
   'description "Comprehensive framework of beneficiary rights under trust law"
   'domain '(trust beneficiary-rights)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Trust Property Control Act 57 of 1988, common law"
   'rights '(right-to-trust-property right-to-information 
            right-to-accounting right-to-sue-trustee
            right-to-remove-trustee right-to-court-protection)
   'enforcement-mechanisms '(court-application removal-of-trustee 
                            accounting-order damages-claim)
   'inference-type 'deductive))

(define beneficiary-right-to-information
  (make-principle
   'name 'beneficiary-right-to-information
   'description "Beneficiary has right to information about trust administration"
   'domain '(trust beneficiary-rights)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Trust Property Control Act 57 of 1988, common law"
   'information-rights '(inspect-trust-accounts review-trust-documents 
                        request-explanations challenge-transactions)
   'trustee-duty "Trustee must provide information unless good reason not to"
   'enforcement "Court can order disclosure and accounting"
   'inference-type 'deductive))

(define beneficiary-protection-from-trustee-abuse
  (make-principle
   'name 'beneficiary-protection-from-trustee-abuse
   'description "Beneficiary protected from trustee abuse of powers"
   'domain '(trust beneficiary-rights)
   'confidence 0.97
   'jurisdiction "za"
   'protections '(court-supervision removal-of-trustee 
               damages-for-breach accounting-order
               setting-aside-transactions)
   'grounds-for-removal '(breach-of-duty conflict-of-interest 
                         incapacity loss-of-confidence
                         abuse-of-powers)
   'case-application "Jax (beneficiary) can seek Peter's removal as trustee (Faucitt case)"
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 2.2 Trust Distribution Rights
;; -----------------------------------------------------------------------------

(define trust-distribution-authority
  (make-principle
   'name 'trust-distribution-authority
   'description "Framework for trustee authority to make distributions to beneficiaries"
   'domain '(trust beneficiary-rights)
   'confidence 0.96
   'jurisdiction "za"
   'authority-source "Trust deed provisions"
   'types '(mandatory-distributions discretionary-distributions 
           income-distributions capital-distributions)
   'limitations '(trust-deed-restrictions solvency-requirements 
                 beneficiary-entitlement proper-purpose)
   'case-application "R500K payment to Jax as trust distribution (Faucitt case)"
   'inference-type 'deductive))

(define beneficiary-entitlement-test
  (make-principle
   'name 'beneficiary-entitlement-test
   'description "Test for whether beneficiary is entitled to trust distribution"
   'domain '(trust beneficiary-rights)
   'confidence 0.95
   'jurisdiction "za"
   'test-factors '(trust-deed-provisions beneficiary-class 
                  discretionary-vs-mandatory trustee-discretion
                  conditions-satisfied)
   'trustee-discretion "Trustee discretion must be exercised reasonably and in good faith"
   'abuse-of-discretion '(arbitrary-decision personal-animosity 
                         improper-purpose failure-to-consider)
   'inference-type 'deductive))

(define trustee-discretion-limits
  (make-principle
   'name 'trustee-discretion-limits
   'description "Limits on trustee discretion in making distributions"
   'domain '(trust beneficiary-rights)
   'confidence 0.95
   'jurisdiction "za"
   'limits '(must-act-reasonably must-act-in-good-faith 
          must-consider-relevant-factors must-not-consider-irrelevant-factors
          must-not-act-arbitrarily must-not-act-from-personal-animosity)
   'reviewability "Court can review abuse of discretion"
   'case-application "Peter's discretion as trustee limited by duty to Jax (beneficiary)"
   'inference-type 'deductive))

;; =============================================================================
;; PART 3: TRUST ASSET MANAGEMENT
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 3.1 Trust Asset Identification and Protection
;; -----------------------------------------------------------------------------

(define trust-asset-identification
  (make-principle
   'name 'trust-asset-identification
   'description "Framework for identifying what constitutes trust property"
   'domain '(trust property)
   'confidence 0.96
   'jurisdiction "za"
   'statutory-basis "Trust Property Control Act 57 of 1988"
   'trust-property-includes '(property-transferred-to-trust 
                             property-acquired-by-trust
                             income-and-proceeds
                             property-held-for-beneficiaries)
   'not-trust-property '(trustee-personal-property 
                        property-not-transferred-to-trust
                        property-acquired-with-non-trust-funds)
   'inference-type 'deductive))

(define trust-asset-abandonment-indicators
  (make-principle
   'name 'trust-asset-abandonment-indicators
   'description "Indicators that trustee has abandoned or failed to fund trust asset"
   'domain '(trust property)
   'confidence 0.92
   'jurisdiction "za"
   'indicators '(trustee-never-funded-asset 
                third-party-funded-asset-instead
                trustee-failed-to-maintain-asset
                trustee-relinquished-control
                long-period-of-non-involvement)
   'case-application "Peter (trustee) never funded RWD, Dan funded it instead (Faucitt case)"
   'inference "If trustee abandons asset, beneficial ownership may shift"
   'legal-consequences '(loss-of-trust-property-status 
                        beneficial-ownership-by-funder
                        trustee-breach-of-duty)
   'inference-type 'inductive))

(define beneficial-ownership-by-funding
  (make-principle
   'name 'beneficial-ownership-by-funding
   'description "Continuous funding without reimbursement may create beneficial ownership"
   'domain '(trust property)
   'confidence 0.90
   'jurisdiction "za"
   'principle "Person who continuously funds asset without reimbursement may acquire beneficial interest"
   'factors '(continuous-funding no-reimbursement 
           expectation-of-ownership trustee-abandonment
           funder-control-and-management)
   'case-application "Dan funded RWD platform for 28 months without reimbursement (Faucitt case)"
   'inference "Dan may have beneficial ownership of platform/RWD"
   'related-principles '(trust-asset-abandonment-indicators unjust-enrichment)
   'inference-type 'inductive))

(define trust-property-relinquishment
  (make-principle
   'name 'trust-property-relinquishment
   'description "Trustee can relinquish trust property through conduct"
   'domain '(trust property)
   'confidence 0.91
   'jurisdiction "za"
   'relinquishment-by '(express-disclaimer conduct-indicating-abandonment 
                       failure-to-fund failure-to-maintain
                       allowing-third-party-control)
   'consequences "Property may cease to be trust property"
   'case-application "Peter's failure to fund RWD may constitute relinquishment (Faucitt case)"
   'inference-type 'inductive))

;; -----------------------------------------------------------------------------
;; 3.2 Trust Investment and Management
;; -----------------------------------------------------------------------------

(define trustee-investment-duty
  (make-principle
   'name 'trustee-investment-duty
   'description "Trustee duty to invest trust property prudently"
   'domain '(trust fiduciary)
   'confidence 0.96
   'jurisdiction "za"
   'statutory-basis "Trust Property Control Act 57 of 1988"
   'standard "Prudent investor standard"
   'requirements '(diversification risk-management 
                  preservation-of-capital income-generation
                  consideration-of-beneficiary-needs)
   'prohibited '(speculation reckless-investment 
                self-dealing unauthorized-investments)
   'inference-type 'deductive))

;; =============================================================================
;; PART 4: TRUST STRUCTURE AND OPERATION
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 4.1 Trust vs. Other Structures
;; -----------------------------------------------------------------------------

(define trust-operation-indicators
  (make-principle
   'name 'trust-operation-indicators
   'description "Indicators that entity operates as trust rather than company"
   'domain '(trust corporate)
   'confidence 0.91
   'jurisdiction "za"
   'trust-indicators '(trustee-beneficiary-structure 
                      trust-deed-exists
                      fiduciary-administration
                      beneficiary-entitlements
                      trust-property-separate-from-trustee)
   'company-indicators '(shareholders-directors-structure 
                        memorandum-of-incorporation
                        profit-motive
                        shareholder-dividends
                        company-property-owned-by-company)
   'case-application "Is RWD operating as trust or company? (Faucitt case)"
   'inference-type 'inductive))

(define trust-vs-appropriation-test
  (make-principle
   'name 'trust-vs-appropriation-test
   'description "Test for whether entity operates as trust or personal appropriation"
   'domain '(trust)
   'confidence 0.90
   'jurisdiction "za"
   'test-factors '(separate-property fiduciary-administration 
                  beneficiary-rights trustee-accountability
                  trust-deed-compliance)
   'appropriation-indicators '(personal-use-of-property 
                              no-beneficiary-accountability
                              no-trust-administration
                              commingling-with-personal-assets)
   'case-application "RWD structure analysis (Faucitt case)"
   'inference-type 'inductive))

(define trust-structure-consistency-requirement
  (make-principle
   'name 'trust-structure-consistency-requirement
   'description "Trust must be operated consistently with trust structure"
   'domain '(trust)
   'confidence 0.94
   'jurisdiction "za"
   'requirements '(follow-trust-deed maintain-trust-property 
                  administer-for-beneficiaries keep-accounts
                  separate-from-trustee-personal-affairs)
   'inconsistency-indicators '(commingling-assets personal-use 
                              no-accounting failure-to-fund
                              treating-as-personal-property)
   'consequences-of-inconsistency '(trust-invalid personal-liability 
                                   tax-consequences loss-of-trust-status)
   'inference-type 'deductive))

;; =============================================================================
;; PART 5: TRUST LITIGATION AND REMEDIES
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 5.1 Trustee Removal
;; -----------------------------------------------------------------------------

(define trustee-removal-grounds
  (make-principle
   'name 'trustee-removal-grounds
   'description "Grounds for court to remove trustee"
   'domain '(trust remedies)
   'confidence 0.96
   'jurisdiction "za"
   'statutory-basis "Trust Property Control Act 57 of 1988, s20"
   'grounds '(breach-of-trust breach-of-fiduciary-duty 
             conflict-of-interest incapacity
             failure-to-account abuse-of-powers
             loss-of-confidence hostility-to-beneficiaries)
   'case-application "Jax can seek Peter's removal for conflict of interest (Faucitt case)"
   'standard "Best interests of trust and beneficiaries"
   'inference-type 'deductive))

(define trust-litigation-restrictions
  (make-principle
   'name 'trust-litigation-restrictions
   'description "Restrictions on trustee bringing litigation against beneficiaries"
   'domain '(trust procedural)
   'confidence 0.93
   'jurisdiction "za"
   'principle "Trustee generally cannot sue beneficiary in trustee capacity"
   'exceptions '(beneficiary-breach-of-trust-deed 
                beneficiary-fraud-against-trust
                beneficiary-claiming-beyond-entitlement
                recovering-trust-property-from-beneficiary)
   'case-application "Peter (trustee) suing Jax (beneficiary) raises conflict issues (Faucitt case)"
   'inference "If trustee sues beneficiary, suggests conflict of interest"
   'related-principles '(trustee-conflict-prohibition beneficiary-adverse-action-prohibition)
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 5.2 Beneficiary Remedies
;; -----------------------------------------------------------------------------

(define beneficiary-remedies-against-trustee
  (make-principle
   'name 'beneficiary-remedies-against-trustee
   'description "Remedies available to beneficiary against trustee for breach"
   'domain '(trust remedies)
   'confidence 0.96
   'jurisdiction "za"
   'remedies '(removal-of-trustee accounting-order 
              damages-for-breach setting-aside-transactions
              constructive-trust surcharge
              personal-liability-order)
   'case-application "Jax's available remedies against Peter (Faucitt case)"
   'inference-type 'deductive))

(define trust-accounting-order
  (make-principle
   'name 'trust-accounting-order
   'description "Court order requiring trustee to provide full accounting"
   'domain '(trust remedies)
   'confidence 0.96
   'jurisdiction "za"
   'grounds '(beneficiary-request trustee-refusal 
           suspicion-of-breach lack-of-transparency)
   'scope "Full accounting of all trust property, income, and transactions"
   'consequences-of-non-compliance "Removal, contempt, adverse inference"
   'inference-type 'deductive))

;; =============================================================================
;; PART 6: CASE-SPECIFIC INFERENCE RULES
;; =============================================================================

(define faucitt-trustee-conflict-inference
  (make-inference-rule
   'name 'faucitt-trustee-conflict-inference
   'description "Inference rule for Peter's trustee conflict of interest (Faucitt case)"
   'fact-pattern '(peter-is-trustee 
                  jax-is-beneficiary
                  peter-seeks-interdict-against-jax
                  peter-has-absolute-trust-powers
                  peter-bypasses-trust-powers-for-court-relief)
   'inference-chain '(
     (fact peter-trustee-jax-beneficiary)
     (principle trustee-conflict-prohibition)
     (inference conflict-of-interest-exists)
     
     (fact peter-seeks-interdict-against-jax)
     (principle beneficiary-adverse-action-prohibition)
     (inference breach-of-fiduciary-duty)
     
     (fact peter-has-absolute-powers-but-seeks-court-relief)
     (principle trust-power-abuse-test)
     (inference abuse-of-trust-powers-indicated)
     
     (fact bypassing-available-trust-powers)
     (principle ulterior-motive-analysis)
     (inference ulterior-motive-indicated)
     
     (fact trustee-acting-adversely-to-beneficiary)
     (principle trustee-removal-grounds)
     (inference grounds-for-removal-exist))
   'confidence 0.89
   'conclusion "Peter's conduct as trustee breaches fiduciary duty and indicates conflict of interest"
   'legal-consequences '(breach-of-fiduciary-duty 
                        grounds-for-removal
                        abuse-of-trust-powers
                        ulterior-motive-indicated)))

(define faucitt-trust-asset-abandonment-inference
  (make-inference-rule
   'name 'faucitt-trust-asset-abandonment-inference
   'description "Inference rule for RWD trust asset abandonment (Faucitt case)"
   'fact-pattern '(rwd-claimed-as-trust-asset 
                  peter-trustee-never-funded-rwd
                  dan-funded-rwd-for-28-months
                  dan-paid-r140k-to-r280k
                  no-reimbursement-to-dan
                  peter-failed-to-maintain-rwd)
   'inference-chain '(
     (fact peter-never-funded-rwd)
     (principle trust-asset-abandonment-indicators)
     (inference abandonment-indicated)
     
     (fact dan-funded-rwd-continuously)
     (principle beneficial-ownership-by-funding)
     (inference dan-may-have-beneficial-ownership)
     
     (fact no-reimbursement-for-28-months)
     (principle unjust-enrichment)
     (inference unjust-enrichment-if-rwd-keeps-benefit)
     
     (fact peter-failed-to-maintain)
     (principle trust-property-preservation-duty)
     (inference breach-of-trustee-duty)
     
     (fact dan-funded-not-trust)
     (principle trust-property-relinquishment)
     (inference rwd-may-not-be-trust-property))
   'confidence 0.86
   'conclusion "RWD may not be trust property due to abandonment and Dan's funding"
   'legal-consequences '(loss-of-trust-property-status 
                        beneficial-ownership-by-dan
                        unjust-enrichment-claim-viable
                        breach-of-trustee-duty)))

(define faucitt-r500k-payment-inference
  (make-inference-rule
   'name 'faucitt-r500k-payment-inference
   'description "Inference rule for R500K payment to Jax (Faucitt case)"
   'fact-pattern '(r500k-paid-to-jax 
                  jax-is-beneficiary
                  peter-is-trustee
                  peter-objects-to-payment
                  payment-from-trust-or-company)
   'inference-chain '(
     (fact jax-is-beneficiary)
     (principle beneficiary-entitlement-test)
     (inference jax-may-be-entitled-to-distribution)
     
     (fact peter-is-trustee-with-discretion)
     (principle trustee-discretion-limits)
     (inference discretion-must-be-exercised-reasonably)
     
     (fact peter-objects-after-payment)
     (principle timing-analysis-bad-faith)
     (inference timing-suggests-bad-faith)
     
     (fact payment-to-beneficiary)
     (principle trust-distribution-authority)
     (inference payment-may-be-legitimate-distribution)
     
     (fact peter-has-conflict-of-interest)
     (principle trustee-conflict-prohibition)
     (inference peter-objection-tainted-by-conflict))
   'confidence 0.85
   'conclusion "R500K payment may be legitimate trust distribution or director loan repayment"
   'legal-consequences '(payment-potentially-valid 
                        peter-objection-tainted-by-conflict
                        beneficiary-entitlement-defense)))

;; =============================================================================
;; PART 7: HELPER FUNCTIONS FOR CASE APPLICATION
;; =============================================================================

(define (trustee-duty-breach? trustee action)
  "Determine if trustee action constitutes breach of duty"
  (or (not (good-faith? action))
      (not (beneficiary-interests? action))
      (conflict-of-interest? trustee action)
      (improper-purpose? action)
      (abuse-of-trust-powers? trustee action)))

(define (trustee-conflict-exists? trustee action beneficiary)
  "Determine if trustee has conflict of interest"
  (or (personal-interest-in-action? trustee action)
      (action-adverse-to-beneficiary? action beneficiary)
      (personal-benefit-from-action? trustee action)
      (competing-loyalties? trustee action)))

(define (trust-asset-abandoned? trustee asset)
  "Determine if trustee has abandoned trust asset"
  (and (never-funded? trustee asset)
       (or (third-party-funded? asset)
           (failed-to-maintain? trustee asset)
           (relinquished-control? trustee asset))))

(define (beneficiary-entitled-to-distribution? beneficiary amount trust-deed)
  "Determine if beneficiary entitled to distribution"
  (and (is-beneficiary? beneficiary trust-deed)
       (or (mandatory-distribution? amount trust-deed)
           (discretionary-distribution-reasonable? amount trust-deed))
       (conditions-satisfied? beneficiary trust-deed)))

;; =============================================================================
;; VALIDATION AND TESTING
;; =============================================================================

(define (validate-trust-law-framework)
  "Validate that all trust law principles properly derive from Level 1"
  (and (validate-derivation trustee-fiduciary-duty-comprehensive)
       (validate-derivation trustee-duty-of-loyalty)
       ;; Add more validations as needed
       #t))

;; Run validation
(validate-trust-law-framework)

;; =============================================================================
;; END OF SOUTH AFRICAN TRUST LAW (ENHANCED)
;; =============================================================================

