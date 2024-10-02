import { getPortfolioGlobals } from '$lib/server';
import { redirectOnInvalidToken } from '$lib/server/auth/tokens';
import { dataDirUsesGit } from '$lib/server/data/dataDir';
import { getRepoStatus } from '$lib/server/git';

export async function load(req) {
  const globals = await getPortfolioGlobals();
  await redirectOnInvalidToken(req, '/admin/login');
  const repo = await dataDirUsesGit() ? await getRepoStatus() : null;
  return { globals, repo };
}
