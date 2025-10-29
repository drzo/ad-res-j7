;; =============================================================================
;; South African Company Law - Regulatory Compliance (Enhanced)
;; Companies Act 71 of 2008 - EU Regulatory Compliance, Cross-Border Duties
;; =============================================================================
;; Version: 2.1 (Enhanced)
;; Last Updated: 2025-10-29
;; Case-Specific Enhancements: Faucitt v. Faucitt (EU Responsible Person duties)
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
   'name "South African Company Law - Regulatory Compliance (Enhanced)"
   'jurisdiction '("za" "eu")
   'legal-domain '(company regulatory-compliance international-law)
   'version "2.1"
   'last-updated "2025-10-29"
   'derived-from-level 1
   'confidence-base 0.95
   'statutory-basis '("Companies Act 71 of 2008" "EU Regulation 1223/2009")
   'language "en"
   'case-specific-enhancements "Faucitt v. Faucitt - Dan's EU Responsible Person duties"))

;; =============================================================================
;; PART 1: EU RESPONSIBLE PERSON DUTIES
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 1.1 EU Cosmetics Regulation - Responsible Person Framework
;; -----------------------------------------------------------------------------

(define eu-responsible-person-duty
  (make-principle
   'name 'eu-responsible-person-duty
   'description "Duties of EU Responsible Person under Cosmetics Regulation 1223/2009"
   'domain '(regulatory-compliance international-law cosmetics)
   'confidence 0.96
   'jurisdiction "eu"
   'statutory-basis "EU Regulation 1223/2009 on Cosmetic Products, Article 4"
   'provenance "EU law - mandatory compliance for cosmetics market access"
   'mandatory-duties '(product-safety-assessment
                       compliance-documentation
                       adverse-event-reporting
                       market-surveillance-cooperation
                       product-information-file-maintenance
                       labeling-compliance
                       notification-to-cpnp
                       post-market-surveillance)
   'compliance-requirements '(technical-documentation
                             safety-assessor-qualification
                             good-manufacturing-practice
                             traceability-systems
                             recall-procedures)
   'infrastructure-needs '(documentation-management-systems
                          regulatory-monitoring-systems
                          technical-infrastructure
                          qualified-personnel
                          it-systems-for-compliance)
   'case-application "Dan as EU Responsible Person for RegimA products - IT expenses justified by regulatory duties"
   'defense-argument "Compliance costs are necessary and reasonable for mandatory regulatory duties"
   'related-principles '(regulatory-compliance-necessity professional-standard duty-of-care)
   'inference-type 'deductive))

(define regulatory-compliance-cost-reasonableness
  (make-principle
   'name 'regulatory-compliance-cost-reasonableness
   'description "Test for whether regulatory compliance costs are reasonable"
   'domain '(regulatory-compliance company)
   'confidence 0.94
   'jurisdiction '("za" "eu")
   'test-elements '(regulatory-necessity
                   cost-proportionality
                   industry-standards
                   alternative-options-considered
                   business-necessity)
   'factors '(mandatory-vs-voluntary
             penalty-for-non-compliance
             market-access-requirement
             industry-benchmarks
             operational-integration)
   'case-application "R8.85M IT expenses over 18 months for EU compliance (PARA 7.2-7.5)"
   'analysis-framework "Compare to industry standards, assess necessity, evaluate alternatives"
   'burden-of-proof "Challenger must prove costs unreasonable, not merely high"
   'related-principles '(business-judgment-rule rational-basis-test)
   'inference-type 'deductive))

(define regulatory-compliance-necessity
  (make-principle
   'name 'regulatory-compliance-necessity
   'description "Principle that regulatory compliance costs are necessary business expenses"
   'domain '(regulatory-compliance company)
   'confidence 0.97
   'jurisdiction '("za" "eu")
   'principle "Company must comply with applicable regulations to operate legally"
   'necessity-test '(regulation-applies-to-business
                    compliance-required-for-market-access
                    non-compliance-has-severe-consequences
                    no-reasonable-alternative-exists)
   'consequences-of-non-compliance '(market-exclusion
                                    regulatory-penalties
                                    product-recalls
                                    reputational-damage
                                    criminal-liability)
   'case-application "EU Responsible Person duties mandatory for EU market access"
   'defense "Compliance costs cannot be avoided without abandoning EU market"
   'related-principles '(business-necessity operational-necessity)
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 1.2 Cross-Border Director Duties
;; -----------------------------------------------------------------------------

(define cross-border-director-duties
  (make-principle
   'name 'cross-border-director-duties
   'description "Director duties when company operates across multiple jurisdictions"
   'domain '(company corporate-governance international-law)
   'confidence 0.93
   'jurisdiction '("za" "uk" "eu")
   'duties '(compliance-with-all-applicable-laws
            understanding-foreign-regulations
            implementing-compliance-systems
            monitoring-regulatory-changes
            coordinating-cross-border-operations)
   'complexity-factors '(multiple-legal-systems
                        conflicting-requirements
                        language-barriers
                        cultural-differences
                        regulatory-coordination)
   'standard "Reasonable director managing international operations"
   'case-application "Dan managing ZA and UK entities with EU compliance requirements"
   'related-principles '(director-duty-of-care professional-standard)
   'inference-type 'deductive))

(define international-compliance-infrastructure-necessity
  (make-principle
   'name 'international-compliance-infrastructure-necessity
   'description "Necessity of IT infrastructure for international regulatory compliance"
   'domain '(regulatory-compliance company it-infrastructure)
   'confidence 0.92
   'jurisdiction '("za" "eu" "uk")
   'infrastructure-requirements '(multi-jurisdiction-documentation-systems
                                 regulatory-monitoring-tools
                                 secure-data-management
                                 cross-border-communication-systems
                                 compliance-tracking-software
                                 audit-trail-systems)
   'justification "International operations require sophisticated IT infrastructure for compliance"
   'case-application "Dan's IT expenses for managing multi-jurisdiction compliance"
   'cost-drivers '(multiple-regulatory-frameworks
                  data-security-requirements
                  documentation-complexity
                  real-time-monitoring-needs
                  audit-requirements)
   'related-principles '(regulatory-compliance-necessity business-necessity)
   'inference-type 'inductive))

;; =============================================================================
;; PART 2: TIMING ANALYSIS AND BAD FAITH INDICATORS
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 2.1 Manufactured Crisis Framework
;; -----------------------------------------------------------------------------

(define manufactured-crisis-indicators
  (make-principle
   'name 'manufactured-crisis-indicators
   'description "Indicators that a party manufactured the crisis they now complain about"
   'domain '(procedure bad-faith abuse-of-process)
   'confidence 0.93
   'jurisdiction "za"
   'provenance "Common law - bad faith analysis"
   'indicators '(actor-created-problem-complained-about
                timing-suspicious
                disproportionate-response
                no-internal-resolution-attempt
                problem-serves-actor-interests
                coordination-with-other-objectives
                manufactured-urgency
                inconsistent-with-prior-conduct)
   'legal-consequence "Multiple indicators rebut good faith presumption"
   'case-application "Peter's card cancellation creating documentation gap (PARA 7.2-7.5, 7.14-7.15)"
   'specific-indicators-present '(peter-cancelled-cards-then-complained-about-missing-docs
                                 cancellation-day-after-dan-provided-reports
                                 escalated-to-ex-parte-interdict-without-discussion
                                 no-board-meeting-or-mediation-attempted
                                 documentation-gap-provides-litigation-leverage
                                 timing-coincides-with-settlement-negotiation)
   'related-principles '(bona-fides venire-contra-factum-proprium abuse-of-process)
   'inference-type 'abductive))

(define timing-analysis-bad-faith
  (make-principle
   'name 'timing-analysis-bad-faith
   'description "Temporal analysis of actions to identify bad faith indicators"
   'domain '(procedure bad-faith evidence)
   'confidence 0.91
   'jurisdiction "za"
   'analysis-method "Examine sequence and timing of events for suspicious patterns"
   'suspicious-timing-patterns '(immediate-retaliation-after-cooperation
                                rapid-escalation-without-justification
                                coordination-with-other-events
                                timing-serves-ulterior-motive
                                inconsistent-with-stated-urgency)
   'case-application "Card cancellation June 7 (day after Dan's June 6 cooperation)"
   'inference "Suspicious timing suggests retaliation rather than legitimate concern"
   'related-principles '(manufactured-crisis-indicators bad-faith-comprehensive)
   'inference-type 'abductive))

(define obstruction-of-documentation-indicators
  (make-principle
   'name 'obstruction-of-documentation-indicators
   'description "Indicators that party obstructed access to documentation"
   'domain '(procedure evidence bad-faith)
   'confidence 0.94
   'jurisdiction "za"
   'indicators '(party-controlled-access-to-documentation
                party-terminated-access-unilaterally
                termination-made-documentation-inaccessible
                party-now-complains-about-missing-documentation
                no-alternative-access-provided
                timing-suggests-deliberate-obstruction)
   'legal-consequence "Party cannot benefit from obstruction they created"
   'case-application "Peter cancelled cards making documentation inaccessible, then complained about missing docs"
   'related-principles '(venire-contra-factum-proprium manufactured-crisis-indicators)
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 2.2 But-For Causation Test
;; -----------------------------------------------------------------------------

(define but-for-causation-test
  (make-principle
   'name 'but-for-causation-test
   'description "Test for factual causation - would harm have occurred but for defendant's conduct?"
   'domain '(delict causation)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Common law delict - factual causation"
   'test "But for the defendant's conduct, would the harm have occurred?"
   'application-method "Remove defendant's conduct mentally and assess whether harm still occurs"
   'case-application "But for Peter's card cancellation, would documentation gap exist? Answer: No"
   'inference "Peter's conduct is factual cause of documentation gap"
   'related-principles '(causation-in-fact legal-causation)
   'inference-type 'deductive))

(define documentation-gap-causation-analysis
  (make-principle
   'name 'documentation-gap-causation-analysis
   'description "Analysis of who caused the documentation gap in Faucitt case"
   'domain '(evidence procedure causation)
   'confidence 0.95
   'jurisdiction "za"
   'case-specific "Faucitt v. Faucitt (2025-137857)"
   'factual-sequence '(dan-had-access-to-documentation-via-cards
                      dan-provided-reports-to-accountant-june-6
                      peter-cancelled-cards-june-7
                      documentation-became-inaccessible
                      peter-complains-about-missing-documentation)
   'but-for-analysis "But for Peter's card cancellation, Dan would still have access to documentation"
   'factual-causation "Peter's conduct caused documentation gap"
   'legal-consequence "Peter cannot complain about problem he created"
   'related-principles '(but-for-causation-test venire-contra-factum-proprium)
   'inference-type 'deductive))

;; =============================================================================
;; PART 3: TRUST POWER ABUSE FRAMEWORK (Enhanced)
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 3.1 Trust Power Bypass Indicators
;; -----------------------------------------------------------------------------

(define trust-power-bypass-indicators
  (make-principle
   'name 'trust-power-bypass-indicators
   'description "Indicators that trustee is bypassing direct trust powers for ulterior motives"
   'domain '(trust fiduciary abuse-of-process)
   'confidence 0.94
   'jurisdiction "za"
   'statutory-basis "Trust Property Control Act 57 of 1988, common law"
   'indicators '(trustee-has-absolute-powers
                trustee-seeks-court-relief-instead
                beneficiary-is-target-of-relief
                timing-coincides-with-other-actions
                manufactured-urgency
                disproportionate-relief-sought
                no-trust-administration-justification)
   'critical-question "Why does trustee with absolute powers need court relief?"
   'inference "Seeking court relief when direct power exists suggests ulterior motive"
   'ulterior-motives '(harassment leverage delay litigation-strategy settlement-pressure)
   'case-application "Peter seeks interdict despite having absolute trust powers (PARA 11-11.5)"
   'legal-consequence "Abuse of trust powers, breach of fiduciary duty, grounds for removal"
   'related-principles '(proper-purpose-test abuse-of-process trustee-conflict-prohibition)
   'inference-type 'abductive))

(define trust-litigation-restrictions
  (make-principle
   'name 'trust-litigation-restrictions
   'description "Restrictions on trustee's ability to litigate against beneficiaries"
   'domain '(trust fiduciary procedure)
   'confidence 0.96
   'jurisdiction "za"
   'provenance "Common law fiduciary duty"
   'general-rule "Trustee cannot sue beneficiary in trustee capacity"
   'exceptions '(beneficiary-breach-of-trust-deed
                beneficiary-fraud-against-trust
                beneficiary-claiming-beyond-entitlement
                beneficiary-interfering-with-trust-administration)
   'burden-of-proof "Trustee must prove exception applies"
   'case-application "Peter (trustee) seeking interdict against Jax (beneficiary)"
   'analysis "No evidence of fraud, breach, or improper claim by Jax"
   'inference "Peter's action violates trust litigation restrictions"
   'related-principles '(trustee-conflict-prohibition beneficiary-adverse-action-prohibition)
   'inference-type 'deductive))

;; =============================================================================
;; PART 4: SHAREHOLDER OPPRESSION FRAMEWORK
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 4.1 Shareholder Oppression Test
;; -----------------------------------------------------------------------------

(define shareholder-oppression-test
  (make-principle
   'name 'shareholder-oppression-test
   'description "Test for shareholder oppression under Companies Act s163"
   'domain '(company shareholder-rights)
   'confidence 0.96
   'jurisdiction "za"
   'statutory-basis "Companies Act 71 of 2008, s163"
   'test-elements '(oppressive-conduct
                   unfairly-prejudicial-conduct
                   unfairly-disregards-interests
                   reasonable-expectation-breach)
   'oppressive-conduct "Burdensome, harsh, wrongful conduct"
   'unfairly-prejudicial "Conduct causing unfair prejudice to shareholder"
   'unfairly-disregards-interests "Conduct disregarding shareholder interests without justification"
   'reasonable-expectation "Breach of legitimate expectations arising from relationship"
   'remedies '(buy-out-order
              winding-up
              regulation-of-conduct
              appointment-of-director
              damages)
   'burden-of-proof "Applicant must prove oppressive conduct"
   'case-application "Peter's claims of oppression (PARA 10.5-10.10.23)"
   'defense "Business decisions protected by business judgment rule; no oppression shown"
   'related-principles '(business-judgment-rule shareholder-rights)
   'inference-type 'deductive))

(define shareholder-oppression-defense
  (make-principle
   'name 'shareholder-oppression-defense
   'description "Defenses against shareholder oppression claims"
   'domain '(company shareholder-rights)
   'confidence 0.94
   'jurisdiction "za"
   'defenses '(business-judgment-rule-protection
              legitimate-business-purpose
              no-unfair-prejudice
              conduct-justified-by-circumstances
              shareholder-acquiesced
              shareholder-participated-in-conduct)
   'case-application "Jax-Dan defense against Peter's oppression claims"
   'specific-defenses '(it-expenses-justified-by-regulatory-compliance
                       business-decisions-protected-by-business-judgment-rule
                       peter-engaged-in-self-dealing-villa-via
                       peter-manufactured-crisis-via-card-cancellation
                       peter-failed-to-use-internal-resolution-mechanisms)
   'related-principles '(business-judgment-rule regulatory-compliance-necessity)
   'inference-type 'deductive))

;; =============================================================================
;; PART 5: INTEGRATION WITH EXISTING FRAMEWORKS
;; =============================================================================

;; Register all principles
(register-principle! eu-responsible-person-duty)
(register-principle! regulatory-compliance-cost-reasonableness)
(register-principle! regulatory-compliance-necessity)
(register-principle! cross-border-director-duties)
(register-principle! international-compliance-infrastructure-necessity)
(register-principle! manufactured-crisis-indicators)
(register-principle! timing-analysis-bad-faith)
(register-principle! obstruction-of-documentation-indicators)
(register-principle! but-for-causation-test)
(register-principle! documentation-gap-causation-analysis)
(register-principle! trust-power-bypass-indicators)
(register-principle! trust-litigation-restrictions)
(register-principle! shareholder-oppression-test)
(register-principle! shareholder-oppression-defense)

;; Export framework
(provide 'south-african-company-law-regulatory-compliance-enhanced)
