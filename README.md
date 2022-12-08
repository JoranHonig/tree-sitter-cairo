## 🌴 tree-sitter-cairo
[![Node.js CI](https://github.com/JoranHonig/tree-sitter-cairo/actions/workflows/grammar_tests.yml/badge.svg)](https://github.com/JoranHonig/tree-sitter-cairo/actions/workflows/grammar_tests.yml)
[![npm version](https://badge.fury.io/js/tree-sitter-cairo.svg)](https://badge.fury.io/js/tree-sitter-cairo)

> 💡 this grammar is still in development, the structure of the generated AST is not stable

This repository contains a grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

The goal of this project is to provide an efficient low-dependency parser for cairo 1.0 which is designed to enable metaprogramming.

### Navigating this repository
The primary file in this repository is `grammar.js` which describes the tree-sitter grammar.

```
# Primary file:
grammar.js
# Tests:
/test/**/*

# Auto generated:
/src/**/*
index.js
binding.gyp
```

### References
-> Language Examples
https://github.com/starkware-libs/cairo/blob/main/examples

-> Soft language specification
https://github.com/starkware-libs/cairo/blob/main/crates/syntax_codegen/src/cairo_spec.rs

-> Cairo pre 1.0 grammar
https://github.com/archseer/tree-sitter-cairo