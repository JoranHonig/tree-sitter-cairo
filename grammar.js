module.exports = grammar({
  name: 'cairo',

  extras: $ => [
    $.comment,
    /\s/
  ],

  conflicts: $ => [
    [$._expression, $.struct_ctor_call_expression],
    [$._path_segment, $._pattern_identifier],
    [$.parenthesized_expression, $.tuple_expression],
    [$.function_call_expression, $._expression], // function calls start with expressions
    [$._expression, $.expression_statement], // matches don't need a semicolon but are still expressions
    [$._path_segment], // path segments can be identifiers or identifiers with generic arguments
    [$.return_statement, $.expression_statement],
    [$._generic_arguments, $.binary_expression]
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
      $.identifier,
      seq($.identifier, "::", $._generic_arguments)
    ),

    _generic_arguments: $ => prec.right(10, seq('<', commaSep1($._expression), '>')),
    
    // Boolean expressions
    boolean_expression: $ => choice( 'true', 'false' ),

    // Literal expressions
    literal_expression: $ => choice(
      /[0-9]+/,
    ),

    // Parenthesized expression
    parenthesized_expression: $ => seq('(', $._expression, ')'),

    // Unary expressions
    unary_expression: $ => prec.left(seq($._unary_operator, $._expression)),
    _unary_operator: $ => choice(
      '!',
      '-',
    ),

    // Binary expressions
    binary_expression: $ => prec.left(seq($._expression, $._binary_operator, $._expression)),

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
    tuple_expression: $ => seq('(', commaSep($._expression), ')'),

    // Function call expressions
    _arguments: $ => seq($._expression, repeat(seq(',', $._expression)), optional(',')),
    function_call_expression: $ => seq($.path_expression, '(', optional($._arguments), ')'),

    // Struct ctor call expressions
    struct_ctor_call_expression: $ => seq($.path_expression, '{', optional($._struct_argument_list), '}'),

    _struct_argument_expression: $ => seq(':', $._expression),
    _single_struct_argument: $ => seq($.identifier, $._struct_argument_expression),
    _struct_argument_tail: $ => seq('..', $._expression),
    _struct_argument: $ => choice(
      $._single_struct_argument,
      $._struct_argument_tail,
    ),
    _struct_argument_list: $ => commaSep1($._struct_argument),

    // Block expressions
    block_expression: $ => seq('{', repeat($._statement), '}'),

    // Match expressions
    match_expression: $ => seq('match', $._expression, '{', seq($.match_arm, repeat(seq(',', $.match_arm)), optional(',')) , '}'),

    match_arm: $ => seq($._pattern, '=>', $._expression),

      
    // If expressions
    if_expression: $ => seq(
      'if', 
      $._expression, 
      $.block_expression, 
      optional(seq('else', 'if', $._expression, $.block_expression,)), 
      optional(seq('else', $.block_expression))
    ),
      
    // TODO: block or if

    // Error propagation expressions
    error_propagation_expression: $ => seq($._expression, '?'),

    comment: $ => token(seq('//', /.*/)),


    // == Patterns == (used by match arms)
    _pattern: $ => choice(
      "_",
      $._pattern_literal,
      $._pattern_identifier,
      $._pattern_struct,
      $._pattern_tuple,
      $._pattern_enum,
      $.path_expression,
    ),

    _pattern_literal: $ => $.literal_expression,
    _pattern_identifier: $ => seq(optional($._modifier_list), $.identifier),
    _modifier_list: $ => commaSep1($._modifier),
    _modifier: $ => choice(
      'mut',
      '&',
    ),

    _pattern_struct: $ => seq($.path_expression, '{', optional($._struct_pattern_list), '}'),
    _struct_pattern_list: $ => commaSep1($._struct_pattern),
    _struct_pattern: $ => seq(
      $.identifier,
      "with",
      "..",
    ),
    _struct_patter_with: $ => seq(
      $.identifier,
      ':',
      $._pattern,
    ),

    _pattern_tuple: $ => seq('(', commaSep($._pattern), ')'),

    _pattern_enum: $ => seq($.path_expression, '(', commaSep($._pattern), ')'),

    // == Type Clauses ==
    type_clause: $ => prec(1, seq(':', $._expression)),

    return_type_clause: $ => seq('->', $._expression),

    // == Statements ==
    _statement_list: $ => repeat($._statement),

    _statement : $ => choice(
      $.let_statement,
      $.expression_statement,
      $.return_statement,
    ),

    let_statement: $ => seq('let', $._pattern, optional($.type_clause), optional(seq('=', $._expression)), ';'),
    expression_statement: $ => choice($.match_expression, seq($._expression, ';')),
    return_statement: $ => prec(-1, choice(
      seq('return', optional($._expression), ';'),
      $._expression,
    )),

    // == Functions ==
    _param_name: $ => choice("_", $.identifier),
    _param: $ => seq(optional($._modifier_list), $._param_name, $.type_clause),

    implicits_clause: $ => seq('implicits', '(', commaSep(seq($.identifier, $.type_clause)), ')'),
    
    function_signature: $ => seq(
      '(',
      commaSep($._param),
      ')',
      optional($.return_type_clause),
      optional($.implicits_clause),
      optional($._no_panic_token),
    ),

    _no_panic_token: $ => 'no_panic', // TODO: who knows?

    // == Struct Members ==
    struct_member: $ => seq($.identifier, $.type_clause),

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
      $.identifier,
      optional($._wrapped_generic_parameters),
      $.function_signature,
      $.block_expression,
    ),

    extern_function: $ => seq(
      repeat($.attribute),
      'extern',
      'func',
      $.identifier,
      optional($._wrapped_generic_parameters),
      $.function_signature,
      $.block_expression,
    ),

    extern_type: $ => seq(
      'extern',
      'type',
      $.identifier,
      optional($._wrapped_generic_parameters),
      ';',
    ),

    trait: $ => seq(
      repeat($.attribute),
      'trait',
      $.identifier,
      optional($._wrapped_generic_parameters),
      choice(
        $.trait_body,
        ';',
      )
    ),

    trait_body: $ => seq(
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
      $.identifier,
      optional($._wrapped_generic_parameters),
      $.function_signature,
      ';',
    ),

    impl: $ => seq(
      repeat($.attribute),
      'impl',
      $.identifier,
      optional($._wrapped_generic_parameters),
      "of",
      $.path_expression,
      choice(
        $.impl_body,
        ';',
      ),
    ),
    impl_body: $ => seq(
      '{',
      repeat($._item),
      '}',
    ),

    struct: $ => seq(
      repeat($.attribute),
      'struct',
      $.identifier,
      optional($._wrapped_generic_parameters),
      '{',
      commaSep1($.struct_member),
      optional(','),
      '}',
    ),

    enum: $ => seq(
      repeat($.attribute),
      'enum',
      $.identifier,
      optional($._wrapped_generic_parameters),
      '{',
      commaSep1($.struct_member), // todo: make special node for enum members
      optional(','),
      '}',
    ),

    use: $ => seq(
      repeat($.attribute),
      'use',
      $.path_expression,
      ';',
    ),

    _generic_param: $ => choice($.parenthesized_expression, $.identifier),
    _wrapped_generic_parameters: $ => seq('<', commaSep($._generic_param), '>'),

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
