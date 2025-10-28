# GitHub Actions Workflows

## Create Issues from Structured Todo

**Workflow File:** `create-issues-from-todo.yml`

This workflow automatically creates GitHub issues from the structured todo file at `todo/structured-todo.json`.

### Features

- ✅ Creates issues with full task details (priority, source, IDs)
- ✅ Supports dry-run mode to preview without creating
- ✅ Batch processing to create a limited number of issues
- ✅ Automatic rate limiting to avoid API throttling
- ✅ Detailed summary reports
- ✅ Handles special characters and unicode properly

### How to Run

#### Option 1: GitHub Web Interface

1. Go to the **Actions** tab in your repository
2. Select **"Create Issues from Structured Todo"** workflow
3. Click **"Run workflow"** button
4. Configure options:
   - **Dry run:** Choose `true` to preview without creating issues
   - **Batch size:** Enter number of issues to create (0 = all 146 issues)
5. Click **"Run workflow"**

#### Option 2: GitHub CLI

```bash
# Create all issues
gh workflow run create-issues-from-todo.yml

# Dry run (preview only)
gh workflow run create-issues-from-todo.yml \
  -f dry_run=true

# Create first 10 issues only
gh workflow run create-issues-from-todo.yml \
  -f batch_size=10

# Dry run for first 5 issues
gh workflow run create-issues-from-todo.yml \
  -f dry_run=true \
  -f batch_size=5
```

#### Option 3: GitHub API

```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/cogpy/ad-res-j7/actions/workflows/create-issues-from-todo.yml/dispatches \
  -d '{"ref":"main","inputs":{"dry_run":"false","batch_size":"0"}}'
```

### Workflow Inputs

| Input | Description | Default | Options |
|-------|-------------|---------|---------|
| `dry_run` | Preview issues without creating them | `false` | `true`, `false` |
| `batch_size` | Number of issues to create (0 = all) | `0` | Any number |

### Task Summary

The workflow will create issues from **146 tasks** with the following priority distribution:

- **Critical:** 2 tasks
- **High:** 4 tasks
- **Medium:** 123 tasks
- **Low:** 17 tasks

### Issue Format

Each created issue will include:

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

### Workflow Steps

1. **Checkout repository** - Gets the latest code
2. **Setup jq** - Installs JSON processor
3. **Validate JSON** - Ensures structured-todo.json is valid
4. **Parse summary** - Displays task statistics
5. **Create issues** - Generates GitHub issues
6. **Create report** - Produces summary in workflow output

### Permissions

The workflow requires:
- `issues: write` - To create issues
- `contents: read` - To read the repository files

These are automatically granted via `GITHUB_TOKEN`.

### Rate Limiting

The workflow includes:
- 0.5 second delay between issue creations
- Batch processing support to create issues in chunks
- Automatic retry logic (built into `gh` CLI)

### Monitoring Progress

1. Go to **Actions** tab
2. Click on the running workflow
3. View real-time logs showing:
   - Task summary
   - Progress for each issue
   - Success/failure status
   - Final summary report

### Troubleshooting

#### Workflow fails with "Invalid JSON"

**Solution:** Validate the JSON file:
```bash
jq empty todo/structured-todo.json
```

#### Issues fail to create

**Possible causes:**
- Rate limiting (wait and retry)
- Invalid characters in title/body (check logs)
- Permission issues (verify workflow permissions)

**Solution:** Use batch mode to create issues in smaller chunks:
```bash
gh workflow run create-issues-from-todo.yml -f batch_size=10
```

#### Want to test without creating issues

**Solution:** Use dry-run mode:
```bash
gh workflow run create-issues-from-todo.yml -f dry_run=true
```

### Best Practices

1. **Test first:** Always run with `dry_run=true` initially
2. **Start small:** Use `batch_size=5` to test with a few issues
3. **Monitor rate limits:** GitHub allows ~5000 requests/hour
4. **Check duplicates:** Verify issues don't already exist
5. **Review logs:** Check workflow summary for any failures

### Example Usage Scenarios

#### Scenario 1: First Time Setup
```bash
# Step 1: Dry run to preview
gh workflow run create-issues-from-todo.yml -f dry_run=true -f batch_size=5

# Step 2: Create first 5 issues
gh workflow run create-issues-from-todo.yml -f batch_size=5

# Step 3: If successful, create all remaining
gh workflow run create-issues-from-todo.yml
```

#### Scenario 2: Create High Priority Only
```bash
# Manually filter in structured-todo.json or create separate workflow
# For now, create all and manually close low priority ones
gh workflow run create-issues-from-todo.yml
```

#### Scenario 3: Incremental Creation
```bash
# Day 1: Create 20 issues
gh workflow run create-issues-from-todo.yml -f batch_size=20

# Day 2: Create next 20 issues
# Note: This will create the first 20 again. 
# Consider modifying the JSON file to remove completed tasks
gh workflow run create-issues-from-todo.yml -f batch_size=20
```

### Workflow Output

The workflow produces a detailed summary including:

```
## Task Summary
- Total Tasks: 146
- Critical: 2
- High: 4
- Medium: 123
- Low: 17

## Results
- ✅ Created: 146
- ❌ Failed: 0
- 📊 Total: 146

## Workflow Information
- Repository: cogpy/ad-res-j7
- Workflow: Create Issues from Structured Todo
- Run ID: [run_id]
- Triggered by: [username]
- Dry Run: false
- Batch Size: 0 (0 = all)
```

### Next Steps After Running

1. Review created issues in the **Issues** tab
2. Add labels manually if needed (workflow can't due to OAuth restrictions)
3. Assign issues to team members
4. Create milestones and add issues to them
5. Link related issues together

### Maintenance

To update the workflow:

1. Edit `.github/workflows/create-issues-from-todo.yml`
2. Commit and push changes
3. Workflow will use the latest version on next run

### Support

For issues or questions:
- Check workflow logs in Actions tab
- Review `ISSUE_GENERATION_REPORT.md` for details
- Verify `todo/structured-todo.json` is valid JSON
