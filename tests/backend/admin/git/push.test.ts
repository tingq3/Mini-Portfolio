/**
 * Test cases for POST /api/admin/repo/push
 */
import { it, expect, beforeEach, describe, vi } from 'vitest';
import { forceRewindDataRepoGit, setup } from '../../helpers';
import makeClient, { type ApiClient } from '$endpoints';
import gitRepos from '../../gitRepos';
import genTokenTests from '../../tokenCase';

// Git clone takes a while, increase the test timeout
vi.setConfig({ testTimeout: 15_000 });

// NOTE: This test is disabled as running it on multiple devices causes race
// conditions, which is very confusing to debug. Also it was creating a ton
// of bogus commits on my main account whenever I ran the test suite, which was
// annoying.
// it('Pushes latest changes', async () => {
//   const { api } = await setup(gitRepos.TEST_REPO_RW);
//   await updateTestReadme(api);
//   // Now push, we should then be zero commits ahead of the origin
//   await expect(api.admin.git.push()).resolves.toMatchObject({ ahead: 0 });
// });

it('Gives a 400 error if there are no commits to push', async () => {
  const { api } = await setup(gitRepos.TEST_REPO_RW);
  await expect(api.admin.git.push()).rejects.toMatchObject({ code: 400 });
});

it('Gives a 400 error if pushing fails due to conflicting commits on the origin', async () => {
  const { api } = await setup(gitRepos.TEST_REPO_RW);
  await forceRewindDataRepoGit(api);
  await updateTestReadme(api);
  // We have successfully created divergent branches
  await expect(api.admin.git.push()).rejects.toMatchObject({ code: 400 });
});

it("Gives a 400 error when data dir isn't using git", async () => {
  const { api } = await setup();
  await expect(api.admin.git.push()).rejects.toMatchObject({ code: 400 });
});

it('Gives a 400 when no data dir set up', async () => {
  await expect(makeClient().admin.git.push()).rejects.toMatchObject({ code: 400 });
});

describe('token tests', () => {
  let api: ApiClient;

  beforeEach(async () => {
    api = (await setup()).api;
  });

  genTokenTests(
    () => api,
    async api => api.admin.git.push(),
  );
});

/** Update the main README.md */
async function updateTestReadme(api: ApiClient) {
  const { readme } = await api.readme.get();
  const idx = readme.indexOf('This repo was automatically updated');
  const newReadme = `${readme.slice(0, idx - 1)}\nThis repo was automatically updated by the test suite at time ${Date()}\n`;
  await api.readme.set(newReadme);
  await api.admin.git.commit('🤖 Automatic bot commit, testing Minifolio');
}
