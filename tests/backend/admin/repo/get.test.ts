/**
 * Test cases for GET /api/admin/repo
 */
import { it, expect } from 'vitest';
import { setup } from '../../helpers';
import api from '$endpoints';
import gitRepos from '../../gitRepos';
import simpleGit from 'simple-git';
import { getDataDir } from '$lib/server/data/dataDir';

it('Blocks unauthorized users', async () => {
  const { api } = await setup();
  await expect(api.withToken(undefined).admin.repo.get()).rejects.toMatchObject({ code: 401 });
});

it('Gives a 400 when no data directory is set up', async () => {
  const { api } = await setup();
  await api.debug.clear();
  await expect(api.admin.repo.get()).rejects.toMatchObject({ code: 400 });
});

it('Correctly returns repo info when a repo is set up', { timeout: 15_000 }, async () => {
  const { token } = (await api().admin.firstrun(gitRepos.TEST_REPO_RW, null)).credentials;
  const repo = simpleGit(getDataDir());
  await expect(api(token).admin.repo.get()).resolves.toStrictEqual({
    repo: {
      url: gitRepos.TEST_REPO_RW,
      branch: 'main',
      commit: await repo.revparse(['--short', 'HEAD']),
      // A data migration may have been performed, which would lead to an
      // unclean git tree
      clean: expect.any(Boolean),
      ahead: 0,
      behind: 0,
      // No nice way to expect string[]
      changes: expect.any(Array),
    }
  });
});

it('Correctly returns null info when a repo is not set up', async () => {
  const { api } = await setup();
  await expect(api.admin.repo.get()).resolves.toStrictEqual({
    repo: null,
  });
});
