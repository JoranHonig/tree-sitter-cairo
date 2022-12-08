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

    _pattern: $ => choice(
      "_",
      $.literal,
      $.identifier,
      $.struct,
      $.tuple,
      $.enum,
      $.path_expression,
    ),
      
    // If expressions
    if_expression: $ => seq('if', $._expression, $.block_expression, optional(seq('else', $.block_expression))),
      
    // TODO: block or if

    // Error propagation expressions
    error_propagation_expression: $ => seq($._expression, '?'),

    comment: $ => token(seq('//', /.*/)),
  }
});

function commaSep1 (rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commasep(rule) {
  return optional(commaSep1(rule));
}