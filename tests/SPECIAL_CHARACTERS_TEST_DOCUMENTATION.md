# Special Characters Workflow Test Documentation

## Overview

This test validates the todo-to-issues workflow's ability to correctly handle tasks containing special characters, as specified in `todo/workflow-validation-tests.md` line 14 (Should-Do High Priority task).

## Test Coverage

The special characters workflow test (`tests/special-characters-workflow-test.js`) validates the following requirements from the workflow-validation-tests.md file:

### 1. Émojis and Unicode Characters (Line 47)
**Requirement:** "Test with émojis and ünicode characters in task descriptions"

**What's Tested:**
- Emoji characters (🚀, ✨, 🎯, etc.)
- Accented characters (é, ü, ñ, ç)
- International characters (日本語, Français, Español)
- UTF-8 file encoding preservation

**Example Test Cases:**
```markdown
1. Test with émojis and ünicode characters in task descriptions
2. Implement 🚀 rocket feature with ✨ sparkles and 🎯 targeting
3. Add support for Français, Español, and 日本語 internationalization
4. Create système de gestion with ñoño and Zürich compatibility
```

### 2. Quotes and Apostrophes (Line 48)
**Requirement:** "Validate proper handling of tasks with 'quotes' and 'apostrophes'"

**What's Tested:**
- Double quotes ("")
- Single quotes ('')
- Apostrophes in contractions (it's, don't, can't)
- Nested quotes ("quotes 'within' quotes")

**Example Test Cases:**
```markdown
1. Validate proper handling of tasks with "quotes" and 'apostrophes'
2. Test "double quotes" in task descriptions
3. Handle 'single quotes' correctly
4. Ensure it's, don't, and can't contractions work properly
```

### 3. Numbers, Percentages, and Symbols (Line 49)
**Requirement:** "Ensure correct processing of tasks with numbers: 123, percentages: 50%, and symbols: $@#"

**What's Tested:**
- Numeric values (123, 1,234.56, -456, +789)
- Percentage symbols (25%, 50%, 100%)
- Dollar signs ($1,000.00, €500)
- Special symbols ($, @, #, %, ^, &, *, etc.)
- Email addresses (user@example.com)
- Hashtags (#issue123)

**Example Test Cases:**
```markdown
1. Ensure correct processing of tasks with numbers: 123, percentages: 50%, and symbols: $@#
2. Process financial amounts like $1,000.00 and €500 correctly
3. Handle email addresses like user@example.com
4. Test hashtags like #issue123 and #feature-request
```

### 4. Markdown Formatting (Line 33)
**Requirement:** "Verify proper handling of tasks with markdown formatting **bold** and *italic* text"

**What's Tested:**
- Bold text (**bold**)
- Italic text (*italic* and _italic_)
- Inline code (`code`)
- Hyperlinks ([text](url))
- Strikethrough (~~text~~)
- Blockquotes (>)
- Mixed formatting

**Example Test Cases:**
```markdown
1. Process **bold text** in task descriptions correctly
2. Handle *italic text* and _underscored italic_ properly
3. Test `inline code` snippets within tasks
4. Validate [hyperlinks](https://github.com) and [named links](http://test.com)
5. Test mixed formatting: **bold** with *italic* and `code`
```

### 5. Long Task Descriptions (Lines 53-54)
**Requirement:** Test tasks that exceed 80 character GitHub issue title limit

**What's Tested:**
- Task descriptions longer than 80 characters
- Proper truncation to 80 characters with ellipsis
- Preservation of original task content
- No malformed issues created

**Example Test Cases:**
```markdown
1. This is an intentionally very long task description that exceeds the normal 80 character limit for GitHub issue titles to test the truncation functionality and ensure it works properly without breaking the workflow or creating malformed issues in the GitHub repository system

2. Another long task with specific requirements: implement comprehensive validation framework including unit tests, integration tests, performance benchmarks, security checks, error handling improvements, documentation updates, and thorough code review processes
```

### 6. Combined Special Characters
**What's Tested:**
- Multiple special character types in a single task
- Complex combinations of émojis, quotes, symbols, and markdown
- Real-world scenarios with mixed special characters

**Example Test Cases:**
```markdown
1. Implement système with 50% performance boost using $1,000 budget and 🚀 deployment
2. Test "quoted text" with émojis 🎯, numbers 123, and symbols @#$ together
3. Create feature with **bold** text, `code`, [links](http://test.com), and 25% completion
```

### 7. Workflow Integration
**What's Tested:**
- UTF-8 encoding in workflow files
- Label parameter handling
- Title processing and sanitization logic
- Length handling and truncation

## Running the Tests

### Run Special Characters Test Only
```bash
npm run test:special-characters
```

### Run All Tests (Including Special Characters)
```bash
npm test
```

## Test Results

The test creates a JSON results file at `tests/special-characters-test-results.json` containing:

```json
{
  "summary": {
    "total_tests": 53,
    "passed": 53,
    "failed": 0,
    "success_rate": 100.0,
    "duration": 0.01,
    "timestamp": "2025-10-21T19:00:00.000Z"
  },
  "test_results": [...],
  "errors": []
}
```

## What the Test Validates

1. **Parsing Accuracy**: Tasks with special characters are correctly extracted from markdown
2. **Character Preservation**: Special characters are preserved during parsing
3. **Title Generation**: Valid GitHub issue titles are created, even with special characters
4. **Markdown Removal**: Markdown formatting is properly stripped from titles
5. **Length Handling**: Long descriptions are truncated appropriately
6. **UTF-8 Support**: Unicode characters are handled correctly throughout
7. **Workflow Compatibility**: The workflow file has the necessary logic for special character handling

## Character Type Analysis

The test includes character type detection that identifies:
- `emoji`: Emoji characters (🚀, ✨, 🎯)
- `unicode`: Non-ASCII characters (é, ü, ñ)
- `quotes`: Quote marks (" and ')
- `numbers`: Numeric characters (0-9)
- `percentage`: Percentage symbols (%)
- `symbols`: Special symbols ($, @, #, etc.)
- `markdown_bold`: Bold markdown (**)
- `markdown_italic`: Italic markdown (* or _)
- `markdown_code`: Code markdown (`)
- `markdown_link`: Link markdown ([](url))

## Expected Behavior

### Successful Test Output
```
🚀 Starting Special Characters Workflow Tests...
📋 Testing requirements from todo/workflow-validation-tests.md (line 14)

✅ Passed: 53/53
❌ Failed: 0/53
📈 Success Rate: 100.0%
```

### Test Execution
1. Creates temporary test files with special characters
2. Parses tasks using workflow logic simulation
3. Generates issue content and validates output
4. Verifies character preservation and proper handling
5. Cleans up test files
6. Reports comprehensive results

## Integration with Workflow

The test validates that the todo-to-issues workflow (``.github/workflows/todo-to-issues.yml`) correctly:

1. Reads files with UTF-8 encoding
2. Parses tasks containing special characters
3. Generates valid GitHub issue titles
4. Handles markdown formatting
5. Truncates long descriptions appropriately
6. Creates issues without errors

## Continuous Integration

This test is part of the comprehensive test suite and runs:
- On every push to main branch
- On pull requests
- During scheduled test runs
- When manually triggered

## Related Files

- **Test File**: `tests/special-characters-workflow-test.js`
- **Test Requirements**: `todo/workflow-validation-tests.md` (line 14, lines 45-54)
- **Workflow File**: `.github/workflows/todo-to-issues.yml`
- **Test Results**: `tests/special-characters-test-results.json`
- **Package Script**: `npm run test:special-characters`

## Acceptance Criteria (Met)

✅ Review the task requirements in the source file  
✅ Implement the necessary changes  
✅ Test the implementation  
✅ Update documentation if needed  
✅ Ready to close the issue when complete  

## Summary

This comprehensive test validates that the todo-to-issues workflow correctly handles all types of special characters mentioned in the workflow-validation-tests.md file, ensuring robust and reliable task parsing regardless of the content complexity.
