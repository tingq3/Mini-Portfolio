# OS/161

[OS/161](http://os161.org/) is a teaching operating system developed at Harvard
University. It is intended to "feel like" the BSD operating system, but with
most advanced components removed.

I worked alongside another student to implement numerous features into the
operating system as a series of assignments for
[UNSW's COMP3891 "Extended Operating Systems" course](https://www.handbook.unsw.edu.au/undergraduate/courses/2022/COMP3891).

## Features implemented

### File handling

We implemented a file table, and used it to implement system calls for

* `open`
* `read`
* `write`
* `close`
* `dup2`

### Virtual memory subsystem

We created an externally-chained hashed page table to support virtual memory,
including support for [copy-on-write](https://en.wikipedia.org/wiki/Copy-on-write).
It dynamically allocates frames whenever a page fault occurs.
