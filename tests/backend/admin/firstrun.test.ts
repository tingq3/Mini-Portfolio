/**
 * Test cases for POST /api/admin/repo
 */
import api from '$endpoints';
import gitRepos from '../gitRepos';
import { it, describe, expect, vi } from 'vitest';
import simpleGit, { CheckRepoActions } from 'simple-git';
// Yucky import
import type { FirstRunOptions } from '../../../src/routes/api/admin/firstrun/+server';
import { invalidIds, validIds } from '../consts';
import { getDataDir } from '$lib/server/data/dataDir';

// Git clone takes a while, increase the test timeout
vi.setConfig({ testTimeout: 15_000 });

const REPO_PATH = getDataDir();

/** Make a simpleGit for the repo */
const repo = () => simpleGit(REPO_PATH);

/** Helper function for firstrun testing */
async function firstrun(options: Partial<FirstRunOptions> = {}) {
  const defaults: FirstRunOptions = {
    username: 'admin',
    password: 'abc123ABC!',
    repoUrl: undefined,
    branch: undefined,
  };

  const combined = { ...defaults, ...options };

  return api().admin.firstrun(
    combined.username,
    combined.password,
    combined.repoUrl,
    combined.branch,
  );
}

describe('username', () => {
  // Only ID characters are allowed as usernames
  it.each(invalidIds)('Rejects invalid usernames ($case)', async ({ id }) => {
    await expect(firstrun({ username: id }))
      .rejects.toMatchObject({ code: 400 });
  });

  it.each(validIds)('Accepts valid usernames ($case)', async ({ id }) => {
    await expect(firstrun({ username: id })).toResolve();
  });
});

describe('password', () => {
  it('Rejects insecure passwords', async () => {
    await expect(firstrun({ password: 'insecure' }))
      .rejects.toMatchObject({ code: 400 });
  });
});

describe('git', () => {
  it('Clones repo to the default branch when URL is provided', async () => {
    await firstrun({ repoUrl: gitRepos.TEST_REPO_RW });
    await expect(repo().checkIsRepo(CheckRepoActions.IS_REPO_ROOT))
      .resolves.toStrictEqual(true);
    // Default branch for this repo is 'main'
    await expect(repo().status()).resolves.toMatchObject({ current: 'main' });
  });

  it("Gives an error if the repo doesn't contain a config.json, but isn't empty", async () => {
    await expect(firstrun({ repoUrl: gitRepos.NON_PORTFOLIO }))
      .rejects.toMatchObject({ code: 400 });
  }, 10000);

  it("Doesn't give an error if the repository is entirely empty", async () => {
    await firstrun({ repoUrl: gitRepos.EMPTY });
    await expect(repo().checkIsRepo(CheckRepoActions.IS_REPO_ROOT))
      .resolves.toStrictEqual(true);
  });

  it.only('Checks out a branch when one is given', async () => {
    await firstrun({ repoUrl: gitRepos.TEST_REPO_RW, branch: 'example' });
    // Check branch name matches
    await expect(repo().status()).resolves.toMatchObject({ current: 'example' });
  });

  it('Gives an error if the repo URL cannot be cloned', async () => {
    await expect(firstrun({ repoUrl: gitRepos.INVALID }))
      .rejects.toMatchObject({ code: 400 });
  });
});

it('Gives a token on success', async () => {
  await expect(firstrun())
    .resolves.toMatchObject({
      credentials: { token: expect.any(String) }
    });
});

it('Blocks access if data is already set up', async () => {
  await firstrun();
  await expect(firstrun()).rejects.toMatchObject({ code: 403 });
});

it("Doesn't clone repo when no URL provided", async () => {
  await firstrun();
  await expect(repo().checkIsRepo(CheckRepoActions.IS_REPO_ROOT))
    .resolves.toStrictEqual(false);
});
