# Quick Start: Create Issues from Structured Todo

This guide will help you create **146 GitHub issues** from `todo/structured-todo.json` using the automated workflow.

## ⚡ Quick Start (3 Steps)

### Step 1: Test with Dry Run

Go to GitHub and run the workflow in test mode:

1. Navigate to: [https://github.com/cogpy/ad-res-j7/actions](https://github.com/cogpy/ad-res-j7/actions)
2. Click **"Create Issues from Structured Todo"**
3. Click **"Run workflow"** button
4. Set:
   - **Dry run:** `true`
   - **Batch size:** `5`
5. Click **"Run workflow"**
6. Watch the logs to verify it works

### Step 2: Create Test Batch

Create your first 10 issues:

1. Go back to Actions tab
2. Click **"Run workflow"** again
3. Set:
   - **Dry run:** `false`
   - **Batch size:** `10`
4. Click **"Run workflow"**
5. Check the **Issues** tab to verify they were created correctly

### Step 3: Create All Issues

If the test batch looks good, create all remaining issues:

1. Go back to Actions tab
2. Click **"Run workflow"** again
3. Set:
   - **Dry run:** `false`
   - **Batch size:** `0` (means all)
4. Click **"Run workflow"**
5. Monitor progress in the Actions tab

## 📊 What Will Be Created

- **Total Issues:** 146
- **Critical Priority:** 2 issues
- **High Priority:** 4 issues
- **Medium Priority:** 123 issues
- **Low Priority:** 17 issues

## 🎯 Issue Format

Each issue will include:

```markdown
**Priority:** [critical|high|medium|low]
**Description:** [Task description]

---

**Source:** `[source file]` (line [number])
**Feature ID:** `[feature_id]`
**Paragraph ID:** `[paragraph_id]`
**Task ID:** `[task_id]`

---

*This issue was automatically generated from structured-todo.json*
```

## 🔧 Using GitHub CLI (Alternative)

If you prefer command line:

```bash
# Test first
gh workflow run create-issues-from-todo.yml \
  -f dry_run=true \
  -f batch_size=5

# Create 10 issues
gh workflow run create-issues-from-todo.yml \
  -f batch_size=10

# Create all issues
gh workflow run create-issues-from-todo.yml
```

## 📝 After Creation

Once issues are created:

1. **Review** them in the Issues tab
2. **Organize** by:
   - Adding labels (if you have permissions)
   - Creating milestones
   - Assigning to team members
3. **Prioritize** critical and high priority issues first
4. **Link** related issues together

## 🚨 Troubleshooting

### Workflow not visible?

- Make sure you've pushed the workflow file to GitHub
- Check that the file is at `.github/workflows/create-issues-from-todo.yml`

### Issues not creating?

- Check the workflow logs in the Actions tab
- Verify `todo/structured-todo.json` exists and is valid JSON
- Ensure you have write permissions to the repository

### Want to stop mid-creation?

- Cancel the workflow run in the Actions tab
- Already created issues will remain
- You can resume later with batch mode

## 📚 Full Documentation

For complete details, see:
- `.github/workflows/README.md` - Full workflow documentation
- `ISSUE_GENERATION_REPORT.md` - Technical details and analysis

## ⏱️ Estimated Time

- **Dry run:** ~30 seconds
- **10 issues:** ~1 minute
- **All 146 issues:** ~2-3 minutes

The workflow includes automatic rate limiting to avoid API throttling.

## ✅ Success Criteria

You'll know it worked when:
- Workflow shows green checkmark in Actions tab
- Issues appear in the Issues tab
- Summary report shows: "Created: 146, Failed: 0"

---

**Ready to start?** Go to the [Actions tab](https://github.com/cogpy/ad-res-j7/actions) and run the workflow!
