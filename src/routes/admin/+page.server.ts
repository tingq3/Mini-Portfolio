import { getPortfolioGlobals } from '$lib/server';
import { redirectOnInvalidToken } from '$lib/server/auth.js';
import { dataDirUsesGit } from '$lib/server/data/dataDir.js';
import { getRepoStatus } from '$lib/server/git.js';

export async function load(req) {
  const globals = await getPortfolioGlobals();
  await redirectOnInvalidToken(req, '/admin/login');
  const repo = await dataDirUsesGit() ? await getRepoStatus() : null;
  return { globals, repo };
}
