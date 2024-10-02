import { validateTokenFromRequest } from '$lib/server/auth/tokens';
import { dataDirUsesGit, getDataDir } from '$lib/server/data/dataDir';
import { getRepoStatus } from '$lib/server/git';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/index';
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

  // Merge divergent changes
  await git.pull(['--no-rebase']).catch(e => error(400, `${e}`));
  const status = await getRepoStatus();

  if (status.commit === prevCommit) {
    error(400, 'No changes to pull');
  }

  invalidatePortfolioGlobals();
  return json(status, { status: 200 });
}
