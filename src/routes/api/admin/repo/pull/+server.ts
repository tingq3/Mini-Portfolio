import { validateTokenFromRequest } from '$lib/server/auth.js';
import { getPortfolioGlobals } from '$lib/server/index.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  // TODO

  return json({}, { status: 200 });
}
