#!/usr/bin/env python3
"""
Comprehensive Evidence Index Generator
Creates a complete index mapping all 1700+ files in the repository.
"""

import os
import json
import hashlib
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import mimetypes

def get_file_type_category(filepath):
    """Categorize file based on extension and path."""
    ext = Path(filepath).suffix.lower()
    name = Path(filepath).name.lower()
    parent = str(Path(filepath).parent).lower()
    
    # Evidence categories
    if '/annexures/' in parent or '/evidence/' in parent:
        return 'Evidence'
    elif '/affidavit' in parent:
        return 'Affidavit'
    elif '/analysis' in parent:
        return 'Analysis'
    elif 'criminal' in parent:
        return 'Criminal Case'
    elif 'civil' in parent:
        return 'Civil Response'
    elif '/jax-response/' in parent or '/jax-dan-response/' in parent:
        return 'Jax Response'
    elif '/docs/' in parent or '/todo/' in parent:
        return 'Documentation'
    elif '/scripts/' in parent or ext in ['.py', '.js', '.sh']:
        return 'Scripts/Tools'
    elif '/tests/' in parent or 'test_' in name or '_test' in name:
        return 'Testing'
    elif ext in ['.json', '.yaml', '.yml', '.xml']:
        return 'Configuration/Data'
    elif ext in ['.md', '.txt', '.docx', '.pdf']:
        return 'Documents'
    elif ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']:
        return 'Images'
    elif ext in ['.eml', '.msg']:
        return 'Email Correspondence'
    elif ext in ['.xlsx', '.xls', '.csv']:
        return 'Spreadsheets'
    else:
        return 'Other'

def extract_evidence_codes(filepath):
    """Extract evidence reference codes (JF-, PF-, etc.) from file path and name."""
    codes = set()
    path_str = str(filepath).upper()
    name = Path(filepath).name.upper()
    
    # Common evidence code patterns
    patterns = [
        'JF', 'PF', 'DJF', 'JAX', 'JF-', 'PF-',
        'JF1', 'JF2', 'JF3', 'JF4', 'JF5', 'JF6', 'JF7', 'JF8', 'JF9', 'JF10',
        'PF1', 'PF2', 'PF3', 'PF4', 'PF5', 'PF6', 'PF7', 'PF8', 'PF9', 'PF10'
    ]
    
    for pattern in patterns:
        if pattern in path_str or pattern in name:
            codes.add(pattern)
    
    return sorted(list(codes))

def get_file_info(filepath, repo_root):
    """Get comprehensive information about a file."""
    abs_path = Path(repo_root) / filepath
    rel_path = str(filepath)
    
    try:
        stat = abs_path.stat()
        size = stat.st_size
        modified = datetime.fromtimestamp(stat.st_mtime).isoformat()
    except:
        size = 0
        modified = "Unknown"
    
    mime_type, _ = mimetypes.guess_type(str(abs_path))
    
    return {
        'path': rel_path,
        'name': abs_path.name,
        'extension': abs_path.suffix,
        'size_bytes': size,
        'size_human': format_size(size),
        'category': get_file_type_category(rel_path),
        'evidence_codes': extract_evidence_codes(rel_path),
        'mime_type': mime_type or 'Unknown',
        'modified': modified,
        'directory': str(abs_path.parent.relative_to(repo_root))
    }

def format_size(size_bytes):
    """Format file size in human-readable format."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"

def scan_repository(repo_root):
    """Scan entire repository and collect file information."""
    repo_path = Path(repo_root)
    files = []
    
    # Directories to skip
    skip_dirs = {'.git', '__pycache__', 'node_modules', '.pytest_cache', '.venv'}
    
    for root, dirs, filenames in os.walk(repo_path):
        # Remove skip directories from dirs list (modifies in-place)
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        
        for filename in filenames:
            filepath = Path(root) / filename
            try:
                rel_path = filepath.relative_to(repo_path)
                file_info = get_file_info(rel_path, repo_path)
                files.append(file_info)
            except Exception as e:
                print(f"Error processing {filepath}: {e}")
    
    return files

def generate_statistics(files):
    """Generate statistics about the repository."""
    stats = {
        'total_files': len(files),
        'total_size_bytes': sum(f['size_bytes'] for f in files),
        'by_category': defaultdict(lambda: {'count': 0, 'size': 0}),
        'by_extension': defaultdict(lambda: {'count': 0, 'size': 0}),
        'by_directory': defaultdict(lambda: {'count': 0, 'size': 0}),
        'evidence_codes_count': defaultdict(int)
    }
    
    for file in files:
        # By category
        cat = file['category']
        stats['by_category'][cat]['count'] += 1
        stats['by_category'][cat]['size'] += file['size_bytes']
        
        # By extension
        ext = file['extension'] or 'no-extension'
        stats['by_extension'][ext]['count'] += 1
        stats['by_extension'][ext]['size'] += file['size_bytes']
        
        # By directory (top-level only)
        parts = Path(file['directory']).parts
        top_dir = parts[0] if parts else 'root'
        stats['by_directory'][top_dir]['count'] += 1
        stats['by_directory'][top_dir]['size'] += file['size_bytes']
        
        # Evidence codes
        for code in file['evidence_codes']:
            stats['evidence_codes_count'][code] += 1
    
    # Convert defaultdicts to regular dicts
    stats['by_category'] = dict(stats['by_category'])
    stats['by_extension'] = dict(stats['by_extension'])
    stats['by_directory'] = dict(stats['by_directory'])
    stats['evidence_codes_count'] = dict(stats['evidence_codes_count'])
    
    # Add human-readable total size
    stats['total_size_human'] = format_size(stats['total_size_bytes'])
    
    return stats

def create_json_index(files, stats, output_path):
    """Create JSON version of the evidence index."""
    index = {
        'metadata': {
            'generated': datetime.now().isoformat(),
            'repository': 'cogpy/ad-res-j7',
            'case': 'Case 2025-137857',
            'version': '1.0',
            'total_files': stats['total_files'],
            'total_size': stats['total_size_human']
        },
        'statistics': stats,
        'files': files
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
    
    print(f"✅ JSON index created: {output_path}")

def create_markdown_index(files, stats, output_path):
    """Create Markdown version of the evidence index."""
    lines = [
        "# COMPREHENSIVE EVIDENCE INDEX",
        "## Case 2025-137857: Complete Repository File Mapping",
        "",
        f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  ",
        f"**Total Files:** {stats['total_files']:,}  ",
        f"**Total Size:** {stats['total_size_human']}  ",
        f"**Repository:** cogpy/ad-res-j7",
        "",
        "---",
        "",
        "## Executive Summary",
        "",
        f"This comprehensive evidence index maps all {stats['total_files']:,} files in the ad-res-j7 repository,",
        "providing a complete catalog of evidence, documentation, analysis, and supporting materials for",
        "Case 2025-137857 (Jacqueline Faucitt and Daniel James Faucitt vs Peter Faucitt).",
        "",
        "---",
        "",
        "## Statistics Overview",
        "",
        "### Files by Category",
        "",
        "| Category | File Count | Total Size |",
        "|----------|------------|------------|"
    ]
    
    # Sort categories by count
    sorted_cats = sorted(stats['by_category'].items(), 
                        key=lambda x: x[1]['count'], 
                        reverse=True)
    
    for cat, data in sorted_cats:
        lines.append(f"| {cat} | {data['count']:,} | {format_size(data['size'])} |")
    
    lines.extend([
        "",
        "### Top File Extensions",
        "",
        "| Extension | File Count | Total Size |",
        "|-----------|------------|------------|"
    ])
    
    # Sort extensions by count, top 20
    sorted_exts = sorted(stats['by_extension'].items(), 
                        key=lambda x: x[1]['count'], 
                        reverse=True)[:20]
    
    for ext, data in sorted_exts:
        lines.append(f"| {ext} | {data['count']:,} | {format_size(data['size'])} |")
    
    lines.extend([
        "",
        "### Top-Level Directories",
        "",
        "| Directory | File Count | Total Size |",
        "|-----------|------------|------------|"
    ])
    
    # Sort directories by count
    sorted_dirs = sorted(stats['by_directory'].items(), 
                        key=lambda x: x[1]['count'], 
                        reverse=True)
    
    for dir_name, data in sorted_dirs:
        lines.append(f"| {dir_name} | {data['count']:,} | {format_size(data['size'])} |")
    
    if stats['evidence_codes_count']:
        lines.extend([
            "",
            "### Evidence Code References",
            "",
            "| Evidence Code | File Count |",
            "|---------------|------------|"
        ])
        
        sorted_codes = sorted(stats['evidence_codes_count'].items(), 
                            key=lambda x: x[1], 
                            reverse=True)
        
        for code, count in sorted_codes:
            lines.append(f"| {code} | {count:,} |")
    
    lines.extend([
        "",
        "---",
        "",
        "## Complete File Listing by Category",
        ""
    ])
    
    # Group files by category
    files_by_category = defaultdict(list)
    for file in files:
        files_by_category[file['category']].append(file)
    
    # Sort categories by file count
    for cat in [c for c, _ in sorted_cats]:
        cat_files = sorted(files_by_category[cat], key=lambda x: x['path'])
        
        lines.extend([
            f"### {cat} ({len(cat_files):,} files)",
            "",
            "| File Path | Size | Evidence Codes |",
            "|-----------|------|----------------|"
        ])
        
        for file in cat_files:
            codes = ', '.join(file['evidence_codes']) if file['evidence_codes'] else '-'
            lines.append(f"| {file['path']} | {file['size_human']} | {codes} |")
        
        lines.append("")
    
    lines.extend([
        "---",
        "",
        "## Directory Structure Index",
        "",
        "Complete directory-by-directory listing:",
        ""
    ])
    
    # Group by directory
    files_by_dir = defaultdict(list)
    for file in files:
        files_by_dir[file['directory']].append(file)
    
    for directory in sorted(files_by_dir.keys()):
        dir_files = sorted(files_by_dir[directory], key=lambda x: x['name'])
        dir_size = sum(f['size_bytes'] for f in dir_files)
        
        lines.extend([
            f"### `{directory}/` ({len(dir_files)} files, {format_size(dir_size)})",
            ""
        ])
        
        for file in dir_files:
            codes = f" [{', '.join(file['evidence_codes'])}]" if file['evidence_codes'] else ""
            lines.append(f"- **{file['name']}** ({file['size_human']}){codes}")
        
        lines.append("")
    
    lines.extend([
        "---",
        "",
        "## Usage Guide",
        "",
        "### Finding Evidence by Code",
        "",
        "Use the Evidence Code References table above to identify how many files reference",
        "each evidence code (JF1-JF10, PF1-PF10, etc.). Then search the Complete File Listing",
        "by Category section for the specific evidence code.",
        "",
        "### Finding Files by Type",
        "",
        "Use the Files by Category section to quickly locate all files of a specific type:",
        "- **Evidence**: Court annexures and supporting evidence",
        "- **Affidavit**: Affidavit drafts and versions",
        "- **Analysis**: Legal and financial analysis documents",
        "- **Documentation**: Repository guides and references",
        "",
        "### Repository Navigation",
        "",
        "Use the Directory Structure Index to browse files by their location in the repository.",
        "Each directory listing shows file counts and total sizes.",
        "",
        "---",
        "",
        "## Maintenance Notes",
        "",
        "This index is automatically generated using `scripts/generate_comprehensive_evidence_index.py`.",
        "To regenerate after adding or modifying files:",
        "",
        "```bash",
        "python scripts/generate_comprehensive_evidence_index.py",
        "```",
        "",
        "---",
        "",
        f"**Last Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  ",
        "**Script:** `scripts/generate_comprehensive_evidence_index.py`  ",
        "**Repository:** https://github.com/cogpy/ad-res-j7"
    ])
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    print(f"✅ Markdown index created: {output_path}")

def main():
    """Main execution function."""
    repo_root = Path(__file__).parent.parent
    
    print("🔍 Scanning repository...")
    files = scan_repository(repo_root)
    
    print(f"📊 Found {len(files):,} files")
    print("📈 Generating statistics...")
    stats = generate_statistics(files)
    
    print("📝 Creating JSON index...")
    json_path = repo_root / 'COMPREHENSIVE_EVIDENCE_INDEX.json'
    create_json_index(files, stats, json_path)
    
    print("📄 Creating Markdown index...")
    md_path = repo_root / 'COMPREHENSIVE_EVIDENCE_INDEX.md'
    create_markdown_index(files, stats, md_path)
    
    print("\n✅ Complete!")
    print(f"\nIndex Statistics:")
    print(f"  Total Files: {stats['total_files']:,}")
    print(f"  Total Size: {stats['total_size_human']}")
    print(f"  Categories: {len(stats['by_category'])}")
    print(f"  Extensions: {len(stats['by_extension'])}")
    print(f"  Directories: {len(stats['by_directory'])}")
    if stats['evidence_codes_count']:
        print(f"  Evidence Codes: {len(stats['evidence_codes_count'])}")
    
    print(f"\n📍 Output files:")
    print(f"  - {json_path}")
    print(f"  - {md_path}")

if __name__ == '__main__':
    main()
