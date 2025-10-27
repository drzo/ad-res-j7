# Forensic Events Timeline Visualization

## Overview

This directory contains an interactive timeline visualization for all 15 forensic events documented in Case 2025-137857 (Peter Faucitt v. Jacqueline Faucitt et al.). The visualization highlights the systematic criminal activities across three categories: Revenue Theft, Family Trust Violations, and Financial Flows.

## Critical Revelation

**The Dan & Kay Shopify platform has been paid by Dan & Jax UK company RegimA Zone Ltd the whole time.**

- **Platform Owner:** RegimA Zone Ltd (UK) - Daniel Faucitt's independent UK entity
- **Payment Period:** Since July 2023 (28+ months)
- **Total Investment:** R140,000 - R280,000
- **Monthly Cost:** $1,000 - $2,000 USD

**Key Implication:** RWD ZA actually has no revenue stream of its own. All revenues were generated through infrastructure owned, paid for, and operated by Daniel's UK company. RWD merely issued invoices for sales occurring on a platform it neither owned nor funded.

## Files

### 1. `forensic-events-timeline-visualization.html`
Interactive HTML visualization with:
- **Timeline Display:** Visual chronological representation of all 15 forensic events
- **Category Filtering:** Filter events by Revenue Theft, Family Trust, or Financial Flows
- **Shopify Connection Indicators:** Each event linked to Shopify platform shows the connection to RegimA Zone Ltd payments
- **Impact Metrics:** Total documented losses per category (R10.27M+ total)
- **Responsive Design:** Mobile-friendly interface

### 2. `forensic-events-data.json`
Structured data file containing:
- Complete event details for all 15 forensic events
- Category breakdown with financial impact
- Shopify platform ownership facts
- Legal framework references
- Evidence file references

## How to Use

### Viewing the Timeline

1. **Open in Browser:**
   ```bash
   # From repository root
   open forensic-events-timeline-visualization.html
   # Or on Linux
   xdg-open forensic-events-timeline-visualization.html
   ```

2. **Filter by Category:**
   - Click "All Events" to see complete timeline
   - Click "Revenue Theft" to see R3.14M in revenue-related crimes
   - Click "Family Trust" to see R2.85M in trust violations
   - Click "Financial Flows" to see R4.28M in financial crimes

3. **Review Shopify Connections:**
   - Events with yellow connection boxes show direct links to Shopify platform
   - Each connection explains how the event relates to RegimA Zone Ltd's platform payments

### Understanding the Data

The visualization organizes 15 forensic events chronologically:

**Revenue Theft Category (5 events - R3.14M+):**
1. 2025-04-14: Bank Account Change Letter
2. 2025-05-22: Shopify Audit Trail Hijacking ⭐ CRITICAL
3. 2025-05-29: Domain Registration (Identity Fraud)
4. 2025-06-20: Email Impersonation Pattern
5. 2025-07-08: Warehouse POPI Violations

**Family Trust Violations (5 events - R2.85M+):**
6. 2025-03-15: Trust Structure Establishment
7. 2025-05-02: Unauthorized Beneficiary Changes
8. 2025-06-18: Systematic Trust Violations
9. 2025-07-25: Trust Asset Misappropriation
10. 2025-08-10: Trust Breach Evidence

**Financial Flows (5 events - R4.28M+):**
11. 2025-04-01: Payment Redirection Scheme
12. 2025-05-15: Unauthorized Transfers (R850K+)
13. 2025-06-30: Coordinated Fund Diversions
14. 2025-07-12: Account Manipulation
15. 2025-08-20: Financial Evidence Concealment

## Key Insights

### The Shopify Platform Revelation

The most critical finding across all events is that **RWD ZA has no independent revenue stream:**

1. **Platform Ownership:** RegimA Zone Ltd (UK) owns the Shopify platform
2. **Platform Funding:** Daniel & Jacqueline's UK company has paid all Shopify invoices since July 2023
3. **Platform Operations:** Dan and Jax operated the platform that generated all "RWD revenue"
4. **RWD's Role:** RWD merely issued invoices for sales on infrastructure it did not own or fund

### Criminal Timeline Pattern

- **Duration:** March 15 to August 20, 2025 (158 days)
- **Active Criminal Days:** 156 days of continuous criminal activity
- **Peak Activity:** May-July 2025 (Shopify destruction, domain fraud, trust violations)
- **Evidence Destruction:** May 22 audit trail hijacking proves consciousness of guilt

### Financial Impact

| Category | Events | Documented Losses |
|----------|--------|-------------------|
| Revenue Theft | 5 | R3,141,647.70 |
| Family Trust | 5 | R2,851,247.35 |
| Financial Flows | 5 | R4,276,832.85 |
| **TOTAL** | **15** | **R10,269,727.90** |

## Integration with Case Evidence

### Evidence References

Each event in the JSON data includes `evidenceReferences` pointing to:
- Forensic analysis directories in `backups/pre-consolidation/jax-response/`
- Category-specific subdirectories (revenue-theft, family-trust, financial-flows)
- Individual event folders with detailed documentation

### Cross-References

The timeline visualization integrates with:
- **RWD Revenue Integrity Analysis:** `jax-response/AD/1-Critical/RWD_REVENUE_INTEGRITY_ANALYSIS.md`
- **Comprehensive Timeline:** `affidavit_work/analysis/COMPREHENSIVE_TIMELINE_ANALYSIS.md`
- **Forensic Analysis READMEs:** Category-level documentation in jax-response directories

## Technical Details

### Technologies Used

- **HTML5:** Semantic structure for timeline
- **CSS3:** Gradient backgrounds, animations, responsive design
- **Vanilla JavaScript:** No external dependencies, lightweight and fast
- **JSON:** Structured data storage for programmatic access

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design adapts to all screen sizes

### Accessibility

- High-contrast color schemes for category differentiation
- Clear date formatting
- Readable font sizes
- Hover effects for enhanced interactivity
- Filter controls for focused viewing

## Future Enhancements

Potential improvements for future versions:

1. **Export Functionality:** Generate PDF reports or printable versions
2. **Date Range Filtering:** Select specific date ranges for detailed analysis
3. **Search Capability:** Search events by keyword or perpetrator
4. **Evidence Links:** Direct links to evidence files in repository
5. **Timeline Zoom:** Interactive zoom for date range focus
6. **Comparison Mode:** Side-by-side comparison of event categories

## Maintenance

### Updating Events

To add or modify events:

1. Edit `forensic-events-data.json` with new event data
2. Update the `forensicEvents` array in the HTML file's `<script>` section
3. Maintain chronological order by date
4. Include `shopifyConnection` and `shopifyNote` for relevant events

### Version History

- **v1.0 (2025-10-23):** Initial release with all 15 forensic events and Shopify revelation integration

## Legal Significance

This visualization serves as:

1. **Case Overview Tool:** Quick reference for all documented criminal activities
2. **Pattern Evidence:** Demonstrates systematic coordination across categories
3. **Shopify Platform Proof:** Visual representation of RWD's lack of independent revenue
4. **Court Presentation:** Professional timeline for legal proceedings
5. **Expert Testimony Support:** Foundation for forensic accounting analysis

## References

### Source Documentation

- `todo/Repository_Status_and_Critical_Evidence_Collection.md` - Line 152 (original task)
- `backups/pre-consolidation/jax-response/revenue-theft/README.md` - Revenue theft analysis
- `backups/pre-consolidation/jax-response/family-trust/README.md` - Trust violations
- `backups/pre-consolidation/jax-response/financial-flows/README.md` - Financial crimes
- `jax-response/AD/1-Critical/RWD_REVENUE_INTEGRITY_ANALYSIS.md` - Shopify platform evidence

### Legal Framework References

- **POCA (Prevention of Organised Crime Act) 121 of 1998:** Sections 2-3, 37-38
- **ECTA (Electronic Communications and Transactions Act) 25 of 2002:** Sections 86-88
- **Trust Property Control Act 57 of 1988:** Sections 12, 20, 26
- **Banks Act 94 of 1990:** Sections 78, 91
- **FIC Act (Financial Intelligence Centre Act) 38 of 2001:** Sections 34, 45

## Contact and Support

For questions about the timeline visualization or underlying forensic analysis:

- Review case documentation in repository
- Consult with legal team for interpretation
- Reference original evidence files in `backups/pre-consolidation/jax-response/`

---

**Last Updated:** October 23, 2025  
**Case Number:** 2025-137857  
**Documentation Status:** Complete - All 15 forensic events visualized with Shopify platform revelation integrated
