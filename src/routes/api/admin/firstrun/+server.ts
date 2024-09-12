import { error, json } from '@sveltejs/kit';
import { dataDirContainsData, dataDirIsInit, getDataDir } from '$lib/server/data/dataDir';
import { mkdir } from 'fs/promises';
import { setupGitignore, setupGitRepo } from '$lib/server/git';
import { authSetup } from '$lib/server/auth';
import { initConfig } from '$lib/server/data/config';
import { initReadme } from '$lib/server/data/readme';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index';

export async function POST({ request, cookies }) {
  const { repoUrl, branch }: { repoUrl: string | null, branch: string | null }
    = await request.json();

  if (await dataDirIsInit()) {
    error(403);
  }

  if (repoUrl === '') {
    error(400, 'Repo URL must be a non-empty string or `null`');
  }
  if (branch === '') {
    error(400, 'Branch must be a non-empty string or `null`');
  }

  // If we were given a repoUrl, set it up
  if (repoUrl) {
    await setupGitRepo(repoUrl, branch);
  } else {
    // Otherwise, just create the data dir empty
    await mkdir(getDataDir());
    // Setup a gitignore just in case
    await setupGitignore();
  }

  // Now set up auth
  const credentials = await authSetup(cookies);

  /**
   * Whether the data repo is empty -- true if data dir was empty before
   * firstrun.
   */
  let firstTime = false;

  // If data dir is empty, set up default configuration
  if (!await dataDirContainsData()) {
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

  return json({ credentials, firstTime }, { status: 200 });
}
