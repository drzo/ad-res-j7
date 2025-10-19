# Repository Access Instructions
## How to Connect and Analyze the Missing Repositories

---

## Problem Statement

We need to access and analyze 4 additional GitHub repositories that are currently inaccessible:
- `EchoCog/analysss`
- `rzonedevops/analysis`
- `rzonedevops/avtomaatoctory`
- `rzonedevops/analyticase`

---

## Step 1: Verify Repository URLs

### Direct Access Attempts

Try accessing these URLs directly in your browser:

1. https://github.com/EchoCog/analysss
2. https://github.com/rzonedevops/analysis
3. https://github.com/rzonedevops/avtomaatoctory
4. https://github.com/rzonedevops/analyticase

### If You Get 404 Errors

The repositories might be:
- **Private** - You need to be added as a collaborator
- **Renamed** - Check with the repository owners for new names
- **Deleted** - The repositories may no longer exist
- **Misspelled** - Verify the exact spelling with the owners

---

## Step 2: Gain Access to Private Repositories

### If Repositories Are Private

1. **Contact Repository Owners:**
   ```
   EchoCog - for analysss repository
   rzonedevops - for analysis, avtomaatoctory, analyticase repositories
   ```

2. **Request Collaborator Access:**
   - Ask to be added as a collaborator
   - Or request read-only access if that's sufficient

3. **Alternative: Request Repository Export**
   If direct access isn't possible, ask for:
   - ZIP export of the repository
   - Relevant files/folders only
   - Anonymized data if needed

---

## Step 3: Clone Repositories Locally

Once you have access, clone each repository:

```bash
# Clone the repositories
git clone https://github.com/EchoCog/analysss.git repo-analysis/analysss
git clone https://github.com/rzonedevops/analysis.git repo-analysis/analysis
git clone https://github.com/rzonedevops/avtomaatoctory.git repo-analysis/avtomaatoctory
git clone https://github.com/rzonedevops/analyticase.git repo-analysis/analyticase
```

---

## Step 4: Import Evidence into Database

### Automatic Import

Once repositories are cloned, run:

```bash
# Import documents from each repository
npm run db:import repo-analysis/analysss
npm run db:import repo-analysis/analysis
npm run db:import repo-analysis/avtomaatoctory
npm run db:import repo-analysis/analyticase
```

### Manual Evidence Scanning

For detailed analysis:

```bash
# Scan each repository individually
node repo-analysis/evidence-tracking.js scan analysss
node repo-analysis/evidence-tracking.js scan analysis
node repo-analysis/evidence-tracking.js scan avtomaatoctory
node repo-analysis/evidence-tracking.js scan analyticase

# Run full comparison
node repo-analysis/evidence-tracking.js compare
```

---

## Step 5: Update Cross-Repository Analysis

### Update Repository Configuration

Edit `repo-analysis/evidence-tracking.js` to update repository paths:

```javascript
this.repositories = [
  { 
    name: 'ad-res-j7', 
    owner: 'cogpy',
    url: 'https://github.com/cogpy/ad-res-j7',
    status: 'active',
    local_path: '.'
  },
  { 
    name: 'analysss', 
    owner: 'EchoCog',
    url: 'https://github.com/EchoCog/analysss',
    status: 'active',  // Update from 'unknown'
    local_path: 'repo-analysis/analysss'  // Add local path
  },
  // Update other repositories similarly...
];
```

---

## Step 6: Analyze and Cross-Link Evidence

### Run Complete Analysis

```bash
# Generate comprehensive comparison report
node repo-analysis/evidence-tracking.js compare

# View evidence gaps
node repo-analysis/evidence-tracking.js gaps

# Check specific evidence types
grep -r "email_forensics" repo-analysis/*/
grep -r "financial_analysis" repo-analysis/*/
```

### Database Queries

```sql
-- View all cross-repository documents
SELECT * FROM case_documents 
WHERE document_type = 'repository_comparison'
ORDER BY created_at DESC;

-- Find evidence across repositories
SELECT file_path, title, document_type 
FROM case_documents 
WHERE case_number = '2025-137857'
AND file_path LIKE 'repo-analysis/%';
```

---

## Alternative: Manual Evidence Mapping

If repositories remain inaccessible, create manual mappings:

### 1. Create Evidence Inventory

For each repository you know about, document:
- Known evidence types
- Document counts
- Key findings
- Missing pieces

### 2. Update CROSS_REPOSITORY_ANALYSIS.md

Manually update the evidence matrix with any information you have:
- Email correspondence about the repositories
- Screenshots or exports
- Shared documents
- Meeting notes

### 3. Track in Database

```javascript
// Add known evidence manually
const caseManager = require('./db/case-manager');
const cm = new CaseManager();

// Add evidence reference
await cm.addEvidence(
  '2025-137857',
  'external_repository',
  'Evidence from analysss repository',
  'repo-analysis/analysss/',
  'EchoCog/analysss'
);
```

---

## Troubleshooting

### Common Issues and Solutions

1. **"Repository not found" error**
   - Verify exact spelling and capitalization
   - Check if repository was renamed or moved
   - Ensure you're logged into GitHub

2. **"Permission denied" error**
   - You need to be added as a collaborator
   - Check if you're using the right GitHub account
   - Generate a personal access token for private repos

3. **"Rate limit exceeded" error**
   - Wait for rate limit reset (usually 1 hour)
   - Use authentication to increase limits
   - Clone repositories instead of API access

---

## Contact Information Needed

To complete the cross-repository analysis, we need:

1. **Repository Owners' GitHub Usernames**
   - Exact spelling of `EchoCog`
   - Exact spelling of `rzonedevops`

2. **Repository Access**
   - Collaborator invitations
   - Or repository exports

3. **Evidence Inventory**
   - What evidence is in each repository
   - Which documents are unique vs. duplicated
   - Priority items for the case

---

## Next Steps

1. **Immediate:** Try direct URL access to verify repository existence
2. **Today:** Contact repository owners for access
3. **This Week:** Clone accessible repositories
4. **Ongoing:** Run comparison analysis as repositories become available

---

## Questions to Ask Repository Owners

1. Are these repositories still active and available?
2. Can I be added as a collaborator (read-only is sufficient)?
3. If not, can you export the relevant case evidence?
4. Are there other related repositories I should know about?
5. Which repository has the most complete/current evidence?

---

Last Updated: 2025-10-15