import { revokeSession, validateTokenFromRequest } from '$lib/server/auth';
import { getPortfolioGlobals } from '$lib/server/data/index.js';
import { error, json } from '@sveltejs/kit';

export async function POST(req) {
  await getPortfolioGlobals().catch(e => error(400, e));

  await revokeSession(await validateTokenFromRequest(req));

  return json({}, { status: 200 });
}
