# Hierarchical Issue Framework - Grammar Documentation

## Overview

This directory contains formal grammar specifications for the Hierarchical Issue Framework, enabling structured definition and parsing of legal argument hierarchies.

## Files

### ANTLR Grammar
- **`HierarchicalIssue.g4`** - ANTLR4 grammar definition
  - Defines complete lexer and parser rules
  - Supports syntax highlighting in IDEs
  - Can generate parsers for multiple languages (Java, Python, C++, JavaScript)

### Yacc/Lex Grammar
- **`hierarchy.y`** - Yacc parser specification
  - Defines grammar rules and semantic actions
  - Generates C parser code
  - Includes AST node construction

- **`hierarchy.l`** - Lex lexer specification
  - Tokenizes input for yacc parser
  - Handles keywords, identifiers, strings, numbers
  - Skips whitespace and comments

### Example Input
- **`example_hierarchy.hi`** - Example hierarchical issue definition
  - Demonstrates the syntax
  - Can be parsed by generated parsers
  - Shows real case structure (Case 2025-137857)

## Building

### ANTLR4

```bash
# Generate Java parser
antlr4 HierarchicalIssue.g4
javac *.java

# Parse example
grun HierarchicalIssue document -tree < example_hierarchy.hi

# Generate Python parser
antlr4 -Dlanguage=Python3 HierarchicalIssue.g4

# Generate JavaScript parser
antlr4 -Dlanguage=JavaScript HierarchicalIssue.g4
```

### Yacc/Lex

```bash
# Generate lexer
lex hierarchy.l

# Generate parser
yacc -d hierarchy.y

# Compile (requires hierarchy_ast.h)
gcc -o hierarchy_parser y.tab.c lex.yy.c -ll

# Parse example
./hierarchy_parser example_hierarchy.hi
```

## Syntax Reference

### Document Structure

```
document ::= argument+

argument ::= 'argument' IDENTIFIER '{' argumentBody '}'

argumentBody ::= 
    'type' ':' ('defense' | 'offense' | 'counterclaim' | 'support') ';'
    'description' ':' STRING ';'
    'strategy' ':' STRING ';'
    ['status' ':' ('active' | 'inactive' | 'completed') ';']
    'features' '{' feature* '}'

feature ::= 'feature' NUMBER '{' featureBody '}'

featureBody ::=
    'title' ':' STRING ';'
    'description' ':' STRING ';'
    'priority' ':' ('critical' | 'high' | 'medium' | 'low') ';'
    ['link_strength' ':' NUMBER ';']
    'paragraphs' '{' paragraph* '}'

paragraph ::= 'paragraph' NUMBER '{' paragraphBody '}'

paragraphBody ::=
    'title' ':' STRING ';'
    'content' ':' STRING ';'
    'rank' ':' NUMBER ';'
    'weight' ':' NUMBER ';'
    'tasks' '{' task* '}'

task ::= 'task' NUMBER '{' taskBody '}'

taskBody ::=
    'title' ':' STRING ';'
    'description' ':' STRING ';'
    'priority' ':' ('critical' | 'high' | 'medium' | 'low') ';'
    'rank' ':' NUMBER ';'
    'weight' ':' NUMBER ';'
```

### Validation Rules

1. **Rank**: Must be >= 1
2. **Weight**: Must be 0-100
3. **Issue Numbers**: Must be unique within document
4. **Ranks**: Should be unique within a paragraph (for tasks)

### Comments

```
// Line comment

/* Block
   comment */
```

## Example

```c
argument revenue_defense {
    type: defense;
    description: "Prove legitimate investment";
    strategy: "Show R1M investment vs R1K fee";
    
    features {
        feature 1001 {
            title: "Payment Analysis";
            description: "Detailed payment flow analysis";
            priority: critical;
            
            paragraphs {
                paragraph 1 {
                    title: "Investment Evidence";
                    content: "RegimA Zone Ltd invested R1M";
                    rank: 1;
                    weight: 100;
                    
                    tasks {
                        task 2001 {
                            title: "Document transfer";
                            description: "Get bank records";
                            priority: critical;
                            rank: 1;
                            weight: 100;
                        }
                    }
                }
            }
        }
    }
}
```

## AST Structure

The parsers build an Abstract Syntax Tree (AST) with the following structure:

```
HierarchyRoot
├── Argument
│   ├── name: string
│   ├── type: enum
│   ├── description: string
│   ├── strategy: string
│   ├── status: enum
│   └── features: Feature[]
│       └── Feature
│           ├── number: int
│           ├── title: string
│           ├── description: string
│           ├── priority: enum
│           ├── linkStrength: int
│           └── paragraphs: Paragraph[]
│               └── Paragraph
│                   ├── number: int
│                   ├── title: string
│                   ├── content: string
│                   ├── rank: int
│                   ├── weight: int
│                   └── tasks: Task[]
│                       └── Task
│                           ├── number: int
│                           ├── title: string
│                           ├── description: string
│                           ├── priority: enum
│                           ├── rank: int
│                           └── weight: int
```

## Integration

### With Database

Parsed AST can be converted to database operations:

```javascript
// Pseudocode
function importFromAST(ast, manager) {
    for (const arg of ast.arguments) {
        const argId = manager.createLegalArgument(
            arg.name, arg.description, arg.type, arg.strategy
        );
        
        for (const feat of arg.features) {
            const featId = manager.createFeatureIssue(
                feat.number, feat.title, feat.description,
                feat.priority, argId
            );
            
            for (const para of feat.paragraphs) {
                const paraId = manager.createParagraph(
                    featId, para.number, para.title,
                    para.content, para.rank, para.weight
                );
                
                for (const task of para.tasks) {
                    manager.createTaskIssue(
                        task.number, task.title, task.description,
                        featId, paraId, task.rank, task.weight,
                        task.priority
                    );
                }
            }
        }
    }
}
```

### Export to File

Database contents can be exported to `.hi` format:

```javascript
function exportToFile(argumentId, manager) {
    const hierarchy = manager.getArgumentHierarchy(argumentId);
    return generateHIFile(hierarchy);
}
```

## Tools

### Syntax Highlighting

For VS Code, create `.vscode/extensions/hi-syntax/syntaxes/hi.tmLanguage.json`:

```json
{
    "scopeName": "source.hi",
    "patterns": [
        {
            "match": "\\b(argument|feature|paragraph|task|features|paragraphs|tasks)\\b",
            "name": "keyword.control.hi"
        },
        {
            "match": "\\b(type|title|description|strategy|status|priority|content|rank|weight|link_strength)\\b",
            "name": "keyword.other.hi"
        },
        {
            "match": "\\b(defense|offense|counterclaim|support|active|inactive|completed|critical|high|medium|low)\\b",
            "name": "constant.language.hi"
        },
        {
            "match": "\\b[0-9]+\\b",
            "name": "constant.numeric.hi"
        },
        {
            "match": "\"[^\"]*\"",
            "name": "string.quoted.double.hi"
        }
    ]
}
```

## License

Part of the Hierarchical Issue Framework
Case 2025-137857
