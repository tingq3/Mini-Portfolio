import { validateTokenFromRequest } from '$lib/server/auth/tokens';
import { dataDirUsesGit, getDataDir } from '$lib/server/data/dataDir';
import { getRepoStatus } from '$lib/server/git';
import { getPortfolioGlobals } from '$lib/server/index';
import { error, json } from '@sveltejs/kit';
import simpleGit from 'simple-git';
import { object, string, validate } from 'superstruct';

export async function POST({ request, cookies }) {
  await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  if (!await dataDirUsesGit()) {
    error(400, 'Data dir is not a git repo');
  }

  const [err, options] = validate(await request.json(), object({ message: string() }));

  if (err) {
    error(400, `${err}`);
  }

  const git = simpleGit(getDataDir());

  const changes = await git.status();
  if (!changes.files.length) {
    error(400, 'No changes present');
  }

  // Add all changes
  await git.add('.');
  await git.commit(options.message);

  return json(await getRepoStatus(), { status: 200 });
}
