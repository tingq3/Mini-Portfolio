/**
 * Code for setting up public data.
 */

import { mkdir } from 'fs/promises';
import { runSshKeyscan, setupGitRepo, urlRequiresSsh } from '../git';
import { dataIsSetUp, getDataDir } from './dataDir';
import { initConfig } from './config';
import { initReadme } from './readme';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '.';
import { error } from '@sveltejs/kit';

/**
 * Set up the data directory.
 *
 * This returns whether it is the data is new (ie the git repo is empty, or git
 * isn't in use).
 */
export async function setupData(repoUrl?: string, branch?: string): Promise<boolean> {
  // If we were given a repoUrl, set it up
  if (repoUrl) {
    if (urlRequiresSsh(repoUrl)) {
      await runSshKeyscan(repoUrl);
    }
    await setupGitRepo(repoUrl, branch);
  } else {
    // Otherwise, just create the data dir empty
    // Discard errors for this, as the dir may already exist
    await mkdir(getDataDir(), { recursive: true }).catch(() => { });
    // Currently, gitignore is not needed, since private data is now stored
    // separately
    // await setupGitignore();
  }

  /**
   * Whether the data repo is empty -- true if data dir was empty before
   * firstrun.
   */
  let firstTime = false;

  // If data dir is empty, set up default configuration
  if (!await dataIsSetUp()) {
    firstTime = true;
    await initConfig();
    // Also set up a default README
    await initReadme();
  }

  // Attempt to forcefully load global data
  invalidatePortfolioGlobals();
  try {
    await getPortfolioGlobals();
  } catch (e) {
    console.log(e);
    error(400, `Error loading data: ${e}`);
  }

  return firstTime;
}
