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
  const { otherGroupId, style: newStyle } = body;
  if (!data.groups[otherGroupId]) {
    error(400, `Group ${otherGroupId} does not exist`);
  }

  const item = data.items[groupId][itemId].info;
  // Find linked group and update style
  let foundMatch = false;
  for (const [linkInfo, items] of item.links) {
    if (linkInfo.groupId === otherGroupId) {
      linkInfo.style = newStyle;
      foundMatch = true;
      break;
    }
  }
  if (!foundMatch) {
    error(400, `Group ${otherGroupId} has not been linked to in this item`);
  }

  await setItemInfo(groupId, itemId, item);

  invalidatePortfolioGlobals();
  return json({}, { status: 200 });
}

function removeLinkFromItem(item: ItemInfoFull, otherGroupId: string, otherItemId: string) {
  for (const [{ groupId: linkedGroup }, items] of item.links) {
    if (linkedGroup === otherGroupId) {
      // Only remove it if it is present
      if (items.includes(otherItemId)) {
        items.splice(items.indexOf(otherItemId), 1);
      }
      // Now if the linked group is empty, remove it from the item links
      if (!items.length) {
        // This feels yucky but I can't think of a prettier way of doing it
        // without making a copy
        item.links.splice(
          item.links.findIndex(l => l[0].groupId === otherGroupId),
          1,
        );
      }
      return;
    }
  }
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
  const otherItemId = url.searchParams.get('otherItemId');

  if (!otherGroupId || !otherItemId) {
    error(400, 'Requires query params otherGroupId and otherItemId');
  }

  if (!data.groups[otherGroupId]) {
    error(400, `Group ${otherGroupId} does not exist`);
  }
  if (!data.items[otherGroupId][otherItemId]) {
    error(400, `Item ${otherItemId} does not exist in group ${otherGroupId}`);
  }

  const item = data.items[groupId][itemId].info;
  const otherItem = data.items[otherGroupId][otherItemId].info;

  removeLinkFromItem(item, otherGroupId, otherItemId);
  removeLinkFromItem(otherItem, groupId, itemId);

  await setItemInfo(groupId, itemId, item);
  await setItemInfo(otherGroupId, otherItemId, otherItem);

  invalidatePortfolioGlobals();
  return json({}, { status: 200 });
}
