module.exports = grammar({
  name: 'cairo',

  extras: $ => [
    $.comment,
    /\s/
  ],

  rules: {
    source_file: $ => $._source_element,

    _source_element: $ => choice(
      $._declaration,
      $._definition,
      $._statement,
      $._expression,
    ),

    _declaration: $ => choice(
      $.import_declaration,
      $.builtin_declaration
    ),

    _definition: $ => choice(
      $.funtion_definition,
      $.struct_definition,
      $.namespace_definition,
    ),

    _statement: $ => choice(
      $.let_statement,
      $._expression,
      $.return_statement,
    ),

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
    path_expression: $ => prec.left(2, seq( $._expression, '.', $._expression)),
    _path_segment: $ => choice(
      $.identifier,
      seq($.identifier, "::", $._generic_arguments)
    ),

    _generic_arguments: $ => seq('<', commaSep1($._expression), '>'),
    _generic_argument_list: $ => commaSep1($._expression),

    // Boolean expressions
    boolean_expression: $ => choice( 'true', 'false' ),

    // Literal expressions
    // literal_expression: $ => 

    // Parenthesized expression
    parenthesized_expression: $ => seq('(', $._expression, ')'),

    // Unary expressions
    unary_expression: $ => prec.left(1, seq($._unary_operator, $._expression)),
    _unary_operator: $ => choice(
      '!',
      '-',
    ),

    // Binary expressions
    binary_expression: $ => prec.right(1, seq($._expression, $._binary_operator, $._expression)),

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
    tuple_expression: $ => seq('(', commaSep1($._expression), ')'),

    // Function call expressions
    function_call_expression: $ => seq($.path_expression, '(', commasep($._expression), ')'),

    // Struct ctor call expressions
    struct_ctor_call_expression: $ => seq($.path_expression, '{', $._struct_argument_list, '}'),

    _struct_argument_expression: $ => seq(':', $._expression),
    _single_struct_argument: $ => seq($.identifier, $._struct_argument_expression),
    _struct_argument_tail: $ => seq('..', $._expression),
    _struct_argument: $ => choice(
      $._single_struct_argument,
      $._struct_argument_tail,
    ),
    _struct_argument_list: $ => commaSep($._struct_argument),

    // Block expressions
    block_expression: $ => seq('{', repeat($._statement), '}'),

    // Match expressions
    match_expression: $ => seq('match', $._expression, '{', repeat($.match_arm), '}'),

    match_arm: $ => seq($._pattern, '=>', $._expression),

      
    // If expressions
    if_expression: $ => seq('if', $._expression, $.block_expression, optional(seq('else', $.block_expression))),
      
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

    _pattern_identifier: $ => seq(optional($._modifier_list), $.identifier),
    _modifier_list: $ => commaSep1($._modifier),
    _modifier: $ => choice(
      'mut',
      '&',
    ),

    _pattern_struct: $ => seq($.path_expression, '{', $._struct_pattern_list, '}'),
    _struct_pattern_list: $ => commaSep($._struct_pattern),
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
    _pattern_enum: $ => seq($.path_expression, '(', commasep($._pattern), ')'),

    // == Type Clauses ==
    type_clause: $ => seq(':', $._expression),

    return_type_clause: $ => seq('->', $._expression),

    // == Statements ==
    _statement_list: $ => repeat($._statement),

    let_statement: $ => seq('let', $._pattern, $.type_clause, "=", optional($._expression), ';'),
    expression_statement: $ => seq($._expression, ';'),
    return_statement: $ => seq('return', optional($._expression), ';'),

    // == Functions ==
    _param_name: $ => seq("_", $.identifier),
    _param: $ => seq($._modifier_list, $._param_name, $.type_clause),

    implicits_clause: $ => seq('implicits', '(', commaSep($.path_expression), ')'),
    
    function_signature: $ => seq(
      '(',
      commasep($._param),
      ')',
      optional($.return_type_clause),
      optional($.implicits_clause),
      optional($._no_panic_token),
    ),

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

    attribute_arguments: $ => seq('(', commasep($._expression), ')'),
    attribute: $ => seq('#', '[', $.identifier, $.attribute_arguments, ']'),

    free_function: $ => seq(
      repeat($.attribute),
      'fn',
      $.identifier,
      $.option_wrapped_generic_parameters,
      $.function_signature,
      $.block_expression,
    ),

    extern_function: $ => seq(
      repeat($.attribute),
      'extern',
      'fn',
      $.identifier,
      $.option_wrapped_generic_parameters,
      $.function_signature,
      $.block_expression,
    ),

    extern_type: $ => seq(
      'extern',
      'type',
      $.identifier,
      $.option_wrapped_generic_parameters,
      ';',
    ),

    trait: $ => seq(
      repeat($.attribute),
      'trait',
      $.identifier,
      $.option_wrapped_generic_parameters,
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
      'fn',
      $.identifier,
      $.option_wrapped_generic_parameters,
      $.function_signature,
      ';',
    ),

    impl: $ => seq(
      repeat($.attribute),
      'impl',
      $.identifier,
      $.option_wrapped_generic_parameters,
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
      $.option_wrapped_generic_parameters,
      '{',
      repeat($.struct_member),
      '}',
    ),

    enum: $ => seq(
      repeat($.attribute),
      'enum',
      $.identifier,
      $.option_wrapped_generic_parameters,
      '{',
      repeat($.enum_member),
      '}',
    ),

    use: $ => seq(
      repeat($.attribute),
      'use',
      $.path_expression,
      ';',
    ),

  }
});

function commaSep1 (rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commasep(rule) {
  return optional(commaSep1(rule));
}