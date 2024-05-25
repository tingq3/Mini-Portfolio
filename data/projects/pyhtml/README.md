# PyHTML Enhanced

PyHTML Enhanced is a library for generating HTML documents. It is inspired by
(and similar to) [Cenk Altı's PyHTML library](https://github.com/cenkalti/pyhtml),
but with improved documentation and type safety.

The library has been used by over 100 students in
[UNSW's COMP1010 course](https://www.handbook.unsw.edu.au/undergraduate/courses/2024/COMP1010),
allowing them to create advanced and dynamic websites, with full IDE support
and type safety for all HTML tags. The advanced editor support means that the
library is accessible and intuitive, even for students with no prior
programming experience.

```py
>>> import pyhtml as p
>>> my_website = p.html(
...     p.head(
...         p.title("Hello, world!"),
...         p.script(src="http://example.com/script.js"),
...     ),
...     p.body(
...         p.h1("Hello, world!"),
...         p.p("This is my amazing website!"),
...     ),
... )
>>> print(str(my_website))
<!DOCTYPE html>
<html>
  <head>
    <title>
      Hello, world!
    </title>
    <script type="text/javascript" src="http://example.com/script.js"></script>
  </head>
  <body>
    <h1>
      Hello, world!
    </h1>
    <p>
      This is my amazing website!
    </p>
  </body>
</html>
```
