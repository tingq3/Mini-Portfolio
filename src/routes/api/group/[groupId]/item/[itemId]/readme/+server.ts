import { error, json } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { validateToken } from '$lib/server/auth';
import { assert, string } from 'superstruct';
import { getItemInfo, getItemReadme, setItemReadme } from '$lib/server/data/item.js';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index.js';

export async function GET({ params, request, cookies }) {
  const data = await getPortfolioGlobals().catch(e => error(400, e));

  const { groupId, itemId } = params;

  try {
    return json({ readme: data.items[groupId][itemId].readme }, { status: 200 });
  } catch (e) {
    return error(400, `Item with ID ${itemId} in group ${groupId} doesn't exist`);
  }
}

export async function PUT({ params, request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  await getPortfolioGlobals().catch(e => error(400, e));

  await validateToken(token).catch(e => error(401, `${e}`));

  const { groupId, itemId } = params;

  await getItemInfo(groupId, itemId)
    .catch(e => error(404, `Item with ID ${itemId} in group ${groupId} doesn't exist`));

  let readme: string;
  try {
    const newReadme = (await request.json()).readme;
    assert(newReadme, string());
    readme = newReadme;
  } catch (e) {
    return error(400, `${e}`);
  }

  await setItemReadme(groupId, itemId, readme);
  invalidatePortfolioGlobals();
  return json({}, { status: 200 });
}
