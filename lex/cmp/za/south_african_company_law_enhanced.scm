;; South African Company Law - Enhanced for Case 2025-137857
;; Companies Act 71 of 2008 - Director Duties, Corporate Governance, Self-Dealing
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
   'name "South African Company Law (Enhanced)"
   'jurisdiction "za"
   'legal-domain '(company corporate-governance)
   'version "2.0"
   'last-updated "2025-10-27"
   'derived-from-level 1
   'confidence-base 0.95
   'statutory-basis "Companies Act 71 of 2008"
   'language "en"
   'case-specific-enhancements "Faucitt v. Faucitt (2025-137857)"))

;; =============================================================================
;; PART 1: DIRECTOR FIDUCIARY DUTIES (Section 76, Companies Act)
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 1.1 General Fiduciary Duty Framework
;; -----------------------------------------------------------------------------

(define director-fiduciary-duty
  (derive-from-principles
   'name 'director-fiduciary-duty
   'base-principles (list bona-fides fiduciary-duty)
   'inference-type 'deductive
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s76(3)"
   'description "Director must act in good faith and in the best interests of the company"
   'confidence 0.98
   'elements '(good-faith best-interests-of-company proper-purpose)
   'related-principles '(duty-of-care duty-of-skill conflict-of-interest)))

(define director-duty-of-care
  (derive-from-principles
   'name 'director-duty-of-care
   'base-principles (list duty-of-care professional-standard)
   'inference-type 'deductive
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s76(3)(c)"
   'description "Director must exercise care, skill and diligence reasonably expected of person with their knowledge and experience"
   'confidence 0.98
   'standard "Reasonable director in similar circumstances"
   'factors '(knowledge experience position responsibilities)))

(define proper-purpose-test
  (derive-from-principles
   'name 'proper-purpose-test
   'base-principles (list bona-fides fiduciary-duty)
   'inference-type 'deductive
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s76(3)(a)"
   'description "Director must exercise powers for proper purpose, not ulterior motive"
   'confidence 0.97
   'test-elements '(identify-power identify-purpose assess-legitimacy assess-dominant-purpose)
   'breach-indicators '(timing-suspicious coordination-with-other-events disproportionate-response personal-benefit)))

;; -----------------------------------------------------------------------------
;; 1.2 Collective Action Requirements
;; -----------------------------------------------------------------------------

(define director-collective-action-requirement
  (make-principle
   'name 'director-collective-action-requirement
   'description "Directors must act collectively through board resolutions for significant decisions"
   'domain '(company corporate-governance)
   'confidence 0.96
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s66 (Board authority)"
   'provenance "Common law principle of collective board authority"
   'related-principles '(board-resolution-necessity audi-alteram-partem)
   'inference-type 'deductive
   'application-context "Significant corporate decisions requiring board approval"
   'exceptions '(emergency-action delegated-authority routine-operational-matters)))

(define board-resolution-necessity
  (make-principle
   'name 'board-resolution-necessity
   'description "Board resolution required for significant corporate actions"
   'domain '(company corporate-governance)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s66"
   'requiring-resolution '(major-contracts capital-expenditure director-appointments 
                          financial-authorizations policy-changes related-party-transactions)
   'not-requiring-resolution '(routine-operations delegated-matters emergency-actions)
   'inference-type 'deductive))

(define unilateral-action-prohibition
  (make-principle
   'name 'unilateral-action-prohibition
   'description "Individual director cannot take significant corporate action without board authority"
   'domain '(company corporate-governance)
   'confidence 0.96
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s66"
   'breach-consequences '(action-voidable personal-liability breach-of-duty)
   'exceptions '(emergency-action express-delegation routine-operations)
   'case-application "Card cancellation without board resolution (Faucitt case)"
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 1.3 Conflict of Interest and Self-Dealing
;; -----------------------------------------------------------------------------

(define director-conflict-of-interest
  (derive-from-principles
   'name 'director-conflict-of-interest
   'base-principles (list nemo-iudex-in-causa-sua conflict-of-interest)
   'inference-type 'deductive
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s75"
   'description "Director must avoid conflicts between personal interests and company interests"
   'confidence 0.98
   'disclosure-duty "Must disclose any personal financial interest"
   'recusal-requirement "Must recuse from decision if conflicted"
   'related-principles '(director-self-dealing-prohibition interested-director-transaction-rules)))

(define director-self-dealing-prohibition
  (make-principle
   'name 'director-self-dealing-prohibition
   'description "Director cannot profit personally from position or engage in self-dealing transactions"
   'domain '(company corporate-governance fiduciary)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s75, s76(2)(a)"
   'provenance "Common law fiduciary duty"
   'related-principles '(nemo-iudex-in-causa-sua conflict-of-interest)
   'inference-type 'deductive
   'application-context "Director transacting with company or related entities"
   'requirements '(full-disclosure independent-approval fair-value arm's-length-terms)
   'case-application "Villa Via rent charges (Peter owns 50% RST, 50% Villa Via)"
   'breach-consequences '(transaction-voidable account-for-profits damages personal-liability)))

(define related-party-transaction-disclosure
  (make-principle
   'name 'related-party-transaction-disclosure
   'description "Related party transactions require full disclosure and independent approval"
   'domain '(company corporate-governance)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s75"
   'disclosure-requirements '(nature-of-interest extent-of-interest financial-terms timing-of-disclosure)
   'approval-requirements '(independent-directors shareholder-approval if-material)
   'fairness-test "Transaction must be on arm's length terms"
   'inference-type 'deductive))

(define interested-director-transaction-rules
  (make-principle
   'name 'interested-director-transaction-rules
   'description "Specific rules for transactions where director has personal interest"
   'domain '(company corporate-governance)
   'confidence 0.96
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s75"
   'procedure '(disclose-interest recuse-from-vote obtain-independent-approval document-fairness)
   'voidability "Transaction voidable if rules not followed"
   'inference-type 'deductive))

(define arm's-length-transaction-requirement
  (make-principle
   'name 'arm's-length-transaction-requirement
   'description "Related party transactions must be on arm's length commercial terms"
   'domain '(company corporate-governance)
   'confidence 0.96
   'jurisdiction "za"
   'test-factors '(market-price commercial-terms independent-negotiation comparable-transactions)
   'burden-of-proof "Interested party must prove arm's length nature"
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 1.4 Corporate Opportunity Doctrine
;; -----------------------------------------------------------------------------

(define corporate-opportunity-doctrine
  (make-principle
   'name 'corporate-opportunity-doctrine
   'description "Director cannot usurp corporate opportunities for personal benefit"
   'domain '(company fiduciary)
   'confidence 0.96
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s76(2)(a)"
   'provenance "Common law fiduciary duty"
   'test-elements '(opportunity-in-line-of-business company-interest-or-expectancy 
                   director-learned-in-capacity personal-exploitation)
   'defenses '(company-declined-opportunity full-disclosure-and-approval financial-inability)
   'remedies '(account-for-profits constructive-trust damages)
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 1.5 Business Judgment Rule
;; -----------------------------------------------------------------------------

(define business-judgment-rule
  (make-principle
   'name 'business-judgment-rule
   'description "Directors protected for good faith business decisions even if outcome is poor"
   'domain '(company corporate-governance)
   'confidence 0.95
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s76(4)"
   'provenance "Common law principle, codified in Act"
   'protection-requirements '(good-faith informed-decision no-conflict-of-interest 
                             rational-basis within-authority)
   'no-protection-for '(fraud gross-negligence conflict-of-interest ultra-vires-acts)
   'burden-of-proof "Challenger must rebut presumption of good faith"
   'inference-type 'deductive))

(define rational-basis-test
  (make-principle
   'name 'rational-basis-test
   'description "Business decision must have rational basis, not necessarily optimal"
   'domain '(company corporate-governance)
   'confidence 0.94
   'jurisdiction "za"
   'standard "Would a reasonable director in similar circumstances make this decision?"
   'not-required '(best-decision optimal-outcome perfect-information)
   'required '(reasonable-information reasonable-deliberation rational-connection)
   'inference-type 'deductive))

(define good-faith-presumption
  (make-principle
   'name 'good-faith-presumption
   'description "Directors presumed to act in good faith unless proven otherwise"
   'domain '(company corporate-governance)
   'confidence 0.95
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s76(4)"
   'rebuttable-by '(conflict-of-interest improper-purpose fraud gross-negligence)
   'burden-of-proof "Challenger must prove bad faith"
   'inference-type 'deductive))

;; =============================================================================
;; PART 2: PAYMENT AUTHORIZATION AND CORPORATE AUTHORITY
;; =============================================================================

(define director-signatory-authority
  (make-principle
   'name 'director-signatory-authority
   'description "Director signatory authority must be properly authorized and within limits"
   'domain '(company corporate-governance)
   'confidence 0.96
   'jurisdiction "za"
   'authorization-sources '(board-resolution moi-provisions banking-resolution)
   'limits '(amount-limits transaction-types co-signatory-requirements)
   'case-application "R500K payment authorization dispute (Faucitt case)"
   'inference-type 'deductive))

(define payment-authorization-rules
  (make-principle
   'name 'payment-authorization-rules
   'description "Corporate payments must follow authorization hierarchy"
   'domain '(company corporate-governance)
   'confidence 0.96
   'jurisdiction "za"
   'hierarchy '(routine-operational-payments delegated-authority-payments 
               board-approval-required-payments shareholder-approval-required-payments)
   'factors '(amount materiality related-party routine-vs-exceptional)
   'inference-type 'deductive))

(define corporate-authority-hierarchy
  (make-principle
   'name 'corporate-authority-hierarchy
   'description "Corporate authority flows from shareholders to board to management"
   'domain '(company corporate-governance)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s66"
   'hierarchy '(shareholders-ultimate-authority board-manages-company 
               management-executes-board-decisions)
   'delegation-rules "Board can delegate but remains responsible"
   'inference-type 'deductive))

;; =============================================================================
;; PART 3: SHAREHOLDER RIGHTS AND REMEDIES
;; =============================================================================

(define shareholder-oppression-test
  (make-principle
   'name 'shareholder-oppression-test
   'description "Test for oppressive conduct against minority shareholders"
   'domain '(company shareholder-rights)
   'confidence 0.96
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s163"
   'test-elements '(conduct-oppressive-or-unfairly-prejudicial 
                   disregard-of-shareholder-interests
                   reasonable-expectations-defeated)
   'examples '(exclusion-from-management dividend-withholding 
              asset-stripping related-party-abuse)
   'remedies '(buy-out-order regulation-of-conduct appointment-of-director winding-up)
   'inference-type 'deductive))

(define unfair-prejudice-remedy
  (make-principle
   'name 'unfair-prejudice-remedy
   'description "Remedy for conduct unfairly prejudicial to shareholders"
   'domain '(company shareholder-rights)
   'confidence 0.96
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s163"
   'prejudice-examples '(financial-loss loss-of-control breach-of-agreement 
                        exclusion-from-benefits)
   'unfairness-factors '(legitimate-expectations breach-of-understanding 
                        lack-of-good-faith disproportionate-impact)
   'available-remedies '(restraining-order rectification-order buy-out 
                        appointment-of-director winding-up)
   'inference-type 'deductive))

(define shareholder-rights-comprehensive
  (make-principle
   'name 'shareholder-rights-comprehensive
   'description "Comprehensive framework of shareholder rights under Companies Act"
   'domain '(company shareholder-rights)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, various sections"
   'rights '(voting-rights dividend-rights information-rights 
            meeting-rights disposal-rights pre-emptive-rights 
            derivative-action-rights oppression-remedy-rights)
   'protection-mechanisms '(fiduciary-duties disclosure-requirements 
                           approval-requirements court-remedies)
   'inference-type 'deductive))

(define shareholder-dividend-rights
  (make-principle
   'name 'shareholder-dividend-rights
   'description "Shareholder rights to receive dividends when declared"
   'domain '(company shareholder-rights)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s46"
   'no-automatic-right "No automatic right to dividend, board discretion"
   'solvency-and-liquidity-test "Dividend only if company passes s&l test"
   'equal-treatment "Shareholders of same class treated equally"
   'abuse-indicators '(systematic-withholding preferential-treatment 
                      alternative-extraction-mechanisms)
   'inference-type 'deductive))

(define director-loan-account-rules
  (make-principle
   'name 'director-loan-account-rules
   'description "Rules governing director loan accounts and repayments"
   'domain '(company corporate-governance)
   'confidence 0.95
   'jurisdiction "za"
   'nature "Director loan account is debt owed by company to director"
   'repayment-authorization '(board-resolution solvency-and-liquidity-test proper-documentation)
   'tax-implications "Interest may be imputed if interest-free"
   'case-application "R500K payment as director loan repayment (Faucitt case)"
   'inference-type 'deductive))

;; =============================================================================
;; PART 4: BAD FAITH AND ABUSE OF PROCESS INDICATORS
;; =============================================================================

(define bad-faith-indicators-comprehensive
  (make-principle
   'name 'bad-faith-indicators-comprehensive
   'description "Comprehensive framework for identifying bad faith conduct by directors"
   'domain '(company corporate-governance procedural)
   'confidence 0.94
   'jurisdiction "za"
   'indicators '(timing-suspicious coordination-with-other-events 
                disproportionate-response personal-benefit 
                manufactured-crisis bypassing-internal-processes 
                inconsistent-with-past-practice obstruction-of-others)
   'case-application "Peter's card cancellation timing (Faucitt case)"
   'inference-type 'inductive
   'weight "Multiple indicators strengthen inference of bad faith"
   'rebuttal "Good faith presumption can be rebutted by evidence"
   'related-principles '(bona-fides proper-purpose-test venire-contra-factum-proprium)))

(define timing-analysis-bad-faith
  (make-principle
   'name 'timing-analysis-bad-faith
   'description "Suspicious timing can indicate bad faith or improper purpose"
   'domain '(company procedural)
   'confidence 0.92
   'jurisdiction "za"
   'suspicious-patterns '(immediate-retaliation-after-cooperation 
                         coordination-with-settlement-negotiation
                         action-before-internal-resolution
                         creating-crisis-before-deadline)
   'case-application "Card cancellation day after Dan provided reports (Faucitt case)"
   'inference-type 'inductive
   'evidential-weight "Strong indicator when combined with other factors"
   'related-principles '(proper-purpose-test bad-faith-indicators)))

(define manufactured-crisis-indicators
  (make-principle
   'name 'manufactured-crisis-indicators
   'description "Indicators that a crisis was manufactured rather than genuine"
   'domain '(company procedural)
   'confidence 0.91
   'jurisdiction "za"
   'indicators '(actor-created-problem-complained-about 
                disproportionate-response-to-problem
                no-attempt-at-internal-resolution
                timing-coordinated-with-other-objectives
                problem-serves-actor-interests)
   'case-application "Peter cancelled cards, then complained about missing documentation (Faucitt case)"
   'inference-type 'inductive
   'legal-consequence "Undermines credibility and good faith presumption"
   'related-principles '(venire-contra-factum-proprium bad-faith-indicators)))

(define obstruction-of-documentation-indicators
  (make-principle
   'name 'obstruction-of-documentation-indicators
   'description "Indicators that documentation access was deliberately obstructed"
   'domain '(company procedural evidence)
   'confidence 0.90
   'jurisdiction "za"
   'indicators '(action-makes-documentation-inaccessible 
                actor-knew-or-should-have-known-consequences
                no-alternative-arrangements-made
                actor-then-complains-about-missing-documentation
                timing-suggests-deliberate-obstruction)
   'case-application "Card cancellation → service suspension → documentation inaccessibility (Faucitt case)"
   'inference-type 'inductive
   'legal-consequence "Adverse inference against obstructing party"
   'related-principles '(venire-contra-factum-proprium spoliation-inference)))

;; =============================================================================
;; PART 5: INTER-COMPANY TRANSACTIONS
;; =============================================================================

(define inter-company-transaction-rules
  (make-principle
   'name 'inter-company-transaction-rules
   'description "Rules governing transactions between related companies"
   'domain '(company corporate-governance)
   'confidence 0.95
   'jurisdiction "za"
   'requirements '(arm's-length-pricing proper-documentation 
                  business-purpose conflict-disclosure)
   'scrutiny-factors '(common-ownership common-directors 
                      financial-dependence control-relationship)
   'abuse-indicators '(circular-transactions value-extraction 
                      artificial-pricing loss-manufacturing)
   'inference-type 'deductive))

(define transfer-pricing-abuse-indicators
  (make-principle
   'name 'transfer-pricing-abuse-indicators
   'description "Indicators of abusive transfer pricing between related entities"
   'domain '(company tax)
   'confidence 0.92
   'jurisdiction "za"
   'indicators '(non-arm's-length-pricing systematic-profit-shifting 
                artificial-loss-creation lack-of-business-substance
                circular-transactions)
   'case-application "SLG R5.4M manufactured loss (Faucitt case)"
   'inference-type 'inductive
   'consequences '(tax-adjustment transaction-recharacterization 
                  director-liability-for-reckless-trading)
   'related-principles '(arm's-length-transaction-requirement substance-over-form)))

(define excessive-profit-extraction-test
  (make-principle
   'name 'excessive-profit-extraction-test
   'description "Test for whether profit extraction from company is excessive"
   'domain '(company shareholder-rights)
   'confidence 0.91
   'jurisdiction "za"
   'test-factors '(profit-margin-comparison market-rate-comparison 
                  business-justification shareholder-impact
                  alternative-mechanisms-available)
   'case-application "Villa Via 86% profit margin on rent (Faucitt case)"
   'inference-type 'inductive
   'relevance-to '(shareholder-oppression unfair-prejudice self-dealing)
   'related-principles '(fairness-test arm's-length-transaction-requirement)))

(define fair-value-transaction-requirement
  (make-principle
   'name 'fair-value-transaction-requirement
   'description "Related party transactions must be at fair value"
   'domain '(company corporate-governance)
   'confidence 0.95
   'jurisdiction "za"
   'fair-value-determination '(market-comparison independent-valuation 
                               arm's-length-negotiation comparable-transactions)
   'burden-of-proof "Interested party must prove fair value"
   'consequences-of-unfair-value '(transaction-voidable account-for-excess 
                                   breach-of-fiduciary-duty)
   'inference-type 'deductive))

;; =============================================================================
;; PART 6: ACCOUNTING AND FINANCIAL REPORTING
;; =============================================================================

(define accounting-fraud-indicators
  (make-principle
   'name 'accounting-fraud-indicators
   'description "Indicators of fraudulent accounting or financial manipulation"
   'domain '(company accounting)
   'confidence 0.90
   'jurisdiction "za"
   'indicators '(artificial-loss-creation revenue-recognition-manipulation 
                inventory-valuation-irregularities circular-transactions
                lack-of-supporting-documentation timing-of-adjustments)
   'case-application "SLG R5.4M loss, R5.2M inventory adjustment (Faucitt case)"
   'inference-type 'inductive
   'consequences '(financial-statement-restatement director-liability 
                  criminal-prosecution civil-damages)
   'related-principles '(substance-over-form bona-fides)))

(define inventory-valuation-rules
  (make-principle
   'name 'inventory-valuation-rules
   'description "Rules for proper inventory valuation and write-offs"
   'domain '(company accounting)
   'confidence 0.94
   'jurisdiction "za"
   'statutory-basis "IFRS, Companies Act 71 of 2008"
   'valuation-methods '(lower-of-cost-or-net-realizable-value)
   'write-off-requirements '(genuine-obsolescence damage-or-deterioration 
                            market-value-decline proper-documentation)
   'abuse-indicators '(large-sudden-write-offs lack-of-documentation 
                      timing-suspicious related-party-involvement)
   'inference-type 'deductive))

(define write-off-reasonableness-test
  (make-principle
   'name 'write-off-reasonableness-test
   'description "Test for whether inventory or asset write-off is reasonable"
   'domain '(company accounting)
   'confidence 0.92
   'jurisdiction "za"
   'test-factors '(supporting-documentation business-justification 
                  independent-valuation timing-explanation
                  consistency-with-past-practice)
   'case-application "SLG R5.2M inventory adjustment (Faucitt case)"
   'inference-type 'inductive
   'red-flags '(no-documentation timing-suspicious amount-material 
               related-party-benefit)
   'related-principles '(substance-over-form accounting-fraud-indicators)))

;; =============================================================================
;; PART 7: BUSINESS SUBSTANCE AND SHAM TRANSACTIONS
;; =============================================================================

(define business-substance-test
  (make-principle
   'name 'business-substance-test
   'description "Test for whether entity or transaction has genuine business substance"
   'domain '(company tax)
   'confidence 0.93
   'jurisdiction "za"
   'test-factors '(commercial-purpose economic-reality 
                  operational-capacity assets-and-resources
                  independent-decision-making)
   'case-application "RWD has no stock, no inventory, no assets (Faucitt case)"
   'inference-type 'inductive
   'consequences-of-no-substance '(transaction-recharacterization 
                                   tax-adjustment sham-finding)
   'related-principles '(substance-over-form revenue-source-verification)))

(define revenue-source-verification
  (make-principle
   'name 'revenue-source-verification
   'description "Verification that entity has legitimate capacity to generate claimed revenue"
   'domain '(company accounting)
   'confidence 0.93
   'jurisdiction "za"
   'verification-factors '(assets-to-generate-revenue operational-capacity 
                          customer-relationships business-infrastructure
                          value-creation-mechanism)
   'case-application "RWD revenue legitimacy (no capacity for independent revenue) (Faucitt case)"
   'inference-type 'inductive
   'red-flags '(no-assets no-inventory no-operational-capacity 
               revenue-from-related-parties-only circular-flows)
   'related-principles '(business-substance-test substance-over-form)))

(define sham-transaction-indicators
  (make-principle
   'name 'sham-transaction-indicators
   'description "Indicators that transaction is sham lacking genuine commercial substance"
   'domain '(company tax)
   'confidence 0.91
   'jurisdiction "za"
   'indicators '(no-business-purpose circular-flows 
                artificial-steps no-economic-reality
                form-over-substance tax-avoidance-motive)
   'inference-type 'inductive
   'legal-consequences '(transaction-disregarded tax-adjustment 
                        penalties-for-aggressive-tax-avoidance)
   'related-principles '(substance-over-form business-substance-test)))

;; =============================================================================
;; PART 8: CASE-SPECIFIC INFERENCE RULES
;; =============================================================================

(define faucitt-card-cancellation-inference
  (make-inference-rule
   'name 'faucitt-card-cancellation-inference
   'description "Inference rule for Peter's card cancellation conduct (Faucitt case)"
   'fact-pattern '(dan-provides-reports-june-6 
                  peter-cancels-cards-june-7
                  services-suspend-june-7-14
                  peter-demands-documentation-june-july
                  documentation-inaccessible-due-to-suspension)
   'inference-chain '(
     (fact card-cancellation-day-after-cooperation)
     (principle timing-analysis-bad-faith)
     (inference bad-faith-indicated)
     
     (fact peter-created-documentation-gap)
     (principle manufactured-crisis-indicators)
     (inference manufactured-crisis)
     
     (fact peter-complains-about-gap-he-created)
     (principle venire-contra-factum-proprium)
     (inference estopped-from-relying-on-gap)
     
     (fact unilateral-action-without-board-resolution)
     (principle director-collective-action-requirement)
     (inference breach-of-director-duty))
   'confidence 0.88
   'conclusion "Peter's conduct indicates bad faith, manufactured crisis, and breach of director duties"
   'legal-consequences '(rebuts-good-faith-presumption 
                        adverse-inference
                        breach-of-fiduciary-duty)))

(define faucitt-villa-via-self-dealing-inference
  (make-inference-rule
   'name 'faucitt-villa-via-self-dealing-inference
   'description "Inference rule for Villa Via self-dealing (Faucitt case)"
   'fact-pattern '(peter-owns-50%-rst 
                  peter-owns-50%-villa-via
                  rst-pays-rent-to-villa-via
                  villa-via-86%-profit-margin
                  no-evidence-of-disclosure
                  no-evidence-of-independent-approval)
   'inference-chain '(
     (fact peter-owns-both-entities)
     (principle director-conflict-of-interest)
     (inference conflict-exists)
     
     (fact peter-profits-from-both-sides)
     (principle director-self-dealing-prohibition)
     (inference self-dealing)
     
     (fact 86%-profit-margin)
     (principle excessive-profit-extraction-test)
     (inference excessive-profit-extraction)
     
     (fact no-disclosure-or-approval)
     (principle related-party-transaction-disclosure)
     (inference breach-of-disclosure-duty)
     
     (fact not-arm's-length-terms)
     (principle arm's-length-transaction-requirement)
     (inference breach-of-arm's-length-requirement))
   'confidence 0.90
   'conclusion "Villa Via rent structure constitutes self-dealing and breach of fiduciary duty"
   'legal-consequences '(transaction-voidable 
                        account-for-excess-profits
                        breach-of-fiduciary-duty
                        shareholder-oppression-indicator)))

(define faucitt-rwd-revenue-legitimacy-inference
  (make-inference-rule
   'name 'faucitt-rwd-revenue-legitimacy-inference
   'description "Inference rule for RWD revenue legitimacy (Faucitt case)"
   'fact-pattern '(rwd-no-stock 
                  rwd-no-inventory
                  rwd-no-assets
                  rwd-claims-revenue
                  rwd-uses-dan-platform-without-payment)
   'inference-chain '(
     (fact rwd-no-operational-capacity)
     (principle business-substance-test)
     (inference lacks-business-substance)
     
     (fact rwd-no-capacity-for-independent-revenue)
     (principle revenue-source-verification)
     (inference revenue-legitimacy-questionable)
     
     (fact rwd-uses-platform-owned-by-dan)
     (principle platform-usage-without-payment)
     (inference unjust-enrichment-indicated)
     
     (fact no-assets-to-generate-claimed-revenue)
     (principle sham-transaction-indicators)
     (inference sham-revenue-indicated))
   'confidence 0.87
   'conclusion "RWD lacks business substance and capacity for legitimate independent revenue"
   'legal-consequences '(revenue-recharacterization 
                        unjust-enrichment-claim-viable
                        tax-implications
                        trust-structure-ambiguity)))

;; =============================================================================
;; PART 9: HELPER FUNCTIONS FOR CASE APPLICATION
;; =============================================================================

(define (director-duty-breach? director action)
  "Determine if director action constitutes breach of duty"
  (or (not (good-faith? action))
      (not (best-interests-of-company? action))
      (improper-purpose? action)
      (conflict-of-interest? director action)
      (lacks-care-skill-diligence? director action)))

(define (self-dealing-transaction? director transaction)
  "Determine if transaction constitutes self-dealing"
  (and (director-has-personal-interest? director transaction)
       (or (not (disclosed? director transaction))
           (not (independent-approval? transaction))
           (not (arm's-length-terms? transaction)))))

(define (manufactured-crisis? actor event)
  "Determine if crisis was manufactured by actor"
  (and (actor-created-problem? actor event)
       (actor-complains-about-problem? actor event)
       (timing-suspicious? event)
       (disproportionate-response? actor event)))

(define (business-substance? entity)
  "Determine if entity has genuine business substance"
  (and (has-assets? entity)
       (has-operational-capacity? entity)
       (has-independent-revenue-capacity? entity)
       (commercial-purpose? entity)
       (economic-reality? entity)))

;; =============================================================================
;; VALIDATION AND TESTING
;; =============================================================================

(define (validate-company-law-framework)
  "Validate that all company law principles properly derive from Level 1"
  (and (validate-derivation director-fiduciary-duty)
       (validate-derivation director-duty-of-care)
       (validate-derivation proper-purpose-test)
       (validate-derivation director-conflict-of-interest)
       ;; Add more validations as needed
       #t))

;; Run validation
(validate-company-law-framework)

;; =============================================================================
;; END OF SOUTH AFRICAN COMPANY LAW (ENHANCED)
;; =============================================================================

