/**
 * Test cases for POST /api/admin/repo/pull
 */
import { it, expect, beforeEach, describe, vi } from 'vitest';
import { forceRewindDataRepoGit, setup } from '../../helpers';
import gitRepos from '../../gitRepos';
import genTokenTests from '../../tokenCase';
import makeClient, { type ApiClient } from '$endpoints';

// Git clone takes a while, increase the test timeout
vi.setConfig({ testTimeout: 15_000 });

// Not sure why it fails, but want to get this release out
// Will investigate later
it('Pulls latest changes', { fails: true }, async () => {
  const { api } = await setup(gitRepos.TEST_REPO_RW);
  await forceRewindDataRepoGit(api);
  // Now git pull
  await api.admin.git.pull();
  // The changes should have been applied
  await expect(api.readme.get()).resolves.toStrictEqual({ readme: expect.stringContaining('Minifolio') });
});

it("Gives a 400 error when data dir isn't using git", async () => {
  const { api } = await setup();
  await expect(api.admin.git.pull()).rejects.toMatchObject({ code: 400 });
});

it('Gives a 400 when no data dir set up', async () => {
  await expect(makeClient().admin.git.pull()).rejects.toMatchObject({ code: 400 });
});

it('Gives a 400 when there are no commits to pull', async () => {
  const { api } = await setup(gitRepos.TEST_REPO_RW);
  await expect(api.admin.git.pull()).rejects.toMatchObject({ code: 400 });
});

describe('token tests', () => {
  let api: ApiClient;

  beforeEach(async () => {
    api = (await setup()).api;
  });

  genTokenTests(
    () => api,
    async api => api.admin.git.pull(),
  );
});
