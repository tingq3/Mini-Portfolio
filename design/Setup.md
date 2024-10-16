# Setup process

## 1. Account creation

The user creates the initial account, which triggers the private data setup.

## 2. Data initialization

The user then chooses how to initialize the repo:

* From a `git` repo. The repo is cloned.
* Empty, meaning a new blank repository is created.

The user is also given the options to control how the server uses SSH keys.
Allowed options are:

* Generate an SSH key-pair, stored within the private data.
* Use an existing private key given its path.
* Use the default SSH identity, which works best if the app is running on an
  account with existing SSH access.
