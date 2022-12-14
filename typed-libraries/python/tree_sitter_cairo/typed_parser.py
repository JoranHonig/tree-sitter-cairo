from typing import Union, Any, Optional, List

from tree_sitter_types.parser import load_language, install_parser, parse_node


class TreeSitterNode:
    base_node: Any

    def text(self):
        return self.base_node.text


class Attribute(TreeSitterNode):
    field_names = []
    children: List[Union["AttributeArguments", "Identifier"]]


class AttributeArguments(TreeSitterNode):
    field_names = []
    children: Optional[
        List[
            Union[
                "BinaryExpression",
                "BlockExpression",
                "BooleanExpression",
                "ErrorPropagationExpression",
                "FunctionCallExpression",
                "Identifier",
                "IfExpression",
                "LiteralExpression",
                "MatchExpression",
                "ParenthesizedExpression",
                "PathExpression",
                "PrimitiveType",
                "StructCtorCallExpression",
                "TupleExpression",
                "UnaryExpression",
            ]
        ]
    ]


class BinaryExpression(TreeSitterNode):
    field_names = ["lhs", "operator", "rhs"]
    lhs: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]
    operator: Union[
        "str",
        "str",
        "str",
        "str",
        "str",
        "str",
        "str",
        "str",
        "str",
        "str",
        "str",
        "str",
        "str",
        "str",
        "str",
        "str",
    ]
    rhs: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]
    children: None


class BlockExpression(TreeSitterNode):
    field_names = []
    children: Optional[
        List[Union["ExpressionStatement", "LetStatement", "ReturnStatement"]]
    ]


class BooleanExpression(TreeSitterNode):
    field_names = []
    children: None


class ElseClause(TreeSitterNode):
    field_names = []
    children: "BlockExpression"


class ElseIfClause(TreeSitterNode):
    field_names = []
    children: List[
        Union[
            "BinaryExpression",
            "BlockExpression",
            "BooleanExpression",
            "ErrorPropagationExpression",
            "FunctionCallExpression",
            "Identifier",
            "IfExpression",
            "LiteralExpression",
            "MatchExpression",
            "ParenthesizedExpression",
            "PathExpression",
            "PrimitiveType",
            "StructCtorCallExpression",
            "TupleExpression",
            "UnaryExpression",
        ]
    ]


class Enum(TreeSitterNode):
    field_names = ["member", "name", "type"]
    member: List[
        Union[
            "str",
            "BinaryExpression",
            "BlockExpression",
            "BooleanExpression",
            "ErrorPropagationExpression",
            "FunctionCallExpression",
            "Identifier",
            "IfExpression",
            "LiteralExpression",
            "MatchExpression",
            "ParenthesizedExpression",
            "PathExpression",
            "PrimitiveType",
            "StructCtorCallExpression",
            "TupleExpression",
            "UnaryExpression",
        ]
    ]
    name: List["Identifier"]
    type: List[
        Union[
            "BinaryExpression",
            "BlockExpression",
            "BooleanExpression",
            "ErrorPropagationExpression",
            "FunctionCallExpression",
            "Identifier",
            "IfExpression",
            "LiteralExpression",
            "MatchExpression",
            "ParenthesizedExpression",
            "PathExpression",
            "PrimitiveType",
            "StructCtorCallExpression",
            "TupleExpression",
            "UnaryExpression",
        ]
    ]
    children: Optional[List[Union["Attribute", "GenericParam"]]]


class ErrorPropagationExpression(TreeSitterNode):
    field_names = ["expression"]
    expression: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]
    children: None


class ExpressionStatement(TreeSitterNode):
    field_names = []
    children: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]


class ExternFunction(TreeSitterNode):
    field_names = ["implicit", "parameter", "return_type"]
    implicit: Optional[List["Implicit"]]
    parameter: Optional[List["Param"]]
    return_type: Optional[
        Union[
            "BinaryExpression",
            "BlockExpression",
            "BooleanExpression",
            "ErrorPropagationExpression",
            "FunctionCallExpression",
            "Identifier",
            "IfExpression",
            "LiteralExpression",
            "MatchExpression",
            "ParenthesizedExpression",
            "PathExpression",
            "PrimitiveType",
            "StructCtorCallExpression",
            "TupleExpression",
            "UnaryExpression",
        ]
    ]
    children: List[Union["Attribute", "BlockExpression", "GenericParam", "Identifier"]]


class ExternType(TreeSitterNode):
    field_names = ["name"]
    name: "Identifier"
    children: Optional[List["GenericParam"]]


class FreeFunction(TreeSitterNode):
    field_names = [
        "body",
        "implicit",
        "name",
        "parameter",
        "return_type",
        "type_parameters",
    ]
    body: "BlockExpression"
    implicit: Optional[List["Implicit"]]
    name: "Identifier"
    parameter: Optional[List["Param"]]
    return_type: Optional[
        Union[
            "BinaryExpression",
            "BlockExpression",
            "BooleanExpression",
            "ErrorPropagationExpression",
            "FunctionCallExpression",
            "Identifier",
            "IfExpression",
            "LiteralExpression",
            "MatchExpression",
            "ParenthesizedExpression",
            "PathExpression",
            "PrimitiveType",
            "StructCtorCallExpression",
            "TupleExpression",
            "UnaryExpression",
        ]
    ]
    type_parameters: Optional[List[Union["str", "str", "str", "GenericParam"]]]
    children: Optional[List["Attribute"]]


class FunctionCallExpression(TreeSitterNode):
    field_names = ["argument", "name"]
    argument: Optional[
        List[
            Union[
                "BinaryExpression",
                "BlockExpression",
                "BooleanExpression",
                "ErrorPropagationExpression",
                "FunctionCallExpression",
                "Identifier",
                "IfExpression",
                "LiteralExpression",
                "MatchExpression",
                "ParenthesizedExpression",
                "PathExpression",
                "PrimitiveType",
                "StructCtorCallExpression",
                "TupleExpression",
                "UnaryExpression",
            ]
        ]
    ]
    name: "PathExpression"
    children: None


class GenericArgumentPathSegment(TreeSitterNode):
    field_names = ["generic_argument", "name"]
    generic_argument: List[
        Union[
            "str",
            "str",
            "str",
            "BinaryExpression",
            "BlockExpression",
            "BooleanExpression",
            "ErrorPropagationExpression",
            "FunctionCallExpression",
            "Identifier",
            "IfExpression",
            "LiteralExpression",
            "MatchExpression",
            "ParenthesizedExpression",
            "PathExpression",
            "PrimitiveType",
            "StructCtorCallExpression",
            "TupleExpression",
            "UnaryExpression",
        ]
    ]
    name: "Identifier"
    children: None


class GenericParam(TreeSitterNode):
    field_names = []
    children: Union["Identifier", "ParenthesizedExpression"]


class IfExpression(TreeSitterNode):
    field_names = ["alternative", "condition", "consequence"]
    alternative: Optional[List[Union["ElseClause", "ElseIfClause"]]]
    condition: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]
    consequence: "BlockExpression"
    children: None


class Impl(TreeSitterNode):
    field_names = ["body", "name", "trait"]
    body: Optional[
        List[
            Union[
                "Enum",
                "ExternFunction",
                "ExternType",
                "FreeFunction",
                "Impl",
                "Module",
                "Struct",
                "Trait",
                "Use",
                "str",
                "str",
            ]
        ]
    ]
    name: "Identifier"
    trait: "PathExpression"
    children: Optional[List[Union["Attribute", "GenericParam"]]]


class Implicit(TreeSitterNode):
    field_names = ["name", "type"]
    name: "Identifier"
    type: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]
    children: None


class LetStatement(TreeSitterNode):
    field_names = ["pattern", "type", "value"]
    pattern: Union[
        "str",
        "PathExpression",
        "PatternEnum",
        "PatternIdentifier",
        "PatternLiteral",
        "PatternStruct",
        "PatternTuple",
    ]
    type: Optional[
        Union[
            "BinaryExpression",
            "BlockExpression",
            "BooleanExpression",
            "ErrorPropagationExpression",
            "FunctionCallExpression",
            "Identifier",
            "IfExpression",
            "LiteralExpression",
            "MatchExpression",
            "ParenthesizedExpression",
            "PathExpression",
            "PrimitiveType",
            "StructCtorCallExpression",
            "TupleExpression",
            "UnaryExpression",
        ]
    ]
    value: Optional[
        Union[
            "BinaryExpression",
            "BlockExpression",
            "BooleanExpression",
            "ErrorPropagationExpression",
            "FunctionCallExpression",
            "Identifier",
            "IfExpression",
            "LiteralExpression",
            "MatchExpression",
            "ParenthesizedExpression",
            "PathExpression",
            "PrimitiveType",
            "StructCtorCallExpression",
            "TupleExpression",
            "UnaryExpression",
        ]
    ]
    children: None


class LiteralExpression(TreeSitterNode):
    field_names = []
    children: "IntegerLiteral"


class MatchArm(TreeSitterNode):
    field_names = ["pattern", "value"]
    pattern: Union[
        "str",
        "PathExpression",
        "PatternEnum",
        "PatternIdentifier",
        "PatternLiteral",
        "PatternStruct",
        "PatternTuple",
    ]
    value: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]
    children: None


class MatchExpression(TreeSitterNode):
    field_names = ["match_value"]
    match_value: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]
    children: List["MatchArm"]


class Modifier(TreeSitterNode):
    field_names = []
    children: None


class Module(TreeSitterNode):
    field_names = ["name"]
    name: "Identifier"
    children: Optional[List["Attribute"]]


class Param(TreeSitterNode):
    field_names = ["name", "type"]
    name: Union["str", "Identifier"]
    type: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]
    children: Optional[List["Modifier"]]


class ParenthesizedExpression(TreeSitterNode):
    field_names = ["expression"]
    expression: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]
    children: None


class PathExpression(TreeSitterNode):
    field_names = []
    children: List[Union["GenericArgumentPathSegment", "SimplePathSegment"]]


class PatternEnum(TreeSitterNode):
    field_names = ["member", "name"]
    member: Optional[
        List[
            Union[
                "str",
                "PathExpression",
                "PatternEnum",
                "PatternIdentifier",
                "PatternLiteral",
                "PatternStruct",
                "PatternTuple",
            ]
        ]
    ]
    name: "PathExpression"
    children: None


class PatternIdentifier(TreeSitterNode):
    field_names = ["name"]
    name: "Identifier"
    children: Optional[List["Modifier"]]


class PatternLiteral(TreeSitterNode):
    field_names = []
    children: "LiteralExpression"


class PatternStruct(TreeSitterNode):
    field_names = ["name"]
    name: "PathExpression"
    children: Optional[List["StructPattern"]]


class PatternTuple(TreeSitterNode):
    field_names = ["member"]
    member: Optional[
        List[
            Union[
                "str",
                "PathExpression",
                "PatternEnum",
                "PatternIdentifier",
                "PatternLiteral",
                "PatternStruct",
                "PatternTuple",
            ]
        ]
    ]
    children: None


class PrimitiveType(TreeSitterNode):
    field_names = []
    children: None


class ReturnStatement(TreeSitterNode):
    field_names = ["value"]
    value: Optional[
        Union[
            "BinaryExpression",
            "BlockExpression",
            "BooleanExpression",
            "ErrorPropagationExpression",
            "FunctionCallExpression",
            "Identifier",
            "IfExpression",
            "LiteralExpression",
            "MatchExpression",
            "ParenthesizedExpression",
            "PathExpression",
            "PrimitiveType",
            "StructCtorCallExpression",
            "TupleExpression",
            "UnaryExpression",
        ]
    ]
    children: None


class SimplePathSegment(TreeSitterNode):
    field_names = ["name"]
    name: "Identifier"
    children: None


class SingleStructArgument(TreeSitterNode):
    field_names = ["name", "value"]
    name: "Identifier"
    value: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]
    children: None


class SourceFile(TreeSitterNode):
    field_names = []
    children: Optional[
        List[
            Union[
                "Enum",
                "ExternFunction",
                "ExternType",
                "FreeFunction",
                "Impl",
                "Module",
                "Struct",
                "Trait",
                "Use",
            ]
        ]
    ]


class Struct(TreeSitterNode):
    field_names = ["member", "name", "type"]
    member: List[
        Union[
            "str",
            "BinaryExpression",
            "BlockExpression",
            "BooleanExpression",
            "ErrorPropagationExpression",
            "FunctionCallExpression",
            "Identifier",
            "IfExpression",
            "LiteralExpression",
            "MatchExpression",
            "ParenthesizedExpression",
            "PathExpression",
            "PrimitiveType",
            "StructCtorCallExpression",
            "TupleExpression",
            "UnaryExpression",
        ]
    ]
    name: List["Identifier"]
    type: List[
        Union[
            "BinaryExpression",
            "BlockExpression",
            "BooleanExpression",
            "ErrorPropagationExpression",
            "FunctionCallExpression",
            "Identifier",
            "IfExpression",
            "LiteralExpression",
            "MatchExpression",
            "ParenthesizedExpression",
            "PathExpression",
            "PrimitiveType",
            "StructCtorCallExpression",
            "TupleExpression",
            "UnaryExpression",
        ]
    ]
    children: Optional[List[Union["Attribute", "GenericParam"]]]


class StructArgumentTail(TreeSitterNode):
    field_names = ["expression"]
    expression: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]
    children: None


class StructCtorCallExpression(TreeSitterNode):
    field_names = ["argument", "name"]
    argument: Optional[List[Union["SingleStructArgument", "StructArgumentTail"]]]
    name: "PathExpression"
    children: None


class StructPattern(TreeSitterNode):
    field_names = ["name"]
    name: "Identifier"
    children: None


class Trait(TreeSitterNode):
    field_names = ["body", "implicit", "name", "parameter", "return_type"]
    body: Optional[
        List[
            Union[
                "str",
                "str",
                "str",
                "str",
                "str",
                "str",
                "str",
                "Attribute",
                "BinaryExpression",
                "BlockExpression",
                "BooleanExpression",
                "ErrorPropagationExpression",
                "str",
                "FunctionCallExpression",
                "GenericParam",
                "Identifier",
                "IfExpression",
                "Implicit",
                "str",
                "LiteralExpression",
                "MatchExpression",
                "Param",
                "ParenthesizedExpression",
                "PathExpression",
                "PrimitiveType",
                "StructCtorCallExpression",
                "TupleExpression",
                "UnaryExpression",
                "str",
                "str",
            ]
        ]
    ]
    implicit: Optional[List["Implicit"]]
    name: List["Identifier"]
    parameter: Optional[List["Param"]]
    return_type: Optional[
        List[
            Union[
                "BinaryExpression",
                "BlockExpression",
                "BooleanExpression",
                "ErrorPropagationExpression",
                "FunctionCallExpression",
                "Identifier",
                "IfExpression",
                "LiteralExpression",
                "MatchExpression",
                "ParenthesizedExpression",
                "PathExpression",
                "PrimitiveType",
                "StructCtorCallExpression",
                "TupleExpression",
                "UnaryExpression",
            ]
        ]
    ]
    children: Optional[List[Union["Attribute", "GenericParam"]]]


class TupleExpression(TreeSitterNode):
    field_names = ["member"]
    member: Optional[
        List[
            Union[
                "BinaryExpression",
                "BlockExpression",
                "BooleanExpression",
                "ErrorPropagationExpression",
                "FunctionCallExpression",
                "Identifier",
                "IfExpression",
                "LiteralExpression",
                "MatchExpression",
                "ParenthesizedExpression",
                "PathExpression",
                "PrimitiveType",
                "StructCtorCallExpression",
                "TupleExpression",
                "UnaryExpression",
            ]
        ]
    ]
    children: None


class UnaryExpression(TreeSitterNode):
    field_names = ["operator", "rhs"]
    operator: Union["str", "str"]
    rhs: Union[
        "BinaryExpression",
        "BlockExpression",
        "BooleanExpression",
        "ErrorPropagationExpression",
        "FunctionCallExpression",
        "Identifier",
        "IfExpression",
        "LiteralExpression",
        "MatchExpression",
        "ParenthesizedExpression",
        "PathExpression",
        "PrimitiveType",
        "StructCtorCallExpression",
        "TupleExpression",
        "UnaryExpression",
    ]
    children: None


class Use(TreeSitterNode):
    field_names = ["name"]
    name: "PathExpression"
    children: Optional[List["Attribute"]]


class Comment(TreeSitterNode):
    field_names = []
    children: None


class Identifier(TreeSitterNode):
    field_names = []
    children: None


class IntegerLiteral(TreeSitterNode):
    field_names = []
    children: None


type_name_to_class = {
    "attribute": Attribute,
    "attribute_arguments": AttributeArguments,
    "binary_expression": BinaryExpression,
    "block_expression": BlockExpression,
    "boolean_expression": BooleanExpression,
    "else_clause": ElseClause,
    "else_if_clause": ElseIfClause,
    "enum": Enum,
    "error_propagation_expression": ErrorPropagationExpression,
    "expression_statement": ExpressionStatement,
    "extern_function": ExternFunction,
    "extern_type": ExternType,
    "free_function": FreeFunction,
    "function_call_expression": FunctionCallExpression,
    "generic_argument_path_segment": GenericArgumentPathSegment,
    "generic_param": GenericParam,
    "if_expression": IfExpression,
    "impl": Impl,
    "implicit": Implicit,
    "let_statement": LetStatement,
    "literal_expression": LiteralExpression,
    "match_arm": MatchArm,
    "match_expression": MatchExpression,
    "modifier": Modifier,
    "module": Module,
    "param": Param,
    "parenthesized_expression": ParenthesizedExpression,
    "path_expression": PathExpression,
    "pattern_enum": PatternEnum,
    "pattern_identifier": PatternIdentifier,
    "pattern_literal": PatternLiteral,
    "pattern_struct": PatternStruct,
    "pattern_tuple": PatternTuple,
    "primitive_type": PrimitiveType,
    "return_statement": ReturnStatement,
    "simple_path_segment": SimplePathSegment,
    "single_struct_argument": SingleStructArgument,
    "source_file": SourceFile,
    "struct": Struct,
    "struct_argument_tail": StructArgumentTail,
    "struct_ctor_call_expression": StructCtorCallExpression,
    "struct_pattern": StructPattern,
    "trait": Trait,
    "tuple_expression": TupleExpression,
    "unary_expression": UnaryExpression,
    "use": Use,
    "comment": Comment,
    "identifier": Identifier,
    "integer_literal": IntegerLiteral,
}
