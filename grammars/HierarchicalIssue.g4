/*
 * ANTLR4 Grammar for Hierarchical Issue Framework
 * Defines the syntax for declaring legal issue hierarchies
 */

grammar HierarchicalIssue;

// ============================================================================
// Parser Rules
// ============================================================================

/** Root rule - a document contains one or more legal arguments */
document
    : legalArgument+ EOF
    ;

/** Legal argument definition */
legalArgument
    : ARGUMENT identifier LBRACE argumentBody RBRACE
    ;

argumentBody
    : argumentType
      description
      strategy
      status?
      features
    ;

argumentType
    : TYPE COLON argumentTypeValue SEMICOLON
    ;

argumentTypeValue
    : DEFENSE | OFFENSE | COUNTERCLAIM | SUPPORT
    ;

description
    : DESCRIPTION COLON stringLiteral SEMICOLON
    ;

strategy
    : STRATEGY COLON stringLiteral SEMICOLON
    ;

status
    : STATUS COLON statusValue SEMICOLON
    ;

statusValue
    : ACTIVE | INACTIVE | COMPLETED
    ;

/** Feature issues collection */
features
    : FEATURES LBRACE feature* RBRACE
    ;

/** Individual feature issue */
feature
    : FEATURE issueNumber LBRACE featureBody RBRACE
    ;

featureBody
    : title
      featureDescription
      priority
      linkStrength?
      paragraphs
    ;

issueNumber
    : NUMBER
    ;

title
    : TITLE COLON stringLiteral SEMICOLON
    ;

featureDescription
    : DESCRIPTION COLON stringLiteral SEMICOLON
    ;

priority
    : PRIORITY COLON priorityValue SEMICOLON
    ;

priorityValue
    : CRITICAL | HIGH | MEDIUM | LOW
    ;

linkStrength
    : LINK_STRENGTH COLON weightValue SEMICOLON
    ;

/** Paragraphs collection */
paragraphs
    : PARAGRAPHS LBRACE paragraph* RBRACE
    ;

/** Individual paragraph */
paragraph
    : PARAGRAPH paragraphNumber LBRACE paragraphBody RBRACE
    ;

paragraphNumber
    : NUMBER
    ;

paragraphBody
    : title
      content
      rank
      weight
      tasks
    ;

content
    : CONTENT COLON stringLiteral SEMICOLON
    ;

rank
    : RANK COLON rankValue SEMICOLON
    ;

rankValue
    : NUMBER
    ;

weight
    : WEIGHT COLON weightValue SEMICOLON
    ;

weightValue
    : NUMBER
    ;

/** Tasks collection */
tasks
    : TASKS LBRACE task* RBRACE
    ;

/** Individual task issue */
task
    : TASK issueNumber LBRACE taskBody RBRACE
    ;

taskBody
    : title
      taskDescription
      priority
      rank
      weight
    ;

taskDescription
    : DESCRIPTION COLON stringLiteral SEMICOLON
    ;

identifier
    : IDENTIFIER
    ;

stringLiteral
    : STRING
    ;

// ============================================================================
// Lexer Rules
// ============================================================================

// Keywords - Entities
ARGUMENT    : 'argument';
FEATURE     : 'feature';
PARAGRAPH   : 'paragraph';
TASK        : 'task';

// Keywords - Collections
FEATURES    : 'features';
PARAGRAPHS  : 'paragraphs';
TASKS       : 'tasks';

// Keywords - Properties
TYPE            : 'type';
TITLE           : 'title';
DESCRIPTION     : 'description';
STRATEGY        : 'strategy';
STATUS          : 'status';
PRIORITY        : 'priority';
CONTENT         : 'content';
RANK            : 'rank';
WEIGHT          : 'weight';
LINK_STRENGTH   : 'link_strength';

// Keywords - Argument Types
DEFENSE         : 'defense';
OFFENSE         : 'offense';
COUNTERCLAIM    : 'counterclaim';
SUPPORT         : 'support';

// Keywords - Status Values
ACTIVE      : 'active';
INACTIVE    : 'inactive';
COMPLETED   : 'completed';

// Keywords - Priority Values
CRITICAL    : 'critical';
HIGH        : 'high';
MEDIUM      : 'medium';
LOW         : 'low';

// Symbols
LBRACE      : '{';
RBRACE      : '}';
COLON       : ':';
SEMICOLON   : ';';
COMMA       : ',';

// Literals
NUMBER      : [0-9]+;
IDENTIFIER  : [a-zA-Z_][a-zA-Z0-9_]*;
STRING      : '"' (~["\r\n\\] | '\\' .)* '"';

// Whitespace and Comments
WS              : [ \t\r\n]+ -> skip;
LINE_COMMENT    : '//' ~[\r\n]* -> skip;
BLOCK_COMMENT   : '/*' .*? '*/' -> skip;
