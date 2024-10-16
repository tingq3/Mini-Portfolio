import { validateTokenFromRequest } from '$lib/server/auth/tokens';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/index';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies }: import('./$types.js').RequestEvent) {
  await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  invalidatePortfolioGlobals();

  return json({}, { status: 200 });
}
