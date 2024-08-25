import { error, json } from '@sveltejs/kit';
import { validateToken } from '$lib/server/auth';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index.js';

export async function POST({ params, request, cookies }) {
  const data = await getPortfolioGlobals().catch(e => error(400, e));
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }
  await validateToken(token).catch(e => error(401, `${e}`));

  const { groupId, itemId } = params;
  invalidatePortfolioGlobals();
  return json({}, { status: 200 });
}

export async function PUT({ params, request, cookies }) {
  const data = await getPortfolioGlobals().catch(e => error(400, e));
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }
  await validateToken(token).catch(e => error(401, `${e}`));

  const { groupId, itemId } = params;
  invalidatePortfolioGlobals();
  return json({}, { status: 200 });
}

export async function DELETE({ params, request, cookies }) {
  const data = await getPortfolioGlobals().catch(e => error(400, e));
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }
  await validateToken(token).catch(e => error(401, `${e}`));

  const { groupId, itemId } = params;
  invalidatePortfolioGlobals();
  return json({}, { status: 200 });
}
