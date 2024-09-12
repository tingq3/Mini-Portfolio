/**
 * Test cases for POST /api/admin/repo/pull
 */
import { it, expect, beforeEach } from 'vitest';
import { setup } from '../../helpers';
import makeClient, { type ApiClient } from '$endpoints';
import gitRepos from '../../gitRepos';
import simpleGit from 'simple-git';
import { getDataDir } from '$lib/server/data/dataDir';
import genTokenTests from '../../tokenCase';

let api: ApiClient;

beforeEach(async () => {
  api = (await setup()).api;
});

it.todo('Pulls latest changes');

it.todo('Latest changes are applied by invalidating globals');

it.todo("Gives a 400 error when data dir isn't using git");

it.todo('Gives a 400 when no data dir set up');

genTokenTests(
  () => api,
  async api => {},
);
