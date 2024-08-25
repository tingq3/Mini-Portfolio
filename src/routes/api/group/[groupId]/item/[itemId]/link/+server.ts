import { error, json } from '@sveltejs/kit';
import { validateToken } from '$lib/server/auth';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index.js';
import { object, string, validate } from 'superstruct';
import { LinkStyleStruct, setItemInfo, type ItemInfoFull } from '$lib/server/data/item.js';

function addLinkToItem(item: ItemInfoFull, otherGroupId: string, otherItemId: string) {
  // First hunt to see if it is already there
  for (const [{ groupId: linkedGroup }, items] of item.links) {
    if (linkedGroup === otherGroupId) {
      // Only add it if it isn't present
      if (!items.includes(otherItemId)) {
        items.push(otherItemId);
      }
      return;
    }
  }
  // If we reach this point, no links to that group have been made yet, create
  // one in the default style (chip)
  item.links.push([
    { groupId: otherGroupId, style: 'chip' },
    [otherItemId],
  ]);
}

export async function POST({ params, request, cookies }) {
  const data = await getPortfolioGlobals().catch(e => error(400, e));
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }
  await validateToken(token).catch(e => error(401, `${e}`));

  const { groupId, itemId } = params;
  if (!data.groups[groupId]) {
    error(404, `Group ${groupId} does not exist`);
  }
  if (!data.items[groupId][itemId]) {
    error(404, `Item ${itemId} does not exist in group ${groupId}`);
  }

  const [err, body] = validate(
    await request.json(),
    object({ otherGroupId: string(), otherItemId: string() })
  );
  if (err) {
    return error(400, err);
  }
  const { otherGroupId, otherItemId } = body;

  if (!data.groups[otherGroupId]) {
    error(400, `Group ${otherGroupId} does not exist`);
  }
  if (!data.items[otherGroupId][otherItemId]) {
    error(400, `Item ${otherItemId} does not exist in group ${otherGroupId}`);
  }

  // Check for self-links
  if (groupId === otherGroupId && itemId === otherItemId) {
    error(400, 'Cannot link to same item');
  }

  const item = data.items[groupId][itemId].info;
  const otherItem = data.items[otherGroupId][otherItemId].info;

  addLinkToItem(item, otherGroupId, otherItemId);
  addLinkToItem(otherItem, groupId, itemId);

  await setItemInfo(groupId, itemId, item);
  await setItemInfo(otherGroupId, otherItemId, otherItem);

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
  if (!data.groups[groupId]) {
    error(404, `Group ${groupId} does not exist`);
  }
  if (!data.items[groupId][itemId]) {
    error(404, `Item ${itemId} does not exist in group ${groupId}`);
  }

  const [err, body] = validate(
    await request.json(),
    object({ otherGroupId: string(), style: LinkStyleStruct })
  );
  if (err) {
    return error(400, `${err}`);
  }
  const { otherGroupId } = body;
  if (!data.groups[otherGroupId]) {
    error(400, `Group ${otherGroupId} does not exist`);
  }

  invalidatePortfolioGlobals();
  return json({}, { status: 200 });
}

export async function DELETE({ params, request, url }) {
  const data = await getPortfolioGlobals().catch(e => error(400, e));
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }
  await validateToken(token).catch(e => error(401, `${e}`));

  const { groupId, itemId } = params;
  if (!data.groups[groupId]) {
    error(404, `Group ${groupId} does not exist`);
  }
  if (!data.items[groupId][itemId]) {
    error(404, `Item ${itemId} does not exist in group ${groupId}`);
  }

  const otherGroupId = url.searchParams.get('otherGroupId');
  const otherItemId = url.searchParams.get('otherGroupId');

  if (!otherGroupId || !otherItemId) {
    error(400, 'Requires query params otherGroupId and otherItemId');
  }

  if (!data.groups[otherGroupId]) {
    error(400, `Group ${otherGroupId} does not exist`);
  }
  if (!data.items[otherGroupId][otherItemId]) {
    error(400, `Item ${otherItemId} does not exist in group ${otherGroupId}`);
  }

  invalidatePortfolioGlobals();
  return json({}, { status: 200 });
}
