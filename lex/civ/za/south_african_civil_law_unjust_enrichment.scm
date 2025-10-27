;; South African Civil Law - Unjust Enrichment Module
;; Enhanced for Case 2025-137857 (Faucitt v. Faucitt)
;; =============================================================================
;; Version: 2.0 (Enhanced)
;; Last Updated: 2025-10-27
;; Focus: Unjust Enrichment, Restitution, Quantum Meruit
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
   'name "South African Civil Law - Unjust Enrichment (Enhanced)"
   'jurisdiction "za"
   'legal-domain '(civil restitution)
   'version "2.0"
   'last-updated "2025-10-27"
   'derived-from-level 1
   'confidence-base 0.95
   'statutory-basis "Common law, Roman-Dutch law"
   'language "en"
   'case-specific-enhancements "Faucitt v. Faucitt (2025-137857) - Platform usage unjust enrichment"))

;; =============================================================================
;; PART 1: UNJUST ENRICHMENT FRAMEWORK
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 1.1 Four-Element Test for Unjust Enrichment
;; -----------------------------------------------------------------------------

(define unjust-enrichment-four-element-test
  (make-principle
   'name 'unjust-enrichment-four-element-test
   'description "Four elements required for unjust enrichment claim in South African law"
   'domain '(civil restitution)
   'confidence 0.97
   'jurisdiction "za"
   'statutory-basis "Common law, Roman-Dutch law (condictio sine causa)"
   'provenance "Roman law - condictiones"
   'four-elements '(enrichment at-expense-of absence-of-legal-ground no-defense)
   'burden-of-proof "Claimant must prove all four elements"
   'remedy "Restitution of enrichment"
   'case-application "RWD platform usage without payment (Faucitt case)"
   'related-principles '(nemo-debet-locupletari restitution quantum-meruit)
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 1.2 Element 1: Enrichment
;; -----------------------------------------------------------------------------

(define enrichment-test
  (make-principle
   'name 'enrichment-test
   'description "Test for whether defendant has been enriched"
   'domain '(civil restitution)
   'confidence 0.96
   'jurisdiction "za"
   'enrichment-types '(receipt-of-money receipt-of-property 
                      receipt-of-services benefit-obtained
                      expense-saved)
   'test "Has defendant's patrimony increased or expense been saved?"
   'examples '(money-received property-transferred 
              services-rendered debt-discharged
              expense-avoided)
   'case-application "RWD enriched by using Dan's platform (saved R140K-R280K in platform costs)"
   'valuation "Objective value of benefit received"
   'inference-type 'deductive))

(define enrichment-by-service
  (make-principle
   'name 'enrichment-by-service
   'description "Enrichment through receipt of services"
   'domain '(civil restitution)
   'confidence 0.95
   'jurisdiction "za"
   'test "Has defendant received valuable services?"
   'valuation-methods '(market-value-of-services 
                       reasonable-remuneration
                       quantum-meruit
                       expense-saved)
   'case-application "RWD received platform services from RegimA Zone Ltd (Faucitt case)"
   'inference-type 'deductive))

(define expense-saved-enrichment
  (make-principle
   'name 'expense-saved-enrichment
   'description "Enrichment by saving expense defendant would otherwise have incurred"
   'domain '(civil restitution)
   'confidence 0.95
   'jurisdiction "za"
   'test "Has defendant saved expense by receiving benefit?"
   'examples '(avoided-rental-payment avoided-service-fee 
              avoided-platform-cost avoided-infrastructure-cost)
   'case-application "RWD saved R140K-R280K by using Dan's platform without payment (Faucitt case)"
   'valuation "Amount defendant would have paid for same benefit"
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 1.3 Element 2: At Expense Of
;; -----------------------------------------------------------------------------

(define at-expense-of-test
  (make-principle
   'name 'at-expense-of-test
   'description "Test for whether enrichment was at expense of claimant"
   'domain '(civil restitution)
   'confidence 0.96
   'jurisdiction "za"
   'test "Did claimant's patrimony decrease corresponding to defendant's enrichment?"
   'requirement "Causal connection between claimant's loss and defendant's gain"
   'examples '(claimant-paid-defendant-received 
              claimant-provided-service-defendant-benefited
              claimant-property-transferred-to-defendant)
   'case-application "RegimA Zone Ltd paid R140K-R280K, RWD benefited (Faucitt case)"
   'not-required "Exact correspondence in value"
   'inference-type 'deductive))

(define impoverishment-of-claimant
  (make-principle
   'name 'impoverishment-of-claimant
   'description "Claimant's patrimony must have decreased"
   'domain '(civil restitution)
   'confidence 0.95
   'jurisdiction "za"
   'impoverishment-types '(money-paid property-transferred 
                          services-rendered expense-incurred)
   'test "Has claimant suffered diminution of patrimony?"
   'case-application "RegimA Zone Ltd paid R140K-R280K for platform (Faucitt case)"
   'inference-type 'deductive))

(define causal-connection-enrichment
  (make-principle
   'name 'causal-connection-enrichment
   'description "Causal connection required between claimant's loss and defendant's gain"
   'domain '(civil restitution)
   'confidence 0.95
   'jurisdiction "za"
   'test "Is there causal link between claimant's impoverishment and defendant's enrichment?"
   'standard "But-for causation sufficient"
   'case-application "But for RegimA Zone Ltd paying, RWD would not have had platform (Faucitt case)"
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 1.4 Element 3: Absence of Legal Ground
;; -----------------------------------------------------------------------------

(define absence-of-legal-ground-test
  (make-principle
   'name 'absence-of-legal-ground-test
   'description "Test for whether enrichment lacks legal justification"
   'domain '(civil restitution)
   'confidence 0.96
   'jurisdiction "za"
   'test "Is there no legal ground (contract, statute, court order) justifying enrichment?"
   'legal-grounds '(valid-contract statutory-entitlement 
                   court-order gift-intention
                   legal-obligation)
   'no-legal-ground-if '(no-contract contract-void 
                        no-statutory-basis no-gift-intention
                        no-legal-obligation)
   'case-application "RWD has no contract with RegimA Zone Ltd for platform usage (Faucitt case)"
   'burden-of-proof "Claimant must show absence of legal ground"
   'inference-type 'deductive))

(define no-contract-justification
  (make-principle
   'name 'no-contract-justification
   'description "Enrichment not justified if no valid contract exists"
   'domain '(civil restitution contract)
   'confidence 0.96
   'jurisdiction "za"
   'test "Is there valid contract justifying enrichment?"
   'contract-requirements '(offer acceptance consideration 
                           consensus-ad-idem capacity legality)
   'case-application "No contract between RWD and RegimA Zone Ltd (Faucitt case)"
   'inference "If no contract, enrichment lacks legal ground"
   'related-principles '(pacta-sunt-servanda consensus-ad-idem)
   'inference-type 'deductive))

(define no-gift-intention
  (make-principle
   'name 'no-gift-intention
   'description "Enrichment not justified if no intention to make gift"
   'domain '(civil restitution property)
   'confidence 0.95
   'jurisdiction "za"
   'test "Did claimant intend to make gift to defendant?"
   'gift-requirements '(intention-to-donate gratuitous-transfer 
                       no-expectation-of-return)
   'case-application "RegimA Zone Ltd did not intend to gift platform to RWD (Faucitt case)"
   'inference "If no gift intention, enrichment lacks legal ground"
   'inference-type 'deductive))

;; -----------------------------------------------------------------------------
;; 1.5 Element 4: No Defense
;; -----------------------------------------------------------------------------

(define no-defense-to-enrichment
  (make-principle
   'name 'no-defense-to-enrichment
   'description "Defendant has no valid defense to unjust enrichment claim"
   'domain '(civil restitution)
   'confidence 0.95
   'jurisdiction "za"
   'defenses '(change-of-position estoppel 
              counter-restitution-impossible bona-fide-purchase
              statutory-bar laches)
   'burden-of-proof "Defendant must prove defense"
   'case-application "RWD has no valid defense to unjust enrichment claim (Faucitt case)"
   'inference-type 'deductive))

(define change-of-position-defense
  (make-principle
   'name 'change-of-position-defense
   'description "Defense that defendant changed position in reliance on enrichment"
   'domain '(civil restitution)
   'confidence 0.94
   'jurisdiction "za"
   'requirements '(bona-fide-reliance detrimental-change 
                  irreversible-change causation)
   'examples '(spent-money-in-reliance made-irreversible-commitment 
              disposed-of-property)
   'not-defense-if '(bad-faith knew-no-entitlement 
                    change-would-have-occurred-anyway)
   'inference-type 'deductive))

;; =============================================================================
;; PART 2: QUANTUM MERUIT
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 2.1 Quantum Meruit Principle
;; -----------------------------------------------------------------------------

(define quantum-meruit
  (make-principle
   'name 'quantum-meruit
   'description "Reasonable remuneration for services rendered without agreed price"
   'domain '(civil restitution contract)
   'confidence 0.96
   'jurisdiction "za"
   'provenance "Common law restitutionary principle"
   'principle "Person who renders services entitled to reasonable remuneration"
   'application-contexts '(no-contract-exists contract-void 
                          contract-silent-on-price services-requested)
   'valuation "Reasonable value of services rendered"
   'case-application "RegimA Zone Ltd entitled to quantum meruit for platform services (Faucitt case)"
   'related-principles '(unjust-enrichment-four-element-test enrichment-by-service)
   'inference-type 'deductive))

(define quantum-meruit-calculation
  (make-principle
   'name 'quantum-meruit-calculation
   'description "Methods for calculating quantum meruit (reasonable remuneration)"
   'domain '(civil restitution)
   'confidence 0.94
   'jurisdiction "za"
   'calculation-methods '(market-rate-for-services 
                         usual-and-customary-charges
                         reasonable-value-of-services
                         expense-saved-by-recipient
                         comparable-transactions)
   'factors '(nature-of-services skill-required 
           time-spent market-rates
           benefit-to-recipient)
   'case-application "Platform services: R140K-R280K over 28 months (Faucitt case)"
   'inference-type 'inductive))

(define platform-usage-quantum-meruit
  (make-principle
   'name 'platform-usage-quantum-meruit
   'description "Quantum meruit for technology platform usage"
   'domain '(civil restitution technology)
   'confidence 0.92
   'jurisdiction "za"
   'valuation-factors '(platform-subscription-cost 
                       infrastructure-cost
                       development-cost-amortization
                       market-rate-for-similar-platforms
                       benefit-to-user)
   'case-application "RWD usage of RegimA Zone Ltd Shopify platform (Faucitt case)"
   'calculation "Actual cost incurred by platform owner (R140K-R280K)"
   'alternative-calculation "Market rate for similar platform services"
   'inference-type 'inductive))

;; =============================================================================
;; PART 3: RESTITUTION REMEDIES
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 3.1 Restitution Principles
;; -----------------------------------------------------------------------------

(define restitution-principle
  (make-principle
   'name 'restitution-principle
   'description "Principle that unjust enrichment must be restored"
   'domain '(civil restitution remedies)
   'confidence 0.97
   'jurisdiction "za"
   'provenance "Roman law - condictiones, nemo debet locupletari"
   'principle "Person unjustly enriched must restore enrichment to impoverished party"
   'remedy-types '(money-restitution property-restitution 
                  value-restitution quantum-meruit)
   'related-principles '(nemo-debet-locupletari unjust-enrichment-four-element-test)
   'inference-type 'deductive))

(define restitution-remedies
  (make-principle
   'name 'restitution-remedies
   'description "Available remedies for unjust enrichment"
   'domain '(civil restitution remedies)
   'confidence 0.96
   'jurisdiction "za"
   'remedies '(money-payment property-return 
              value-of-enrichment quantum-meruit
              account-for-profits)
   'primary-remedy "Restoration of enrichment"
   'alternative-remedy "Payment of value if restoration impossible"
   'case-application "RWD must pay RegimA Zone Ltd for platform usage (Faucitt case)"
   'inference-type 'deductive))

(define restitution-calculation-methods
  (make-principle
   'name 'restitution-calculation-methods
   'description "Methods for calculating restitution amount"
   'domain '(civil restitution remedies)
   'confidence 0.94
   'jurisdiction "za"
   'methods '(actual-expense-incurred 
             market-value-of-benefit
             quantum-meruit
             expense-saved-by-defendant
             objective-value-of-enrichment)
   'case-application "R140K-R280K actual cost or R2.94M-R6.88M market value (Faucitt case)"
   'principle "Claimant entitled to lesser of: (1) value of enrichment, (2) amount of impoverishment"
   'inference-type 'inductive))

;; -----------------------------------------------------------------------------
;; 3.2 Technology and Platform Restitution
;; -----------------------------------------------------------------------------

(define technology-service-valuation
  (make-principle
   'name 'technology-service-valuation
   'description "Valuation methods for technology services in restitution claims"
   'domain '(civil restitution technology)
   'confidence 0.91
   'jurisdiction "za"
   'valuation-approaches '(actual-cost-incurred 
                          market-rate-for-services
                          subscription-equivalent
                          development-cost-amortization
                          benefit-to-user)
   'case-application "Shopify platform services valuation (Faucitt case)"
   'factors '(infrastructure-cost subscription-fees 
             development-cost maintenance-cost
             market-alternatives)
   'inference-type 'inductive))

(define infrastructure-cost-restitution
  (make-principle
   'name 'infrastructure-cost-restitution
   'description "Restitution for infrastructure costs incurred for another's benefit"
   'domain '(civil restitution)
   'confidence 0.92
   'jurisdiction "za"
   'principle "Person who incurs infrastructure costs for another's benefit entitled to restitution"
   'recoverable-costs '(platform-subscription-fees 
                       hosting-costs
                       domain-and-ssl-costs
                       maintenance-costs
                       development-costs-amortized)
   'case-application "RegimA Zone Ltd platform costs for RWD benefit (Faucitt case)"
   'calculation "Actual costs incurred attributable to defendant's use"
   'inference-type 'deductive))

(define platform-service-unjust-enrichment
  (make-principle
   'name 'platform-service-unjust-enrichment
   'description "Unjust enrichment through use of technology platform without payment"
   'domain '(civil restitution technology)
   'confidence 0.92
   'jurisdiction "za"
   'elements '(platform-usage-by-defendant 
            platform-owned-and-paid-by-claimant
            no-payment-by-defendant
            no-contract-or-agreement
            benefit-to-defendant)
   'case-application "RWD use of RegimA Zone Ltd Shopify platform (Faucitt case)"
   'enrichment-measure "Cost saved by not having to pay for own platform"
   'restitution "Payment for platform usage at market rate or actual cost"
   'inference-type 'inductive))

;; =============================================================================
;; PART 4: CROSS-BORDER UNJUST ENRICHMENT
;; =============================================================================

;; -----------------------------------------------------------------------------
;; 4.1 Cross-Border Restitution Claims
;; -----------------------------------------------------------------------------

(define cross-border-unjust-enrichment
  (make-principle
   'name 'cross-border-unjust-enrichment
   'description "Unjust enrichment claims across jurisdictions"
   'domain '(civil restitution international)
   'confidence 0.90
   'jurisdiction "za"
   'principle "Unjust enrichment principles apply across borders"
   'considerations '(applicable-law jurisdiction 
                    enforcement-of-judgment
                    currency-conversion)
   'case-application "RegimA Zone Ltd (UK) claim against RWD (ZA) (Faucitt case)"
   'applicable-law "Law of place of enrichment (lex loci enrichmenti)"
   'alternative "Law of place of impoverishment"
   'inference-type 'deductive))

(define cross-border-platform-enrichment
  (make-principle
   'name 'cross-border-platform-enrichment
   'description "Unjust enrichment for cross-border platform usage"
   'domain '(civil restitution international technology)
   'confidence 0.89
   'jurisdiction "za"
   'scenario "Platform owner in one jurisdiction, user in another"
   'case-application "RegimA Zone Ltd (UK) platform, RWD (ZA) user (Faucitt case)"
   'applicable-law "Likely law of user's jurisdiction (place of enrichment)"
   'enforcement "UK judgment enforceable in ZA, ZA judgment enforceable in UK"
   'inference-type 'inductive))

;; =============================================================================
;; PART 5: CASE-SPECIFIC INFERENCE RULES
;; =============================================================================

(define faucitt-rwd-platform-unjust-enrichment-inference
  (make-inference-rule
   'name 'faucitt-rwd-platform-unjust-enrichment-inference
   'description "Inference rule for RWD platform unjust enrichment (Faucitt case)"
   'fact-pattern '(rwd-used-platform-for-28-months 
                  platform-owned-by-regima-zone-ltd-dan
                  regima-zone-paid-r140k-to-r280k
                  rwd-paid-nothing
                  no-contract-between-rwd-and-regima-zone
                  rwd-benefited-from-platform)
   'inference-chain '(
     (fact rwd-used-platform-saved-r140k-to-r280k)
     (principle enrichment-test)
     (inference rwd-enriched)
     
     (fact regima-zone-paid-r140k-to-r280k)
     (principle at-expense-of-test)
     (inference enrichment-at-expense-of-regima-zone)
     
     (fact no-contract-between-rwd-and-regima-zone)
     (principle absence-of-legal-ground-test)
     (inference no-legal-ground-for-enrichment)
     
     (fact rwd-has-no-valid-defense)
     (principle no-defense-to-enrichment)
     (inference no-defense-available)
     
     (fact all-four-elements-satisfied)
     (principle unjust-enrichment-four-element-test)
     (inference unjust-enrichment-established))
   'confidence 0.88
   'conclusion "RWD unjustly enriched at expense of RegimA Zone Ltd"
   'legal-consequences '(restitution-required 
                        payment-of-r140k-to-r280k-minimum
                        quantum-meruit-for-platform-services
                        possible-higher-valuation-r2.94m-to-r6.88m)))

(define faucitt-platform-quantum-meruit-inference
  (make-inference-rule
   'name 'faucitt-platform-quantum-meruit-inference
   'description "Inference rule for platform quantum meruit calculation (Faucitt case)"
   'fact-pattern '(regima-zone-provided-platform-services 
                  no-agreed-price
                  rwd-requested-or-accepted-services
                  regima-zone-incurred-r140k-to-r280k-costs
                  market-value-r2.94m-to-r6.88m)
   'inference-chain '(
     (fact regima-zone-provided-platform-services)
     (principle quantum-meruit)
     (inference entitled-to-reasonable-remuneration)
     
     (fact actual-cost-r140k-to-r280k)
     (principle quantum-meruit-calculation)
     (inference minimum-recovery-r140k-to-r280k)
     
     (fact market-value-r2.94m-to-r6.88m)
     (principle platform-usage-quantum-meruit)
     (inference potential-recovery-r2.94m-to-r6.88m)
     
     (fact rwd-saved-expense-of-own-platform)
     (principle expense-saved-enrichment)
     (inference rwd-saved-r2.94m-to-r6.88m)
     
     (fact technology-platform-services)
     (principle technology-service-valuation)
     (inference valuation-based-on-market-rate-or-actual-cost))
   'confidence 0.86
   'conclusion "RegimA Zone Ltd entitled to quantum meruit: minimum R140K-R280K, potentially R2.94M-R6.88M"
   'legal-consequences '(restitution-claim-viable 
                        range-r140k-to-r6.88m
                        court-determines-reasonable-remuneration)))

(define faucitt-cross-border-enrichment-inference
  (make-inference-rule
   'name 'faucitt-cross-border-enrichment-inference
   'description "Inference rule for cross-border unjust enrichment (Faucitt case)"
   'fact-pattern '(regima-zone-ltd-uk-company 
                  rwd-za-company
                  platform-services-cross-border
                  enrichment-occurred-in-za
                  impoverishment-occurred-in-uk)
   'inference-chain '(
     (fact enrichment-in-za-impoverishment-in-uk)
     (principle cross-border-unjust-enrichment)
     (inference cross-border-claim-viable)
     
     (fact enrichment-occurred-in-za)
     (principle lex-loci-enrichmenti)
     (inference za-law-likely-applicable)
     
     (fact platform-services-cross-border)
     (principle cross-border-platform-enrichment)
     (inference unjust-enrichment-principles-apply)
     
     (fact uk-judgment-enforceable-in-za)
     (principle enforcement-of-foreign-judgments)
     (inference claim-can-be-enforced))
   'confidence 0.84
   'conclusion "Cross-border unjust enrichment claim viable under ZA law"
   'legal-consequences '(za-law-applies 
                        claim-enforceable
                        restitution-required)))

;; =============================================================================
;; PART 6: HELPER FUNCTIONS FOR CASE APPLICATION
;; =============================================================================

(define (unjust-enrichment-established? defendant claimant transaction)
  "Determine if unjust enrichment claim established"
  (and (enriched? defendant transaction)
       (at-expense-of? claimant transaction)
       (no-legal-ground? transaction)
       (no-defense? defendant transaction)))

(define (quantum-meruit-amount services)
  "Calculate quantum meruit for services"
  (or (agreed-price services)
      (market-rate services)
      (reasonable-value services)
      (expense-saved services)))

(define (restitution-amount enrichment impoverishment)
  "Calculate restitution amount"
  (min (value-of-enrichment enrichment)
       (amount-of-impoverishment impoverishment)))

(define (platform-usage-enrichment platform-owner platform-user period)
  "Calculate enrichment from platform usage"
  (or (actual-cost-incurred platform-owner period)
      (market-rate-for-platform period)
      (expense-saved platform-user period)))

;; =============================================================================
;; VALIDATION AND TESTING
;; =============================================================================

(define (validate-unjust-enrichment-framework)
  "Validate that all unjust enrichment principles properly derive from Level 1"
  (and (principle-exists? 'nemo-debet-locupletari)
       (principle-exists? 'unjust-enrichment-four-element-test)
       (principle-exists? 'quantum-meruit)
       (principle-exists? 'restitution-principle)
       #t))

;; Run validation
(validate-unjust-enrichment-framework)

;; =============================================================================
;; END OF SOUTH AFRICAN CIVIL LAW - UNJUST ENRICHMENT MODULE
;; =============================================================================

