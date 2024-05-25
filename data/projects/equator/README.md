# Equator

Equator is a symbolic maths interpreter that parses, evaluates and solves
simultaneous equations, using the
[`sympy`](https://www.sympy.org/en/index.html) library. It features a terminal
interface built using ncurses.

```py
$ equator
 [1] > 1 + 1
     |   2
     |
 [2] > 2 * x = 8
     |   x = 4
     |
 [3] > 2*y = 5*x + 3; 4*y = x/2 -1
     |   x = -14/19
     |   y = -13/38
     |
 [4] > sin(x)^2 + cos(x)^2 = y; x = 5 * y
     |   x = 5
     |   y = 1
     |
 [5] > log_4(256)
     |   4
     |
 [6] > cos(2 * pi)
     |   1
```
