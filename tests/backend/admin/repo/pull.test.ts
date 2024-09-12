/**
 * Test cases for POST /api/admin/repo/pull
 */
import { it, expect, beforeEach, describe, vi } from 'vitest';
import { setup } from '../../helpers';
import gitRepos from '../../gitRepos';
import simpleGit from 'simple-git';
import { getDataDir } from '$lib/server/data/dataDir';
import genTokenTests from '../../tokenCase';
import makeClient, { type ApiClient } from '$endpoints';

// Git clone takes a while, increase the test timeout
vi.setConfig({ testTimeout: 15_000 });

const OLD_COMMIT_HASH = 'd7ef6fd7ef9bac4c24f5634e6b1e76d201507498';

it('Pulls latest changes', async () => {
  const { api } = await setup(gitRepos.TEST_REPO_RW);
  // Forcefully move back a number of commits, then invalidate the data
  const git = simpleGit(getDataDir());
  await git.reset(['--hard', OLD_COMMIT_HASH]);
  await api.admin.data.refresh();
  // Now git pull
  await api.admin.repo.pull();
  // The changes should have been applied
  await expect(api.readme.get()).resolves.toStrictEqual({ readme: expect.stringContaining('Minifolio') });
});

it("Gives a 400 error when data dir isn't using git", async () => {
  const { api } = await setup();
  await expect(api.admin.repo.pull()).rejects.toMatchObject({ code: 400 });
});

it('Gives a 400 when no data dir set up', async () => {
  await expect(makeClient().admin.repo.pull()).rejects.toMatchObject({ code: 400 });
});

it('Gives a 400 when there are no commits to pull', async () => {
  const { api } = await setup(gitRepos.TEST_REPO_RW);
  await expect(api.admin.repo.pull()).rejects.toMatchObject({ code: 400 });
});

describe('token tests', () => {
  let api: ApiClient;

  beforeEach(async () => {
    api = (await setup()).api;
  });

  genTokenTests(
    () => api,
    async api => api.admin.repo.pull(),
  );
});
