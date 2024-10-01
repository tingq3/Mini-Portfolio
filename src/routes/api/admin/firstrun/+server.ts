import { error, json } from '@sveltejs/kit';
import { dataDirContainsData, serverIsSetUp, getDataDir } from '$lib/server/data/dataDir';
import { mkdir } from 'fs/promises';
import { runSshKeyscan, setupGitignore, setupGitRepo, urlRequiresSsh } from '$lib/server/git';
import { authSetup } from '$lib/server/auth/setup';
import { initConfig } from '$lib/server/data/config';
import { initReadme } from '$lib/server/data/readme';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index';

// FIXME: Make this accept a username and password
export async function POST({ request, cookies }) {
  const { repoUrl, branch }: { repoUrl: string | null, branch: string | null }
    = await request.json();

  if (await serverIsSetUp()) {
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
    if (urlRequiresSsh(repoUrl)) {
      await runSshKeyscan(repoUrl);
    }
    await setupGitRepo(repoUrl, branch);
  } else {
    // Otherwise, just create the data dir empty
    // Discard errors for this, as the dir may already exist
    await mkdir(getDataDir()).catch(() => { });
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
