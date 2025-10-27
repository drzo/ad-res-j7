/*
 * Lex Lexer for Hierarchical Issue Framework
 * Tokenizes input for yacc parser
 */

%{
#include "y.tab.h"
#include <string.h>
#include <stdlib.h>

int yylineno = 1;
%}

%option noyywrap

%%

    /* Keywords - Entities */
"argument"      { return ARGUMENT; }
"feature"       { return FEATURE; }
"paragraph"     { return PARAGRAPH; }
"task"          { return TASK; }

    /* Keywords - Collections */
"features"      { return FEATURES; }
"paragraphs"    { return PARAGRAPHS; }
"tasks"         { return TASKS; }

    /* Keywords - Properties */
"type"          { return TYPE; }
"title"         { return TITLE; }
"description"   { return DESCRIPTION; }
"strategy"      { return STRATEGY; }
"status"        { return STATUS; }
"priority"      { return PRIORITY; }
"content"       { return CONTENT; }
"rank"          { return RANK; }
"weight"        { return WEIGHT; }
"link_strength" { return LINK_STRENGTH; }

    /* Keywords - Argument Types */
"defense"       { return DEFENSE; }
"offense"       { return OFFENSE; }
"counterclaim"  { return COUNTERCLAIM; }
"support"       { return SUPPORT; }

    /* Keywords - Status Values */
"active"        { return ACTIVE; }
"inactive"      { return INACTIVE; }
"completed"     { return COMPLETED; }

    /* Keywords - Priority Values */
"critical"      { return CRITICAL; }
"high"          { return HIGH; }
"medium"        { return MEDIUM; }
"low"           { return LOW; }

    /* Symbols */
"{"             { return LBRACE; }
"}"             { return RBRACE; }
":"             { return COLON; }
";"             { return SEMICOLON; }
","             { return COMMA; }

    /* Numbers */
[0-9]+          { 
                  yylval.num = atoi(yytext); 
                  return NUMBER; 
                }

    /* String literals */
\"([^"\\\n]|\\.)*\" { 
                  yylval.str = strndup(yytext + 1, strlen(yytext) - 2);
                  return STRING;
                }

    /* Identifiers */
[a-zA-Z_][a-zA-Z0-9_]* { 
                  yylval.str = strdup(yytext);
                  return IDENTIFIER;
                }

    /* Whitespace */
[ \t]+          { /* skip whitespace */ }
\n              { yylineno++; }

    /* Line comments */
"//"[^\n]*      { /* skip line comments */ }

    /* Block comments */
"/*"            {
                  int c;
                  while ((c = input()) != 0) {
                      if (c == '\n')
                          yylineno++;
                      else if (c == '*') {
                          if ((c = input()) == '/')
                              break;
                          else
                              unput(c);
                      }
                  }
                }

    /* Unexpected character */
.               { 
                  fprintf(stderr, "Unexpected character '%s' at line %d\n", 
                          yytext, yylineno); 
                }

%%

/* Helper function to duplicate strings */
char* strndup(const char* s, size_t n) {
    char* result = (char*)malloc(n + 1);
    if (result) {
        memcpy(result, s, n);
        result[n] = '\0';
    }
    return result;
}
