import { redirect } from '@sveltejs/kit';
import { getPortfolioGlobals } from '$lib/server';
import { authIsSetUp } from '$lib/server/data/dataDir';
import { isRequestAuthorized } from '$lib/server/auth/tokens';

export async function load(req: import('./$types.js').RequestEvent) {
  if (!await authIsSetUp()) {
    redirect(303, '/admin/firstrun');
  }
  const globals = await getPortfolioGlobals();
  return { globals, loggedIn: await isRequestAuthorized(req) };
}
