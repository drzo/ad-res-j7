;; Enhanced South African Civil Law - Case-Specific Extensions
;; AD-RES-J7 Case: 2025-137857
;; Date: October 26, 2025
;; Purpose: Extend civil law framework with case-specific legal reasoning for optimal resolution

;; =============================================================================
;; TECHNICAL INFRASTRUCTURE AS LEGAL PROPERTY
;; =============================================================================

;; Technical Infrastructure Entity
(define technical-infrastructure?
  (lambda (entity)
    (and (has-attribute entity 'owner)
         (has-attribute entity 'users)
         (has-attribute entity 'annual-cost)
         (has-attribute entity 'infrastructure-type))))

;; Platform Ownership Rights
(define platform-owner?
  (lambda (person platform)
    (and (technical-infrastructure? platform)
         (equal? (get-attribute platform 'owner) person))))

;; Platform Usage Legitimacy
(define platform-usage-legitimate?
  (lambda (user platform)
    (or (platform-owner? user platform)
        (and (usage-agreement-exists? user platform)
             (payment-made? user platform))
        (permission-granted? user platform))))

;; Platform Usage Without Payment (Unjust Enrichment Indicator)
(define platform-usage-without-payment?
  (lambda (user platform)
    (and (not (platform-owner? user platform))
         (uses-platform? user platform)
         (not (payment-made? user platform))
         (not (usage-agreement-exists? user platform)))))

;; =============================================================================
;; REGULATORY COMPLIANCE ROLES
;; =============================================================================

;; Regulatory Role Entity
(define regulatory-role?
  (lambda (person role)
    (and (has-attribute person role)
         (has-attribute role 'regulation)
         (has-attribute role 'duties)
         (has-attribute role 'compliance-systems))))

;; Responsible Person Role (EU Cosmetics Regulation 1223/2009)
(define responsible-person?
  (lambda (person)
    (regulatory-role? person 'responsible-person-eu-cosmetics)))

;; Regulatory Disruption Test
(define regulatory-disruption?
  (lambda (action regulatory-role)
    (and (affects-compliance-systems? action regulatory-role)
         (creates-non-compliance-risk? action regulatory-role)
         (endangers-market-access? action regulatory-role))))

;; Regulatory Compliance Duty Breach
(define regulatory-compliance-breach?
  (lambda (actor action regulatory-role)
    (and (regulatory-disruption? action regulatory-role)
         (foreseeable-disruption? actor action)
         (no-mitigation-measures? actor action))))

;; =============================================================================
;; DIRECTOR DUTIES - ENHANCED FOR UNILATERAL ACTIONS
;; =============================================================================

;; Director Unilateral Action (Without Board Authority)
(define director-unilateral-action?
  (lambda (action)
    (and (director-action? action)
         (not (board-authority? action))
         (not (express-delegation? action)))))

;; Unilateral Action Breach Test
(define director-unilateral-action-breach?
  (lambda (action)
    (and (director-unilateral-action? action)
         (not (emergency-circumstances? action))
         (not (notice-to-co-directors? action))
         (material-impact? action))))

;; Reasonable Director Test (Companies Act s76)
(define reasonable-director-test?
  (lambda (director-action)
    (and (internal-discussion-first? director-action)
         (notice-to-co-directors? director-action)
         (opportunity-for-explanation? director-action)
         (business-continuity-ensured? director-action)
         (proportionate-response? director-action)
         (proper-purpose? director-action))))

;; Duty to Act Collectively
(define duty-to-act-collectively?
  (lambda (director-action)
    (or (board-resolution? director-action)
        (unanimous-written-consent? director-action)
        (express-delegation? director-action)
        (emergency-with-ratification? director-action))))

;; Proper Purpose Test
(define proper-purpose-test?
  (lambda (director-action)
    (and (bona-fides? director-action)
         (company-benefit-intended? director-action)
         (not (personal-interest-primary? director-action))
         (not (ulterior-motive? director-action)))))

;; =============================================================================
;; TRUSTEE DUTIES - ENHANCED FOR BENEFICIARY CONFLICTS
;; =============================================================================

;; Trustee-Beneficiary Conflict
(define trustee-beneficiary-conflict?
  (lambda (trustee-action beneficiary)
    (and (trustee? (get-actor trustee-action))
         (beneficiary? beneficiary)
         (harms-beneficiary? trustee-action beneficiary)
         (personal-interest-conflict? trustee-action))))

;; Trustee Fiduciary Duty Breach
(define trustee-fiduciary-breach?
  (lambda (trustee-action)
    (or (conflict-of-interest-trustee? trustee-action)
        (not (beneficiary-best-interest? trustee-action))
        (not (proper-purpose-trust? trustee-action))
        (self-dealing-trustee? trustee-action))))

;; Bypassing Trust Powers Test
(define bypassing-trust-powers?
  (lambda (trustee-action alternative-remedy)
    (and (has-trust-power? trustee alternative-remedy)
         (chose-alternative-route? trustee-action)
         (more-harmful-route? trustee-action alternative-remedy)
         (not (trust-power-inadequate? alternative-remedy)))))

;; =============================================================================
;; ENHANCED CAUSATION ANALYSIS
;; =============================================================================

;; Multi-Step Causation Chain
(define causation-chain?
  (lambda (initial-action final-harm intermediate-events)
    (and (not (null? intermediate-events))
         (factual-causation? initial-action (car intermediate-events))
         (all-foreseeable? intermediate-events)
         (no-intervening-causes? intermediate-events)
         (factual-causation? (last intermediate-events) final-harm))))

;; All Events Foreseeable
(define all-foreseeable?
  (lambda (events)
    (if (null? events)
        #t
        (and (foreseeable? (car events))
             (all-foreseeable? (cdr events))))))

;; No Intervening Causes
(define no-intervening-causes?
  (lambda (events)
    (if (null? events)
        #t
        (and (not (intervening-cause? (car events)))
             (no-intervening-causes? (cdr events))))))

;; Service Disruption Causation (Specific to Card Cancellation)
(define service-disruption-causation?
  (lambda (card-cancellation service-disruptions documentation-gap)
    (and (factual-causation? card-cancellation service-disruptions)
         (factual-causation? service-disruptions documentation-gap)
         (foreseeable? card-cancellation service-disruptions)
         (foreseeable? service-disruptions documentation-gap)
         (no-intervening-cause? card-cancellation documentation-gap))))

;; =============================================================================
;; MANUFACTURED CRISIS DOCTRINE
;; =============================================================================

;; Manufactured Crisis Test
(define manufactured-crisis?
  (lambda (actor crisis-creating-action complaint)
    (and (caused-by? crisis-creating-action complaint)
         (complains-about? actor complaint)
         (foreseeable-consequence? crisis-creating-action complaint)
         (not (clean-hands? actor)))))

;; Clean Hands Doctrine
(define clean-hands?
  (lambda (actor)
    (and (not (caused-own-harm? actor))
         (not (contributed-to-harm? actor))
         (good-faith-conduct? actor))))

;; Contributory Conduct Bar
(define contributory-conduct-bar?
  (lambda (actor harm)
    (and (caused-by? (get-action actor) harm)
         (foreseeable? (get-action actor) harm)
         (seeks-relief-for? actor harm))))

;; =============================================================================
;; UNJUST ENRICHMENT - ENHANCED FOR PLATFORM USAGE
;; =============================================================================

;; Platform Usage Unjust Enrichment
(define platform-usage-unjust-enrichment?
  (lambda (user platform-owner platform)
    (and (enrichment? user)
         (impoverishment? platform-owner)
         (causal-link? user platform-owner platform)
         (no-legal-ground? user platform-owner))))

;; Enrichment from Platform
(define enrichment-from-platform?
  (lambda (user platform)
    (and (uses-platform? user platform)
         (generates-revenue? user platform)
         (not (pays-for-usage? user platform)))))

;; Impoverishment of Platform Owner
(define impoverishment-platform-owner?
  (lambda (owner platform)
    (and (owns-platform? owner platform)
         (pays-platform-costs? owner platform)
         (not (receives-compensation? owner platform)))))

;; Quantum Meruit (Reasonable Value for Services)
(define quantum-meruit-platform?
  (lambda (platform-costs platform-usage-duration)
    (* platform-costs platform-usage-duration)))

;; =============================================================================
;; CONFLICT OF INTEREST - ENHANCED FOR COMPLEX STRUCTURES
;; =============================================================================

;; Multi-Entity Conflict of Interest
(define multi-entity-conflict?
  (lambda (person entity1 entity2 transaction)
    (and (has-interest? person entity1)
         (has-interest? person entity2)
         (transaction-between? entity1 entity2 transaction)
         (not (disclosed? person transaction))
         (not (arm's-length? transaction)))))

;; Self-Dealing Test
(define self-dealing?
  (lambda (director company1 company2 transaction)
    (and (director? director company1)
         (has-interest? director company2)
         (transaction-between? company1 company2 transaction)
         (benefits? director transaction))))

;; Trustee Self-Dealing
(define trustee-self-dealing?
  (lambda (trustee trust transaction)
    (and (trustee? trustee trust)
         (personal-benefit? trustee transaction)
         (trust-property-involved? trust transaction)
         (not (beneficiary-consent? trust transaction)))))

;; =============================================================================
;; ABUSE OF PROCESS
;; =============================================================================

;; Abuse of Process Test
(define abuse-of-process?
  (lambda (legal-action)
    (or (ulterior-motive? legal-action)
        (not (exhausted-alternative-remedies? legal-action))
        (disproportionate-relief? legal-action)
        (manufactured-urgency? legal-action))))

;; Exhaustion of Alternative Remedies
(define exhausted-alternative-remedies?
  (lambda (legal-action)
    (or (no-alternative-remedies? legal-action)
        (alternative-remedies-inadequate? legal-action)
        (attempted-alternative-remedies? legal-action))))

;; Manufactured Urgency
(define manufactured-urgency?
  (lambda (legal-action)
    (and (claims-urgency? legal-action)
         (self-created-urgency? legal-action)
         (not (genuine-urgency? legal-action)))))

;; Disproportionate Relief
(define disproportionate-relief?
  (lambda (legal-action)
    (and (maximum-relief-sought? legal-action)
         (not (proportionate-to-harm? legal-action))
         (alternative-lesser-remedies-available? legal-action))))

;; =============================================================================
;; CASE-SPECIFIC APPLICATIONS
;; =============================================================================

;; Card Cancellation Delict Analysis
(define card-cancellation-delict?
  (lambda (peter-action)
    (and (act-or-omission? peter-action)
         (wrongfulness-card-cancellation? peter-action)
         (fault-card-cancellation? peter-action)
         (causation-card-cancellation? peter-action)
         (damage-card-cancellation? peter-action))))

;; Wrongfulness of Card Cancellation
(define wrongfulness-card-cancellation?
  (lambda (action)
    (or (director-unilateral-action-breach? action)
        (breach-of-legal-duty? action)
        (contra-boni-mores? action))))

;; Fault in Card Cancellation
(define fault-card-cancellation?
  (lambda (action)
    (or (intentional? action)
        (and (negligence? action)
             (not (reasonable-director-test? action))))))

;; Causation in Card Cancellation
(define causation-card-cancellation?
  (lambda (action)
    (causation-chain? 
      action 
      'documentation-gap
      '(payment-failures service-suspensions cloud-storage-locked))))

;; Damage from Card Cancellation
(define damage-card-cancellation?
  (lambda (action)
    (or (operational-disruption? action)
        (financial-loss? action)
        (reputational-damage? action)
        (regulatory-risk? action))))

;; RWD Platform Unjust Enrichment Analysis
(define rwd-platform-unjust-enrichment?
  (lambda ()
    (and (enrichment-from-platform? 'rwd 'shopify-platform)
         (impoverishment-platform-owner? 'dan-uk-company 'shopify-platform)
         (causal-link? 'rwd 'dan-uk-company 'shopify-platform)
         (no-legal-ground? 'rwd 'dan-uk-company))))

;; Peter Villa Via Conflict Analysis
(define peter-villa-via-conflict?
  (lambda ()
    (and (multi-entity-conflict? 'peter 'villa-via 'rst 'rent-payment)
         (self-dealing? 'peter 'rst 'villa-via 'rent-payment)
         (not (arm's-length? 'rent-payment))
         (not (disclosed-to-co-directors? 'rent-payment)))))

;; Peter Trustee Conflict Analysis
(define peter-trustee-conflict?
  (lambda ()
    (and (trustee-beneficiary-conflict? 'peter-litigation 'jax)
         (trustee-fiduciary-breach? 'peter-litigation)
         (bypassing-trust-powers? 'peter-litigation 'trust-remedies))))

;; Peter Abuse of Process Analysis
(define peter-abuse-of-process?
  (lambda ()
    (and (abuse-of-process? 'ex-parte-interdict)
         (manufactured-urgency? 'ex-parte-interdict)
         (not (exhausted-alternative-remedies? 'ex-parte-interdict))
         (disproportionate-relief? 'ex-parte-interdict))))

;; =============================================================================
;; EVIDENCE SUFFICIENCY TESTS
;; =============================================================================

;; Evidence Sufficiency for Claim
(define evidence-sufficient?
  (lambda (claim evidence-list)
    (and (not (null? evidence-list))
         (all-elements-proven? claim evidence-list)
         (credible-evidence? evidence-list)
         (admissible-evidence? evidence-list))))

;; All Elements Proven
(define all-elements-proven?
  (lambda (claim evidence-list)
    (let ((required-elements (get-required-elements claim)))
      (all-elements-covered? required-elements evidence-list))))

;; Prima Facie Case Established
(define prima-facie-case?
  (lambda (claim evidence-list)
    (and (evidence-sufficient? claim evidence-list)
         (burden-of-proof-shifted? claim evidence-list))))

;; =============================================================================
;; LEGAL INFERENCE SCORING
;; =============================================================================

;; Confidence Score for Legal Inference
(define inference-confidence-score
  (lambda (principle evidence-list)
    (let ((evidence-count (length evidence-list))
          (evidence-quality (average-quality evidence-list))
          (principle-strength (get-principle-strength principle)))
      (* principle-strength evidence-quality (min 1.0 (/ evidence-count 5))))))

;; Strategic Importance Score
(define strategic-importance-score
  (lambda (legal-issue)
    (let ((priority-weight (get-priority-weight legal-issue))
          (evidence-count (get-evidence-count legal-issue))
          (legal-domains (get-legal-domains legal-issue)))
      (* priority-weight 
         (min 1.0 (/ evidence-count 10))
         (length legal-domains)))))

;; =============================================================================
;; HELPER FUNCTIONS (Placeholders for Implementation)
;; =============================================================================

;; Attribute and Property Checks
(define has-attribute (lambda (entity attr) #t))  ; Placeholder
(define get-attribute (lambda (entity attr) '()))  ; Placeholder
(define has-interest? (lambda (person entity) #t))  ; Placeholder

;; Action Checks
(define director-action? (lambda (action) #t))  ; Placeholder
(define board-authority? (lambda (action) #f))  ; Placeholder
(define express-delegation? (lambda (action) #f))  ; Placeholder
(define emergency-circumstances? (lambda (action) #f))  ; Placeholder
(define notice-to-co-directors? (lambda (action) #f))  ; Placeholder
(define material-impact? (lambda (action) #t))  ; Placeholder

;; Business Judgment Checks
(define internal-discussion-first? (lambda (action) #f))  ; Placeholder
(define opportunity-for-explanation? (lambda (action) #f))  ; Placeholder
(define business-continuity-ensured? (lambda (action) #f))  ; Placeholder
(define proportionate-response? (lambda (action) #f))  ; Placeholder
(define company-benefit-intended? (lambda (action) #f))  ; Placeholder
(define personal-interest-primary? (lambda (action) #t))  ; Placeholder
(define ulterior-motive? (lambda (action) #t))  ; Placeholder

;; Trust Checks
(define trustee? (lambda (person) #t))  ; Placeholder
(define beneficiary? (lambda (person) #t))  ; Placeholder
(define harms-beneficiary? (lambda (action beneficiary) #t))  ; Placeholder
(define personal-interest-conflict? (lambda (action) #t))  ; Placeholder
(define beneficiary-best-interest? (lambda (action) #f))  ; Placeholder
(define proper-purpose-trust? (lambda (action) #f))  ; Placeholder
(define has-trust-power? (lambda (trustee remedy) #t))  ; Placeholder
(define chose-alternative-route? (lambda (action) #t))  ; Placeholder
(define more-harmful-route? (lambda (action remedy) #t))  ; Placeholder
(define trust-power-inadequate? (lambda (remedy) #f))  ; Placeholder

;; Causation Checks
(define factual-causation? (lambda (action harm) #t))  ; Placeholder
(define foreseeable? (lambda (action) #t))  ; Placeholder
(define intervening-cause? (lambda (event) #f))  ; Placeholder
(define caused-by? (lambda (action harm) #t))  ; Placeholder
(define foreseeable-consequence? (lambda (action harm) #t))  ; Placeholder

;; Platform Checks
(define uses-platform? (lambda (user platform) #t))  ; Placeholder
(define payment-made? (lambda (user platform) #f))  ; Placeholder
(define usage-agreement-exists? (lambda (user platform) #f))  ; Placeholder
(define permission-granted? (lambda (user platform) #f))  ; Placeholder
(define generates-revenue? (lambda (user platform) #t))  ; Placeholder
(define pays-for-usage? (lambda (user platform) #f))  ; Placeholder
(define owns-platform? (lambda (owner platform) #t))  ; Placeholder
(define pays-platform-costs? (lambda (owner platform) #t))  ; Placeholder
(define receives-compensation? (lambda (owner platform) #f))  ; Placeholder

;; Enrichment Checks
(define enrichment? (lambda (party) #t))  ; Placeholder
(define impoverishment? (lambda (party) #t))  ; Placeholder
(define causal-link? (lambda (party1 party2 item) #t))  ; Placeholder
(define no-legal-ground? (lambda (party1 party2) #t))  ; Placeholder

;; Conflict Checks
(define transaction-between? (lambda (entity1 entity2 transaction) #t))  ; Placeholder
(define disclosed? (lambda (person transaction) #f))  ; Placeholder
(define arm's-length? (lambda (transaction) #f))  ; Placeholder
(define benefits? (lambda (person transaction) #t))  ; Placeholder
(define personal-benefit? (lambda (person transaction) #t))  ; Placeholder
(define trust-property-involved? (lambda (trust transaction) #t))  ; Placeholder
(define beneficiary-consent? (lambda (trust transaction) #f))  ; Placeholder
(define disclosed-to-co-directors? (lambda (transaction) #f))  ; Placeholder

;; Process Checks
(define claims-urgency? (lambda (action) #t))  ; Placeholder
(define self-created-urgency? (lambda (action) #t))  ; Placeholder
(define genuine-urgency? (lambda (action) #f))  ; Placeholder
(define maximum-relief-sought? (lambda (action) #t))  ; Placeholder
(define proportionate-to-harm? (lambda (action) #f))  ; Placeholder
(define alternative-lesser-remedies-available? (lambda (action) #t))  ; Placeholder
(define no-alternative-remedies? (lambda (action) #f))  ; Placeholder
(define alternative-remedies-inadequate? (lambda (action) #f))  ; Placeholder
(define attempted-alternative-remedies? (lambda (action) #f))  ; Placeholder

;; Regulatory Checks
(define affects-compliance-systems? (lambda (action role) #t))  ; Placeholder
(define creates-non-compliance-risk? (lambda (action role) #t))  ; Placeholder
(define endangers-market-access? (lambda (action role) #t))  ; Placeholder
(define foreseeable-disruption? (lambda (actor action) #t))  ; Placeholder
(define no-mitigation-measures? (lambda (actor action) #t))  ; Placeholder

;; Damage Checks
(define operational-disruption? (lambda (action) #t))  ; Placeholder
(define financial-loss? (lambda (action) #t))  ; Placeholder
(define reputational-damage? (lambda (action) #t))  ; Placeholder
(define regulatory-risk? (lambda (action) #t))  ; Placeholder

;; Evidence Checks
(define credible-evidence? (lambda (evidence-list) #t))  ; Placeholder
(define admissible-evidence? (lambda (evidence-list) #t))  ; Placeholder
(define all-elements-covered? (lambda (elements evidence) #t))  ; Placeholder
(define burden-of-proof-shifted? (lambda (claim evidence) #t))  ; Placeholder
(define get-required-elements (lambda (claim) '()))  ; Placeholder
(define average-quality (lambda (evidence-list) 0.8))  ; Placeholder
(define get-principle-strength (lambda (principle) 0.9))  ; Placeholder
(define get-priority-weight (lambda (issue) 1.0))  ; Placeholder
(define get-evidence-count (lambda (issue) 5))  ; Placeholder
(define get-legal-domains (lambda (issue) '(civil company trust)))  ; Placeholder

;; Conduct Checks
(define complains-about? (lambda (actor complaint) #t))  ; Placeholder
(define caused-own-harm? (lambda (actor) #t))  ; Placeholder
(define contributed-to-harm? (lambda (actor) #t))  ; Placeholder
(define good-faith-conduct? (lambda (actor) #f))  ; Placeholder
(define seeks-relief-for? (lambda (actor harm) #t))  ; Placeholder
(define get-actor (lambda (action) 'peter))  ; Placeholder
(define get-action (lambda (actor) 'card-cancellation))  ; Placeholder

;; Intentionality Checks
(define intentional? (lambda (action) #t))  ; Placeholder
(define negligence? (lambda (action) #t))  ; Placeholder

;; Delict Elements
(define act-or-omission? (lambda (action) #t))  ; Placeholder
(define contra-boni-mores? (lambda (action) #t))  ; Placeholder
(define breach-of-legal-duty? (lambda (action) #t))  ; Placeholder

;; Miscellaneous
(define bona-fides? (lambda (action) #f))  ; Placeholder
(define board-resolution? (lambda (action) #f))  ; Placeholder
(define unanimous-written-consent? (lambda (action) #f))  ; Placeholder
(define emergency-with-ratification? (lambda (action) #f))  ; Placeholder
(define self-dealing-trustee? (lambda (action) #t))  ; Placeholder
(define conflict-of-interest-trustee? (lambda (action) #t))  ; Placeholder

;; List Utilities
(define last
  (lambda (lst)
    (if (null? (cdr lst))
        (car lst)
        (last (cdr lst)))))

;; =============================================================================
;; END OF ENHANCED CIVIL LAW SCHEME
;; =============================================================================

