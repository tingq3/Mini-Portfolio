import { revokeSession } from '$lib/server/auth';
import { getPortfolioGlobals } from '$lib/server/data/index.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  await getPortfolioGlobals().catch(e => error(400, e));

  try {
    await revokeSession(token);
  } catch (e) {
    return error(401, `${e}`);
  }

  return json({}, { status: 200 });
}
