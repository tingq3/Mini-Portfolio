import { error, json } from '@sveltejs/kit';
import { dataDirIsInit, dataDirUsesGit, getDataDir } from '$lib/server/data/dataDir';
import { validateToken, validateTokenFromRequest } from '$lib/server/auth.js';
import simpleGit from 'simple-git';
import { getPortfolioGlobals } from '$lib/server/data/index.js';

export async function GET({ request, cookies }) {
  await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  if (!await dataDirUsesGit()) {
    return json({ repo: null }, { status: 200 });
  }

  const repo = simpleGit(getDataDir());

  const status = await repo.status();
  return json(
    {
      repo: {
        url: (await repo.remote(['get-url', 'origin']) || '').trim(),
        branch: status.current,
        commit: await repo.revparse(['--short', 'HEAD']),
        clean: status.isClean()
      }
    },
    { status: 200 });
}
