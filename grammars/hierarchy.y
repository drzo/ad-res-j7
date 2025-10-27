/* 
 * Yacc Parser for Hierarchical Issue Framework
 * Generates parse tree for legal argument hierarchies
 */

%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "hierarchy_ast.h"

void yyerror(const char *s);
int yylex(void);

extern int yylineno;
hierarchy_root *parse_result = NULL;
%}

%union {
    int num;
    char *str;
    struct argument_node *arg;
    struct feature_node *feat;
    struct paragraph_node *para;
    struct task_node *task;
    struct argument_list *arg_list;
    struct feature_list *feat_list;
    struct paragraph_list *para_list;
    struct task_list *task_list;
}

/* Tokens */
%token <str> STRING IDENTIFIER
%token <num> NUMBER

/* Keywords */
%token ARGUMENT FEATURE PARAGRAPH TASK
%token FEATURES PARAGRAPHS TASKS
%token TYPE TITLE DESCRIPTION STRATEGY STATUS PRIORITY
%token CONTENT RANK WEIGHT LINK_STRENGTH

/* Argument types */
%token DEFENSE OFFENSE COUNTERCLAIM SUPPORT

/* Status values */
%token ACTIVE INACTIVE COMPLETED

/* Priority values */
%token CRITICAL HIGH MEDIUM LOW

/* Symbols */
%token LBRACE RBRACE COLON SEMICOLON COMMA

/* Non-terminals */
%type <arg> argument
%type <feat> feature
%type <para> paragraph
%type <task> task
%type <arg_list> argument_list
%type <feat_list> feature_list
%type <para_list> paragraph_list
%type <task_list> task_list
%type <num> argument_type priority_value status_value
%type <num> rank_value weight_value

%%

/* Root rule */
document:
    argument_list
    {
        parse_result = create_hierarchy_root($1);
    }
    ;

argument_list:
    argument
    {
        $$ = create_argument_list();
        add_argument($$, $1);
    }
    | argument_list argument
    {
        add_argument($1, $2);
        $$ = $1;
    }
    ;

argument:
    ARGUMENT IDENTIFIER LBRACE argument_body RBRACE
    {
        /* Populated during argument_body parsing */
    }
    ;

argument_body:
    TYPE COLON argument_type SEMICOLON
    DESCRIPTION COLON STRING SEMICOLON
    STRATEGY COLON STRING SEMICOLON
    optional_status
    FEATURES LBRACE feature_list RBRACE
    {
        $$ = create_argument($2, $3, $6, $9, $13);
    }
    ;

argument_type:
    DEFENSE { $$ = ARG_DEFENSE; }
    | OFFENSE { $$ = ARG_OFFENSE; }
    | COUNTERCLAIM { $$ = ARG_COUNTERCLAIM; }
    | SUPPORT { $$ = ARG_SUPPORT; }
    ;

optional_status:
    /* empty */ { $$ = STATUS_ACTIVE; }
    | STATUS COLON status_value SEMICOLON { $$ = $3; }
    ;

status_value:
    ACTIVE { $$ = STATUS_ACTIVE; }
    | INACTIVE { $$ = STATUS_INACTIVE; }
    | COMPLETED { $$ = STATUS_COMPLETED; }
    ;

feature_list:
    /* empty */
    {
        $$ = create_feature_list();
    }
    | feature_list feature
    {
        add_feature($1, $2);
        $$ = $1;
    }
    ;

feature:
    FEATURE NUMBER LBRACE feature_body RBRACE
    {
        $$ = create_feature($2);
        /* Body populated during feature_body parsing */
    }
    ;

feature_body:
    TITLE COLON STRING SEMICOLON
    DESCRIPTION COLON STRING SEMICOLON
    PRIORITY COLON priority_value SEMICOLON
    optional_link_strength
    PARAGRAPHS LBRACE paragraph_list RBRACE
    {
        set_feature_details(current_feature, $3, $7, $11, $13, $17);
    }
    ;

priority_value:
    CRITICAL { $$ = PRIORITY_CRITICAL; }
    | HIGH { $$ = PRIORITY_HIGH; }
    | MEDIUM { $$ = PRIORITY_MEDIUM; }
    | LOW { $$ = PRIORITY_LOW; }
    ;

optional_link_strength:
    /* empty */ { $$ = 90; } /* default strength */
    | LINK_STRENGTH COLON weight_value SEMICOLON { $$ = $3; }
    ;

paragraph_list:
    /* empty */
    {
        $$ = create_paragraph_list();
    }
    | paragraph_list paragraph
    {
        add_paragraph($1, $2);
        $$ = $1;
    }
    ;

paragraph:
    PARAGRAPH NUMBER LBRACE paragraph_body RBRACE
    {
        $$ = create_paragraph($2);
    }
    ;

paragraph_body:
    TITLE COLON STRING SEMICOLON
    CONTENT COLON STRING SEMICOLON
    RANK COLON rank_value SEMICOLON
    WEIGHT COLON weight_value SEMICOLON
    TASKS LBRACE task_list RBRACE
    {
        set_paragraph_details(current_paragraph, $3, $7, $11, $15, $19);
    }
    ;

rank_value:
    NUMBER
    {
        if ($1 < 1) {
            yyerror("Rank must be >= 1");
            YYERROR;
        }
        $$ = $1;
    }
    ;

weight_value:
    NUMBER
    {
        if ($1 < 0 || $1 > 100) {
            yyerror("Weight must be between 0 and 100");
            YYERROR;
        }
        $$ = $1;
    }
    ;

task_list:
    /* empty */
    {
        $$ = create_task_list();
    }
    | task_list task
    {
        add_task($1, $2);
        $$ = $1;
    }
    ;

task:
    TASK NUMBER LBRACE task_body RBRACE
    {
        $$ = create_task($2);
    }
    ;

task_body:
    TITLE COLON STRING SEMICOLON
    DESCRIPTION COLON STRING SEMICOLON
    PRIORITY COLON priority_value SEMICOLON
    RANK COLON rank_value SEMICOLON
    WEIGHT COLON weight_value SEMICOLON
    {
        set_task_details(current_task, $3, $7, $11, $15, $19);
    }
    ;

%%

void yyerror(const char *s) {
    fprintf(stderr, "Parse error at line %d: %s\n", yylineno, s);
}

int main(int argc, char **argv) {
    if (argc > 1) {
        FILE *file = fopen(argv[1], "r");
        if (!file) {
            perror(argv[1]);
            return 1;
        }
        yyin = file;
    }
    
    if (yyparse() == 0) {
        printf("Parse successful!\n");
        print_hierarchy(parse_result);
        return 0;
    } else {
        fprintf(stderr, "Parse failed.\n");
        return 1;
    }
}
