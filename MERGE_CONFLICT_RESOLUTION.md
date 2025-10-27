# Merge Conflict Resolution Guide

## Conflict: `.github/workflows/todo-to-issues.yml`

### What Happened

This PR intentionally renames `todo-to-issues.yml` to `todo-to-issues.yml.disabled` to prevent the problematic workflow from running. However, the base branch may have had updates to the original file, creating a rename/delete conflict.

### Resolution Strategy

When resolving this conflict, you should:

1. **Accept the deletion** of `.github/workflows/todo-to-issues.yml`
2. **Keep** `.github/workflows/todo-to-issues.yml.disabled`

This is the intended behavior because:
- The workflow was creating 648 fragmented issues instead of ~12 consolidated ones
- Disabling it is critical to fixing the issue duplication problem
- The `.disabled` version preserves the workflow for future reference/fixing

### Command Line Resolution

```bash
# 1. Checkout the PR branch
git checkout copilot/reduce-issues-count

# 2. Merge the base branch
git merge main  # or master, depending on your default branch name

# 3. Resolve the conflict by accepting our changes (deletion + renamed file)
git rm .github/workflows/todo-to-issues.yml
git add .github/workflows/todo-to-issues.yml.disabled

# 4. Complete the merge
git commit -m "Resolve merge conflict: keep workflow disabled"

# 5. Push
git push origin copilot/reduce-issues-count
```

### GitHub Web UI Resolution

If resolving via GitHub's web interface:

1. Click "Resolve conflicts" button on the PR
2. For `.github/workflows/todo-to-issues.yml`:
   - Choose to **delete this file** (accept our changes)
3. Mark as resolved
4. Commit the merge

### Verification

After resolution, verify:
```bash
# File should NOT exist:
ls .github/workflows/todo-to-issues.yml
# Should output: No such file or directory

# Disabled file SHOULD exist:
ls .github/workflows/todo-to-issues.yml.disabled
# Should output: .github/workflows/todo-to-issues.yml.disabled
```

### Why This Is Correct

The entire purpose of this PR is to disable the problematic workflows that created 648 issues. Keeping the original `todo-to-issues.yml` active would defeat the purpose of the fix.

The workflow is preserved as `.disabled` so it can be:
- Referenced for understanding what went wrong
- Fixed and re-enabled in the future if needed
- Documented as part of the solution
