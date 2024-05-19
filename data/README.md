# Data

This directory contains the data used to generate the site. It's in the public
directory so that the images can be delivered at runtime and stuff. That's
kinda yucky but the alternative is to have a separate server for them which is
even more yucky.

* [`projects/`](./projects/): projects I have created or significantly
  contributed to.
* [`frameworks/`](./frameworks/): software frameworks
* [`languages/`](./languages/): programming languages
* [`skills/`](./skills/): skills relevant to software engineering
* [`config.json`](./config.json): overall site configuration

## Build system

In order to construct a website, the data from this directory is gathered and
processed within the server to create a (semi?) static website.
