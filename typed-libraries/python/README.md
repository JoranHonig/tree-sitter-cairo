# tree-sitter-cairo

This is an automatically generated python package using [python-tree-sitter-types](https://github.com/JoranHonig/python-tree-sitter-types).

It provides nice typed bindings for the tree-sitter raw parser.

### Installation

```bash
pip install tree-sitter-cairo
```

### Example

```python

from tree_sitter_cairo import load_language, parse_node
from tree_sitter import Parser

language = load_language('tree-sitter-cairo', 'cairo')

parser = Parser()
parser.set_language(language)

tree = parser.parse(bytes("<some cairo code>", "utf-8"))

typed_tree = parse_node(tree.root_node)

# Your cool clean code:
```