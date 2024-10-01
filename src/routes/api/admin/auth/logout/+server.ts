import { revokeSession, validateTokenFromRequest } from '$lib/server/auth/tokens';
import { getPortfolioGlobals } from '$lib/server/data/index';
import { error, json } from '@sveltejs/kit';

export async function POST(req) {
  await getPortfolioGlobals().catch(e => error(400, e));

  await revokeSession(await validateTokenFromRequest(req));

  return json({}, { status: 200 });
}
