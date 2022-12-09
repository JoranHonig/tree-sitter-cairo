; identifiers

;(pattern_identifier) @constructor

; Literals

(integer_literal) @number

(boolean_expression) @constant.builtin

(comment) @comment

; Definitions and references
(primitive_type) @type.builtin

(path_expression) @type

(use name: (path_expression) @type)
(module name: (identifier) @type)
(free_function name: (identifier) @type)
(extern_function name: (identifier) @type)
(extern_type name: (identifier) @type)
(trait name: (identifier) @type)
(impl name: (identifier) @type)
(struct name: (identifier) @type)
(enum name: (identifier) @type)

; calls and constructions
(function_call_expression name: (path_expression) @identifier)
(struct_ctor_call_expression name: (path_expression) @identifier)


; Tokens
"use" @keyword
"mod" @keyword
"func" @keyword
"extern" @keyword
"trait" @keyword
"impl" @keyword
"struct" @keyword
"of" @keyword
"let" @keyword
"return" @keyword
"if" @keyword
"else" @keyword
"match" @keyword

"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket