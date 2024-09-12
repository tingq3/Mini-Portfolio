/**
 * Test cases for POST /api/admin/repo/init
 */
import { it, expect, beforeEach, describe, vi } from 'vitest';
import { setup } from '../../helpers';
import gitRepos, { resetTestRepo } from '../../gitRepos';
import simpleGit from 'simple-git';
import { getDataDir } from '$lib/server/data/dataDir';
import genTokenTests from '../../tokenCase';
import type { ApiClient } from '$endpoints';

// Git clone takes a while, increase the test timeout
vi.setConfig({ testTimeout: 15_000 });

it('Initializes the git repo with the given upstream URL', async () => {
  const api = (await setup()).api;
  await expect(api.admin.git.init(gitRepos.EMPTY)).resolves.toMatchObject({
    url: gitRepos.EMPTY,
  });
});

it('Gives a 400 if the repo is already set up', async () => {
  const api = (await setup(gitRepos.EMPTY)).api;
  await expect(api.admin.git.init(gitRepos.TEST_REPO_RW))
    .rejects.toMatchObject({ code: 400 });
});

it('Gives a 400 if the upstream repo contains content already', async () => {
  const api = (await setup()).api;
  await expect(api.admin.git.init(gitRepos.TEST_REPO_RW)).rejects.toMatchObject({
    code: 400,
  });
});

it('Gives a 400 if the upstream repo does not exist', async () => {
  const api = (await setup()).api;
  await expect(api.admin.git.init(gitRepos.INVALID)).rejects.toMatchObject({
    code: 400,
  });
});

describe('token tests', async () => {
  let api: ApiClient;

  beforeEach(async () => {
    api = (await setup()).api;
  });
  genTokenTests(
    () => api,
    async api => api.admin.git.init(gitRepos.TEST_REPO_RW),
  );
});
