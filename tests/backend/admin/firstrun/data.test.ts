/**
 * Test cases for POST /api/admin/repo
 */
import api, { type ApiClient } from '$endpoints';
import gitRepos from '../../gitRepos';
import { it, describe, expect, vi, beforeEach } from 'vitest';
import simpleGit, { CheckRepoActions } from 'simple-git';
// Yucky import
import type { FirstRunDataOptions } from '../../../../src/routes/api/admin/firstrun/data/+server';
import { getDataDir } from '$lib/server/data/dataDir';
import genTokenTests from '../../tokenCase';

// Git clone takes a while, increase the test timeout
vi.setConfig({ testTimeout: 15_000 });

const REPO_PATH = getDataDir();

/** Make a simpleGit for the repo */
const repo = () => simpleGit(REPO_PATH);

async function accountSetup() {
  const { token } = await api().admin.firstrun.account('admin', 'abc123ABC$');
  return token;
}

/** Helper function for firstrun testing */
async function firstrunData(token: string, options: Partial<FirstRunDataOptions> = {}) {
  const defaults: FirstRunDataOptions = {
    repoUrl: undefined,
    branch: undefined,
  };

  const combined = { ...defaults, ...options };


  return api(token).admin.firstrun.data(
    combined.repoUrl,
    combined.branch,
  );
}

describe('git', () => {
  it('Clones repo to the default branch when URL is provided', async () => {
    const token = await accountSetup();
    await firstrunData(token, { repoUrl: gitRepos.TEST_REPO_RW });
    await expect(repo().checkIsRepo(CheckRepoActions.IS_REPO_ROOT))
      .resolves.toStrictEqual(true);
    // Default branch for this repo is 'main'
    await expect(repo().status()).resolves.toMatchObject({ current: 'main' });
  });

  it("Gives an error if the repo doesn't contain a config.json, but isn't empty", async () => {
    const token = await accountSetup();
    await expect(firstrunData(token, { repoUrl: gitRepos.NON_PORTFOLIO }))
      .rejects.toMatchObject({ code: 400 });
  }, 10000);

  it("Doesn't give an error if the repository is entirely empty", async () => {
    const token = await accountSetup();
    await firstrunData(token, { repoUrl: gitRepos.EMPTY });
    await expect(repo().checkIsRepo(CheckRepoActions.IS_REPO_ROOT))
      .resolves.toStrictEqual(true);
  });

  it('Checks out a branch when one is given', async () => {
    const token = await accountSetup();
    await firstrunData(token, { repoUrl: gitRepos.TEST_REPO_RW, branch: 'example' });
    // Check branch name matches
    await expect(repo().status()).resolves.toMatchObject({ current: 'example' });
  });

  it('Gives an error if the repo URL cannot be cloned', async () => {
    const token = await accountSetup();
    await expect(firstrunData(token, { repoUrl: gitRepos.INVALID }))
      .rejects.toMatchObject({ code: 400 });
  });
});

it('Blocks access if data is already set up', async () => {
  const token = await accountSetup();
  await firstrunData(token);
  await expect(firstrunData(token)).rejects.toMatchObject({ code: 403 });
});

it("Doesn't clone repo when no URL provided", async () => {
  const token = await accountSetup();
  await firstrunData(token);
  await expect(repo().checkIsRepo(CheckRepoActions.IS_REPO_ROOT))
    .resolves.toStrictEqual(false);
});

describe('token cases', () => {
  let client: ApiClient;

  beforeEach(async () => {
    const token = await accountSetup();
    client = api(token);
  });

  genTokenTests(
    () => client,
    api => api.admin.firstrun.data(),
  );
});
