/**
 * Test cases for POST /api/admin/repo
 */
import api from '$api';
import { it, describe, expect, vi } from 'vitest';
import simpleGit, { CheckRepoActions } from 'simple-git';

// Git clone takes a while, increase the test timeout
vi.setConfig({ testTimeout: 15_000 })

const REPO_PATH = process.env.DATA_REPO_PATH;

const repo = () => simpleGit(REPO_PATH);

describe.sequential('POST /api/admin/repo', () => {
  it('Gives auth credentials on success', async () => {
    await expect(api.admin.firstrun('git@github.com:MadGutsBot/Example.git', null))
      .resolves.toStrictEqual({
        username: 'admin',
        password: expect.any(String),
        token: expect.any(String),
      });
  });

  it('Clones repo to the default branch when URL is provided', async () => {
    await api.admin.firstrun('git@github.com:MadGutsBot/Example.git', null);
    await expect(repo().checkIsRepo(CheckRepoActions.IS_REPO_ROOT)).resolves.toStrictEqual(true);
  });

  it('Blocks access if data is already set up', async () => {
    await api.admin.firstrun('git@github.com:MadGutsBot/Example.git', null);
    await expect(
      api.admin.firstrun('git@github.com:MadGutsBot/Example.git', null)
    ).rejects.toMatchObject({ code: 403 });
  });

  it("Gives an error if the repo doesn't contain a config.json, but isn't empty", async () => {
    await expect(
      api.admin.firstrun('git@github.com:MadGutsBot/MadGutsBot.github.io', null)
    ).rejects.toMatchObject({ code: 400 });
  }, 10000);

  it("Doesn't give an error if the repository is entirely empty", async () => {
    await api.admin.firstrun('git@github.com:MadGutsBot/Empty.git', null);
    await expect(repo().checkIsRepo(CheckRepoActions.IS_REPO_ROOT)).resolves.toStrictEqual(true);
  });

  it("Doesn't clone repo when no URL provided", async () => {
    await api.admin.firstrun(null, null);
    await expect(repo().checkIsRepo(CheckRepoActions.IS_REPO_ROOT)).resolves.toStrictEqual(false);
  });

  it('Checks out a branch when one is given', async () => {
    await api.admin.firstrun('git@github.com:MadGutsBot/Example.git', 'example');
    // Check branch name matches
    expect((await repo().status()).current).toStrictEqual('example');
  });

  it('Gives an error if the repo URL cannot be cloned', async () => {
    await expect(
      api.admin.firstrun('git@github.com:MadGutsBot/Invalid-Repo', null)
    ).rejects.toMatchObject({ code: 400 });
  });

  it.todo('Initialises config.local.json within the data repo');

  it.todo('Adds config.local.json to the gitignore');

  it.todo('Leaves the .gitignore as-is if config.local.json is already there');
});
