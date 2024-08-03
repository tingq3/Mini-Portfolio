# Repo secrets

This directory contains secrets used during CI.

## `id_ed25519`

SSH key. Since the app has Git integration, this SSH key is used to access a
small number of repos used for testing purposes.

### Granting access to a GitHub repo

1. Copy the public key from `.github/workflows/secrets/id_ed25519.pub`
2. Visit the "Deploy keys" settings for the repo you wish to grant access to.
3. Choose to add a new key, and paste the public key. Ensure you allow write
   access.

The test suite should then be able to clone and push to the repo in CI.

### How it works

See [this answer on StackOverflow](https://stackoverflow.com/a/76888551/6335363).
