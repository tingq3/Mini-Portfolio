# Setup process

1. User specifies a data repository URL, which is then cloned.
2. If the repo is empty, some default data is configured:
    * `config.json` with the site's default configuration
    * `.gitignore` with a simple gitignore to ignore the local configuration
3. Otherwise, the `.gitignore` is checked to ensure that `config.local.json`
   will be ignored (lest auth information be leaked).
4. The user enters auth information, which is saved alongside local config
   to `config.local.json`
5. The site is then set up, and the user can configure things as required
