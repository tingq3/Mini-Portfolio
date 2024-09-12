import { error, json } from '@sveltejs/kit';
import { dataDirUsesGit } from '$lib/server/data/dataDir';
import { validateTokenFromRequest } from '$lib/server/auth.js';
import { getPortfolioGlobals } from '$lib/server/data/index.js';
import { getRepoStatus } from '$lib/server/git.js';

export async function GET({ request, cookies }) {
  await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  if (!await dataDirUsesGit()) {
    return json({ repo: null }, { status: 200 });
  }

  return json({ repo: await getRepoStatus() }, { status: 200 });
}
