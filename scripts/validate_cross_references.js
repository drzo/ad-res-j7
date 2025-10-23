#!/usr/bin/env node

/**
 * Documentation Cross-Reference Validator
 * 
 * Validates that documentation properly cross-references evidence,
 * with special focus on RegimA Zone Ltd payment for Shopify platform.
 */

const fs = require('fs');
const path = require('path');

class DocumentationValidator {
  constructor(repoRoot = process.cwd()) {
    this.repoRoot = repoRoot;
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  /**
   * Check if a file exists
   */
  fileExists(filePath) {
    const fullPath = path.join(this.repoRoot, filePath);
    return fs.existsSync(fullPath);
  }

  /**
   * Read file content
   */
  readFile(filePath) {
    try {
      const fullPath = path.join(this.repoRoot, filePath);
      return fs.readFileSync(fullPath, 'utf8');
    } catch (error) {
      this.errors.push(`Failed to read ${filePath}: ${error.message}`);
      return null;
    }
  }

  /**
   * Validate Shopify platform ownership documentation
   */
  validateShopifyPlatformEvidence() {
    console.log('🔍 Validating Shopify Platform Ownership Evidence...');

    const evidencePoints = {
      'RegimA Zone Ltd': {
        patterns: [
          /RegimA Zone Ltd/gi,
          /RegimA Zone Limited/gi,
          /UK company/gi
        ],
        description: 'UK company owned by Dan & Jax',
        found: false,
        files: []
      },
      'Platform Payment': {
        patterns: [
          /R140,?000/gi,
          /R280,?000/gi,
          /platform payment/gi,
          /Shopify Plus/gi,
          /28 months/gi
        ],
        description: 'Evidence of R140k-R280k platform payments',
        found: false,
        files: []
      },
      'RWD ZA Revenue': {
        patterns: [
          /RWD ZA/gi,
          /no revenue stream/gi,
          /no independent revenue/gi
        ],
        description: 'Evidence that RWD ZA has no independent revenue',
        found: false,
        files: []
      },
      'Dan & Kay Shopify': {
        patterns: [
          /Dan & Kay/gi,
          /Dan and Kay/gi,
          /Shopify platform/gi
        ],
        description: 'Reference to Dan & Kay Shopify platform',
        found: false,
        files: []
      }
    };

    // Key files to check
    const keyFiles = [
      'FINAL_ANSWERING_AFFIDAVIT_ABRIDGED.md',
      'FINAL_ANSWERING_AFFIDAVIT_COMPLETE.md',
      'AFFIDAVIT_shopify_evidence_comprehensive.md',
      'COMPREHENSIVE_EVIDENCE_INDEX.md'
    ];

    // Directories to search
    const searchDirs = [
      'jax-response',
      'revenue-stream-hijacking-rynette',
      'FINAL_AFFIDAVIT_PACKAGE',
      'todo',
      'affidavit_work',
      'ANNEXURES'
    ];

    // Check key files first
    for (const file of keyFiles) {
      if (this.fileExists(file)) {
        const content = this.readFile(file);
        if (content) {
          this.checkEvidenceInFile(file, content, evidencePoints);
        }
      }
    }

    // Search directories
    for (const dir of searchDirs) {
      if (this.fileExists(dir)) {
        this.searchDirectory(dir, evidencePoints);
      }
    }

    // Report findings
    let allFound = true;
    for (const [category, data] of Object.entries(evidencePoints)) {
      if (data.found) {
        this.info.push(`✅ ${category}: Found in ${data.files.length} file(s)`);
      } else {
        this.warnings.push(`⚠️  ${category}: ${data.description} - Not well documented`);
        allFound = false;
      }
    }

    if (allFound) {
      console.log('✅ Shopify Platform Evidence validation complete - All key points documented');
    } else {
      console.log('⚠️  Shopify Platform Evidence validation complete - Some gaps found');
    }

    return evidencePoints;
  }

  /**
   * Check for evidence patterns in a file
   */
  checkEvidenceInFile(filePath, content, evidencePoints) {
    for (const [category, data] of Object.entries(evidencePoints)) {
      for (const pattern of data.patterns) {
        if (pattern.test(content)) {
          data.found = true;
          if (!data.files.includes(filePath)) {
            data.files.push(filePath);
          }
        }
      }
    }
  }

  /**
   * Recursively search directory for markdown files
   */
  searchDirectory(dirPath, evidencePoints) {
    try {
      const fullPath = path.join(this.repoRoot, dirPath);
      const items = fs.readdirSync(fullPath);

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const fullItemPath = path.join(this.repoRoot, itemPath);
        const stat = fs.statSync(fullItemPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          this.searchDirectory(itemPath, evidencePoints);
        } else if (stat.isFile() && item.endsWith('.md')) {
          const content = this.readFile(itemPath);
          if (content) {
            this.checkEvidenceInFile(itemPath, content, evidencePoints);
          }
        }
      }
    } catch (error) {
      // Directory doesn't exist or not accessible
    }
  }

  /**
   * Validate internal markdown links
   */
  validateInternalLinks() {
    console.log('🔍 Validating Internal Links...');

    const markdownFiles = this.findMarkdownFiles();
    let brokenLinks = 0;

    for (const file of markdownFiles) {
      const content = this.readFile(file);
      if (!content) continue;

      // Find markdown links [text](path)
      const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;

      while ((match = linkPattern.exec(content)) !== null) {
        const linkText = match[1];
        const linkPath = match[2];

        // Skip external links
        if (linkPath.startsWith('http://') || linkPath.startsWith('https://')) {
          continue;
        }

        // Skip anchors
        if (linkPath.startsWith('#')) {
          continue;
        }

        // Remove anchor from path
        const cleanPath = linkPath.split('#')[0];
        
        // Resolve relative path
        const fileDir = path.dirname(file);
        const absolutePath = path.resolve(path.join(this.repoRoot, fileDir), cleanPath);
        const relativePath = path.relative(this.repoRoot, absolutePath);

        if (!this.fileExists(relativePath)) {
          this.warnings.push(`Broken link in ${file}: [${linkText}](${linkPath})`);
          brokenLinks++;
        }
      }
    }

    if (brokenLinks === 0) {
      console.log('✅ Internal Links validation complete - No broken links found');
    } else {
      console.log(`⚠️  Internal Links validation complete - ${brokenLinks} broken links found`);
    }
  }

  /**
   * Find all markdown files in repository
   */
  findMarkdownFiles(dir = '.', files = []) {
    try {
      const fullPath = path.join(this.repoRoot, dir);
      const items = fs.readdirSync(fullPath);

      for (const item of items) {
        const itemPath = path.join(dir, item);
        const fullItemPath = path.join(this.repoRoot, itemPath);

        // Skip hidden directories, node_modules, and .git
        if (item.startsWith('.') || item === 'node_modules') {
          continue;
        }

        const stat = fs.statSync(fullItemPath);

        if (stat.isDirectory()) {
          this.findMarkdownFiles(itemPath, files);
        } else if (stat.isFile() && item.endsWith('.md')) {
          files.push(itemPath);
        }
      }
    } catch (error) {
      // Ignore inaccessible directories
    }

    return files;
  }

  /**
   * Run all validations
   */
  async runValidation() {
    console.log('🚀 Starting Documentation Validation');
    console.log('='.repeat(50));

    this.validateShopifyPlatformEvidence();
    this.validateInternalLinks();

    console.log('\n' + '='.repeat(50));
    console.log('📊 Validation Results:');

    if (this.errors.length > 0) {
      console.log(`\n❌ ${this.errors.length} Errors found:`);
      this.errors.forEach(error => console.log(`  • ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  ${this.warnings.length} Warnings:`);
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }

    if (this.info.length > 0) {
      console.log(`\n✅ ${this.info.length} Validations passed:`);
      this.info.forEach(info => console.log(`  • ${info}`));
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n🎉 All validations passed successfully!');
      return 0;
    } else if (this.errors.length === 0) {
      console.log(`\n✅ Validation completed with ${this.warnings.length} warnings`);
      return 0;
    } else {
      console.log(`\n💥 Validation failed with ${this.errors.length} errors`);
      return 1;
    }
  }
}

// Main execution
async function main() {
  const validator = new DocumentationValidator();
  const exitCode = await validator.runValidation();
  process.exit(exitCode);
}

if (require.main === module) {
  main();
}

module.exports = DocumentationValidator;
