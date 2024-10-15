import { getTokenFromRequest, revokeSession } from '$lib/server/auth/tokens';
import { getPortfolioGlobals } from '$lib/server/data/index';
import { error, json } from '@sveltejs/kit';

export async function POST(req: import('./$types.js').RequestEvent) {
  await getPortfolioGlobals().catch(e => error(400, e));

  const token = getTokenFromRequest(req);

  if (!token) {
    error(401, 'A token is required to access this endpoint');
  }

  await revokeSession(token)
    .catch(e => error(401, `${e}`));

  return json({}, { status: 200 });
}
