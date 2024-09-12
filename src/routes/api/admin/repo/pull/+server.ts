import { validateTokenFromRequest } from '$lib/server/auth.js';
import { dataDirUsesGit, getDataDir } from '$lib/server/data/dataDir.js';
import { getRepoStatus } from '$lib/server/git.js';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/index.js';
import { error, json } from '@sveltejs/kit';
import simpleGit from 'simple-git';

export async function POST({ request, cookies }) {
  await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  if (!await dataDirUsesGit()) {
    error(400, 'Data dir is not a git repo');
  }

  const git = simpleGit(getDataDir());

  const { commit: prevCommit } = await getRepoStatus();

  await git.pull().catch(e => error(400, `${e}`));
  const status = await getRepoStatus();

  if (status.commit === prevCommit) {
    error(400, 'No changes to pull');
  }

  invalidatePortfolioGlobals();
  return json(status, { status: 200 });
}
