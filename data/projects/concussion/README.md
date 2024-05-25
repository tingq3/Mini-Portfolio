# Concussion Shell

Concussion Shell is a simple shell written in Python. It runs inside a Python
REPL, and horrifically abuses operator overloading as well as Python's global
variables system in order to create a shell-like experience that is just
similar enough to Bash to be disconcerting.

While this project may seem like a joke (and it is), I believe it demonstrates
my breadth of knowledge when it comes to programming in Python. This includes:

* Running a REPL embedded within a program.
* Overriding the `globals` scope to add interesting features to the shell.
* Running executables, and handling their inputs and outputs, including pipes.
