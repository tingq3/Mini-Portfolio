/**
 * Git repo constants
 *
 * This file contains constants used to determine which git repos are used by
 * the test suite.
 *
 * Ideally, they should be repos that the CI has access to, so that it can
 * clone, and potentially pull and push it.
 *
 * See the instructions in `.github/workflows/secrets/README.md`
 */

import api from '$endpoints';
import { getDataDir } from '$lib/server/data/dataDir';
import simpleGit from 'simple-git';
import fs from 'fs/promises';

/** Test repository containing sample portfolio data. Full read/write access */
export const TEST_REPO_RW = 'git@github.com:MadGutsBot/Portfolio-Test-Repo.git';

/** Remove all commits from the test repo */
export async function resetTestRepo() {
  await api().debug.clear();
  await fs.mkdir(getDataDir());
  const git = simpleGit(getDataDir());
  await git.init()
    .checkoutLocalBranch('main')
    .addRemote('origin', TEST_REPO_RW)
    // FIXME: This doesn't work, need to find a way to reset the remote to an
    // empty state
    .push(['--force', '--set-upstream', 'origin', 'main']);
}

/** Repository that contains real-world data. Read-only access */
export const REAL_PORTFOLIO = 'https://github.com/MaddyGuthridge/portfolio-data.git';

/** Repository that doesn't contain portfolio data. Read-only access */
export const NON_PORTFOLIO_REPO = 'https://github.com/MadGutsBot/MadGutsBot.github.io.git';

/** Empty repository. Read-only access */
export const EMPTY_REPO = 'https://github.com/MadGutsBot/Empty.git';

/** Repository that does not exist */
export const INVALID_REPO = 'https://github.com/MadGutsBot/Invalid-Repo.git';

export default {
  TEST_REPO_RW,
  REAL_PORTFOLIO,
  NON_PORTFOLIO: NON_PORTFOLIO_REPO,
  INVALID: INVALID_REPO,
  EMPTY: EMPTY_REPO,
};
