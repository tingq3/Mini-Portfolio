# VC Compiler

VC is a compiler written in Java that converts a C-like language into Jasmin
assembly. This was a university assignment I completed for UNSW's
[Programming Languages and Compilers](https://www.handbook.unsw.edu.au/undergraduate/courses/2022/COMP3131/?year=2022)
course. Although the project framework and some utility code was provided as
starter code, the scanner, parser, checker and emitter were all programmed by
me.

## Scanner and parser

The compiler uses a top-down parser to tokenise input files and generate an
abstract syntax tree.

## Static analyser

The VC programming language is a strongly-typed programming language. During
compilation, my compiler checks for numerous errors, including:

* Redeclared identifiers
* Identifiers with the `void` type
* Undeclared identifiers
* Incompatible types for `return`, variable assignment and operators
* Invalid types in array initializers
* Non-boolean types for `if` and `while` statements
* Incorrect function calling signature
* Unreachable code

## Code-gen

The compiler outputs files in the [Jasmin assembly](https://jasmin.sourceforge.net/)
format. These are then assembled into Java bytecode.
