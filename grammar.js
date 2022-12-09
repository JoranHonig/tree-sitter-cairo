module.exports = grammar({
  name: 'cairo',

  extras: $ => [
    $.comment,
    /\s/
  ],

  conflicts: $ => [
    [$._expression, $.struct_ctor_call_expression],
    [$._path_segment, $.pattern_identifier],
    [$.parenthesized_expression, $.tuple_expression],
    [$.function_call_expression, $._expression], // function calls start with expressions
    [$._expression, $.expression_statement], // matches don't need a semicolon but are still expressions
    [$.simple_path_segment, $.generic_argument_path_segment], // path segments can be identifiers or identifiers with generic arguments
    [$.return_statement, $.expression_statement],
    [$._generic_arguments, $.binary_expression],
    [$.pattern_identifier, $.path_expression], // pattern identifiers can be single identifiers and paths too.
  ],

  rules: {
    source_file: $ => repeat($._item),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // == Expressions ==
    _expression: $ => choice(
      $.path_expression,
      $.literal_expression,
      $.boolean_expression,
      $.parenthesized_expression,
      $.unary_expression,
      $.binary_expression,
      $.tuple_expression,
      $.function_call_expression,
      $.struct_ctor_call_expression,
      $.block_expression,
      $.match_expression,
      $.if_expression,
      $.error_propagation_expression,
    ),

    // Path Expression
    path_expression: $ => prec.right(charSep1($._path_segment, "::")),
    _path_segment: $ => choice(
      $.simple_path_segment,
      $.generic_argument_path_segment,
    ),
    simple_path_segment: $ => seq(
      field("name", $.identifier),
    ),
    generic_argument_path_segment: $ => seq(
      field("name", $.identifier), 
      "::", 
      field("generic_argument", $._generic_arguments)
    ), 

    _generic_arguments: $ => prec.right(10, seq('<', commaSep1($._expression), '>')),
    
    // Boolean expressions (separate from literals to adhere to cairo's compiler)
    boolean_expression: $ => choice( 'true', 'false' ),

    // Literal expressions
    literal_expression: $ => choice(
      $.integer_literal,
    ),

    integer_literal: $ => /[0-9]+/,

    // Parenthesized expression
    parenthesized_expression: $ => seq('(', field("expression", $._expression), ')'),

    // Unary expressions
    unary_expression: $ => prec.left(seq(
      field("operator", $._unary_operator), 
      field("rhs", $._expression)
    )),

    _unary_operator: $ => choice(
      '!',
      '-',
    ),

    // Binary expressions
    binary_expression: $ => prec.left(seq(
      field("lhs", $._expression), 
      field("operator", $._binary_operator), 
      field("rhs", $._expression)
    )),

    _binary_operator: $ => choice(
      '.',
      '!',
      '*',
      '/',
      '+',
      '-',
      '%',
      '==',
      '!=',
      '=',
      '&&',
      '||',
      '<',
      '<=',
      '>',
      '>=',
    ),

    // Tuple expressions
    tuple_expression: $ => seq('(', commaSep(field("member", $._expression)), ')'),

    // Function call expressions
    _arguments: $ => seq(commaSep1(field("argument", $._expression)), optional(',')),
    function_call_expression: $ => seq(
      field("name", $.path_expression), 
      '(', 
      optional($._arguments), 
      ')'
    ),

    // Struct ctor call expressions
    struct_ctor_call_expression: $ => seq(
      field("name", $.path_expression), 
      '{', 
      optional($._struct_argument_list), 
      '}'
    ),

    _struct_argument_expression: $ => seq(':', field("value", $._expression)),
    single_struct_argument: $ => seq(field("name", $.identifier), $._struct_argument_expression),
    struct_argument_tail: $ => seq('..', field("expression", $._expression)),
    _struct_argument: $ => choice(
      $.single_struct_argument,
      $.struct_argument_tail,
    ),
    _struct_argument_list: $ => commaSep1(field("argument", $._struct_argument)),

    // Block expressions
    block_expression: $ => seq('{', repeat($._statement), '}'),

    // Match expressions
    match_expression: $ => seq('match', field("match_value", $._expression), '{', seq($.match_arm, repeat(seq(',', $.match_arm)), optional(',')) , '}'),

    match_arm: $ => seq(
      field("pattern", $._pattern),
      '=>',
      field("value", $._expression),
    ),

      
    // If expressions
    if_expression: $ => seq(
      'if', 
      field("condition", $._expression), 
      field("consequence", $.block_expression), 
      repeat(field("alternative", $.else_if_clause)), 
      optional(field("alternative", $.else_clause)),
    ),
    else_if_clause: $ => seq('else', 'if', $._expression, $.block_expression),
    else_clause: $ => seq('else', $.block_expression),

    // TODO: block or if

    // Error propagation expressions
    error_propagation_expression: $ => seq(
      field("expression", $._expression), 
      '?'
    ),

    comment: $ => token(seq('//', /.*/)),

    // == Patterns == (used by match arms)
    _pattern: $ => choice(
      "_",
      $.pattern_literal,
      $.pattern_identifier,
      $.pattern_struct,
      $.pattern_tuple,
      $.pattern_enum,
      $.path_expression,
    ),

    pattern_literal: $ => $.literal_expression,
    pattern_identifier: $ => prec(1, seq(optional($._modifier_list), field("name", $.identifier))),
    _modifier_list: $ => commaSep1($.modifier),

    modifier: $ => choice(
      'mut',
      '&',
    ),

    pattern_struct: $ => seq(
      field("name", $.path_expression), 
      '{', 
      optional($._struct_pattern_list), 
      '}'
    ),

    // TODO: this definition is wrong, waiting for more docs
    _struct_pattern_list: $ => commaSep1($.struct_pattern),
    struct_pattern: $ => seq(
      field("name", $.identifier),
      "with",
      "..",
    ),
    _struct_patter_with: $ => seq(
      field("name", $.identifier),
      ':',
      field("value", $._pattern),
    ),

    pattern_tuple: $ => seq(
      '(', 
      commaSep(field("member", $._pattern)),
      ')'
    ),

    pattern_enum: $ => seq(
      field("name", $.path_expression), 
      '(', 
      commaSep(field("member", $._pattern)),
      ')'
    ),

    // == Type Clauses ==
    _type_clause: $ => prec(1, seq(':', field("type", $._expression))),

    _return__type_clause: $ => seq('->', field("return_type", $._expression)),

    // == Statements ==
    _statement_list: $ => repeat($._statement),

    _statement : $ => choice(
      $.let_statement,
      $.expression_statement,
      $.return_statement,
    ),

    let_statement: $ => seq(
      'let',
      field("pattern", $._pattern),
      optional($._type_clause), 
      optional(seq('=', field("value", $._expression))), 
      ';'
    ),

    expression_statement: $ => choice($.match_expression, seq($._expression, ';')),

    return_statement: $ => prec(-1, choice(
      seq('return', field("value", optional($._expression)), ';'),
      field("value", $._expression),
    )),

    // == Functions ==
    _param_name: $ => choice("_", $.identifier),
    _param: $ => seq(optional($._modifier_list), field("name", $._param_name), $._type_clause),

    _implicits_clause: $ => seq(
      'implicits', 
      '(', 
      commaSep(field("implicit", $.implicit)), 
      ')'
    ),

    implicit: $ => seq(
      field("name", $.identifier),
      $._type_clause
    ),

    _function_signature: $ => seq(
      '(',
      commaSep(field("parameter", $._param)),
      ')',
      optional($._return__type_clause),
      optional($._implicits_clause),
      optional($._no_panic_token),
    ),

    _no_panic_token: $ => 'no_panic', // TODO: who knows?

    // == Struct Members ==
    _struct_member: $ => seq(field("name", $.identifier), $._type_clause),

    // == Items ==
    _item: $ => choice(
      $.module,
      $.use,
      $.free_function,
      $.extern_function,
      $.extern_type,
      $.trait,
      $.impl,
      $.struct,
      $.enum,
    ),

    module: $ => seq(
      repeat($.attribute),
      'mod',
      $.identifier,
      ';',
    ),

    attribute_arguments: $ => seq('(', commaSep($._expression), ')'),
    attribute: $ => seq('#', '[', $.identifier, $.attribute_arguments, ']'),

    free_function: $ => seq(
      repeat($.attribute),
      'func',
      field("name", $.identifier),
      field("type_parameters", optional($._wrapped_generic_parameters)),
      $._function_signature,
      field("body", $.block_expression),
    ),

    extern_function: $ => seq(
      repeat($.attribute),
      'extern',
      'func',
      $.identifier,
      optional($._wrapped_generic_parameters),
      $._function_signature,
      $.block_expression,
    ),

    extern_type: $ => seq(
      'extern',
      'type',
      field("name", $.identifier),
      optional($._wrapped_generic_parameters),
      ';',
    ),

    trait: $ => seq(
      repeat($.attribute),
      'trait',
      field("name", $.identifier),
      optional($._wrapped_generic_parameters),
      choice(
        field("body", $._trait_body),
        ';',
      )
    ),

    _trait_body: $ => seq(
      '{',
      repeat($._trait_item),
      '}',
    ),

    _trait_item: $ => choice(
      $._trait_function,
    ),

    _trait_function: $ => seq(
      repeat($.attribute),
      'func',
      field("name", $.identifier),
      optional($._wrapped_generic_parameters),
      $._function_signature,
      ';',
    ),

    impl: $ => seq(
      repeat($.attribute),
      'impl',
      field("name", $.identifier),
      optional($._wrapped_generic_parameters),
      "of",
      field("trait", $.path_expression),
      choice(
        field("body", $._impl_body),
        ';',
      ),
    ),
    _impl_body: $ => seq(
      '{',
      repeat($._item),
      '}',
    ),

    struct: $ => seq(
      repeat($.attribute),
      'struct',
      field("name", $.identifier),
      optional($._wrapped_generic_parameters),
      '{',
      commaSep1(field("member", $._struct_member)),
      optional(','),
      '}',
    ),

    enum: $ => seq(
      repeat($.attribute),
      'enum',
      field("name", $.identifier),
      optional($._wrapped_generic_parameters),
      '{',
      commaSep1(field("member", $._struct_member)), // todo: make special node for enum members
      optional(','),
      '}',
    ),

    use: $ => seq(
      repeat($.attribute),
      'use',
      field("name", $.path_expression),
      ';',
    ),

    generic_param: $ => choice($.parenthesized_expression, $.identifier),
    _wrapped_generic_parameters: $ => seq('<', commaSep($.generic_param), '>'),

  }
});

function charSep(rule, char) {
  return optional(charSep1(rule, char));
}

function charSep1 (rule, char) {
  return seq(rule, repeat(seq(char, rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1 (rule) {
  return seq(rule, repeat(seq(',', rule)));
}
