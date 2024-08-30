import { validateTokenFromRequest } from '$lib/server/auth.js';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/index.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  invalidatePortfolioGlobals();

  return json({}, { status: 200 });
}
