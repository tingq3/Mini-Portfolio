import { error, redirect } from '@sveltejs/kit';
import { getPortfolioGlobals } from '$lib/server';
import { dataDirIsInit } from '$lib/server/data/dataDir.js';
import { isRequestAuthorized } from '$lib/server/auth.js';

export async function load(req) {
  if (!await dataDirIsInit()) {
    redirect(303, '/admin/firstrun');
  }
  const globals = await getPortfolioGlobals();
  return { globals, loggedIn: await isRequestAuthorized(req) };
}
