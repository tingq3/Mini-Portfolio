/**
 * Test cases for POST /api/admin/repo/push
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

it.todo('Pushes latest changes');

it.todo('Gives a 400 error if there are no commits');

it.todo('Gives a 400 error if pushing fails due to conflicting commits on the origin');

it.todo("Gives a 400 error when data dir isn't using git");

it.todo('Gives a 400 when no data dir set up');

genTokenTests(
  () => api,
  async api => {},
);
