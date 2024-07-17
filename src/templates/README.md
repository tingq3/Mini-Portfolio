# Portfolio data directory

This is the data repository for your portfolio. By default it is configured as
a Git repo, which can be used to perform backups, and to synchronize your data
between your main device and a server which hosts the main site.

## File layout

### `config.json`

Contains the global configuration for the portfolio site.

### `config.local.json`

Contains local configuration for the portfolio site. This file is not synced
to your portfolio git repository, as it contains critical information such as
authentication settings, as well as synchronization settings.

## `info.md`

Contains the landing page content for the portfolio site.

## Groups

Each directory contains information and data for a group, as well as the items
within that group.

### Group / `config.json`

The `config.json` for a group. This contains information about how the group
should be represented on the site.

### Group / `info.md`

Contains the landing page content for the group's page.

### Group / Item / `config.json`

The `config.json` for an item. This contains information about how the item
should be represented on the site.

### Group / Item / `info.md`

Contains the landing page content for the item's page.

## Other files

Other files may be present in the directory. They cannot be seen unless they
are linked to from a `config.json` file somewhere.
