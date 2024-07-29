/**
 * Test cases for POST /api/admin/repo
 */

it.todo('Blocks unauthorized users');

it.todo('Blocks access if data is already set up');

it.todo('Clones repo to the default branch when URL is provided');

it.todo("Gives an error if the repo doesn't contain a config.json, but isn't empty");

it.todo("Doesn't clone repo when no URL provided");

it.todo('Checks out a branch when one is given');

it.todo('Creates data/config.local.json when run');

it.todo('data/config.local.json has repo info when set up with a repo');

it.todo('data/config.local.json has null repo info when set up with no repo');
