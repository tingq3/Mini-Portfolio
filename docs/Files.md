# File locations in Minifolio

## Data directory

Determined using environment variable `DATA_REPO_PATH`.

Main portfolio data. Should be backed up using a `git` repo.

### `config.json`

Main site configuration.

## Private data directory

Determined using environment variable `PRIVATE_DATA_PATH`.

Contains private data, including credentials and authentication secrets.

### `config.local.json`

Contains the local configuration of the server, including credentials and token
info.

### `id_ed25519`, `id_ed25519.pub`

SSH key used by the server. These are used to perform git operations over SSH.

### `auth.secret`

Contains the authentication secret used by the server. This is used to validate
JWTs.
