/**
 * Test cases for POST /api/admin/repo/init
 */
import { it, expect, beforeEach } from 'vitest';
import { setup } from '../../helpers';
import gitRepos from '../../gitRepos';
import simpleGit from 'simple-git';
import { getDataDir } from '$lib/server/data/dataDir';
import genTokenTests from '../../tokenCase';
import type { ApiClient } from '$endpoints';

let api: ApiClient;

beforeEach(async () => {
  api = (await setup()).api;
});

it.todo('Initializes the git repo with the given upstream URL');

it.todo('Gives a 400 if the repo is already set up');

it.todo('Gives a 400 if the repo contains content already');

it.todo('Gives a 400 if the repo does not exist');

genTokenTests(
  () => api,
  async api => {},
);
