/**
 * Test cases for POST /api/admin/repo/commit
 */
import { it, expect, beforeEach, describe, vi } from 'vitest';
import { setup } from '../../helpers';
import gitRepos, { resetTestRepo } from '../../gitRepos';
import simpleGit from 'simple-git';
import { getDataDir } from '$lib/server/data/dataDir';
import genTokenTests from '../../tokenCase';
import apiClient, { type ApiClient } from '$endpoints';

// Git clone takes a while, increase the test timeout
vi.setConfig({ testTimeout: 15_000 });

it('Creates a commit with the current changes', async () => {
  const { api } = await setup(gitRepos.TEST_REPO_RW);
  // Get current commit hash
  const { repo: { commit } } = await api.admin.git.status();
  // Make some small change
  await api.readme.set(`# Test repo\n\nUpdated at ${Date()}`);
  const commitResult = await api.admin.git.commit('Updated repo');
  expect(commitResult).toMatchObject({
    // One commit ahead of origin
    ahead: 1,
  });
  expect(commitResult.commit).not.toStrictEqual(commit);
});

it("Gives a 400 error when data dir isn't using git", async () => {
  const { api } = await setup();
  await expect(api.admin.git.commit('Commit message')).rejects.toMatchObject({
    code: 400,
  });
});

it('Gives a 400 when no data dir set up', async () => {
  const api = apiClient();
  await expect(api.admin.git.commit('Commit message')).rejects.toMatchObject({
    code: 400,
  });
});

it('Gives a 400 when there are no current changes', async () => {
  const { api } = await setup(gitRepos.TEST_REPO_RW);
  // Need to do an earlier commit because a data migration may have occurred
  await api.admin.git.commit('First commit').catch(() => {});
  // Second commit fails as there are no changes
  await expect(api.admin.git.commit('Second commit')).rejects.toMatchObject({
    code: 400,
  });
});

describe('token test', () => {
  let api: ApiClient;
  beforeEach(async () => {
    api = (await setup()).api;
  });

  genTokenTests(
    () => api,
    async api => api.admin.git.commit('Commit message'),
  );
});
