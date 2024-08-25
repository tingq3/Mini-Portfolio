import { error, json } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { getGroupInfo } from '$lib/server/data/group';
import { validateToken } from '$lib/server/auth';
import { object, string, StructError, validate } from 'superstruct';
import { getItemInfo, createItem, setItemInfo, ItemInfoFullStruct, deleteItem } from '$lib/server/data/item.js';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index.js';
import { validateId, validateName } from '$lib/validators.js';

export async function GET({ params, request, cookies }) {
  const data = await getPortfolioGlobals().catch(e => error(400, e));

  const { groupId, itemId } = params;

  try {
    return json(data.items[groupId][itemId].info, { status: 200 });
  } catch (e) {
    return error(404, `Item at ID ${groupId}/item/${itemId} doesn't exist\n${e}`);
  }
}

export async function POST({ params, request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  const data = await getPortfolioGlobals().catch(e => error(400, e));

  await validateToken(token).catch(e => error(401, `${e}`));

  // Validate group ID
  const { groupId, itemId } = params;

  // Ensure group exists
  await getGroupInfo(groupId).catch(e => error(404, e));

  validateId(itemId);

  const [err, body] = validate(await request.json(), object({ name: string(), description: string() }));
  if (err) {
    return error(400, err);
  }
  const { name, description } = body;

  // Validate name
  validateName(name);

  if (data.items[groupId] && data.items[groupId][itemId]) {
    return error(400, `Group with ID ${groupId} already exists`);
  }

  await createItem(groupId, itemId, name, description);
  invalidatePortfolioGlobals();

  return json({}, { status: 200 });
}

export async function PUT({ params, request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  const data = await getPortfolioGlobals().catch(e => error(400, e));

  await validateToken(token).catch(e => error(401, `${e}`));

  const { groupId, itemId } = params;

  if (!data.groups[groupId]) {
    error(404, `Group ${groupId} does not exist`);
  }
  if (!data.items[groupId][itemId]) {
    error(404, `Item ${itemId} does not exist in group ${groupId}`);
  }

  const [err, info] = validate(await request.json(), ItemInfoFullStruct);
  if (err) {
    return error(400, err);
  }

  // Validate name
  validateName(info.name);

  // TODO: Other validation

  await setItemInfo(groupId, itemId, info);
  invalidatePortfolioGlobals();

  return json({}, { status: 200 });
}

export async function DELETE({ params, request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  const data = await getPortfolioGlobals().catch(e => error(400, e));

  await validateToken(token).catch(e => error(401, `${e}`));

  const { groupId, itemId } = params;

  if (!data.groups[groupId]) {
    error(404, `Group ${groupId} does not exist`);
  }
  if (!data.items[groupId][itemId]) {
    error(404, `Item ${itemId} does not exist in group ${groupId}`);
  }

  // Now delete the group
  await deleteItem(groupId, itemId);
  invalidatePortfolioGlobals();
  return json({}, { status: 200 });
}
