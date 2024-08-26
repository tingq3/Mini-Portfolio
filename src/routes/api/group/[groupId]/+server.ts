import { error, json } from '@sveltejs/kit';
import { createGroup, deleteGroup, getGroupInfo, GroupInfoStruct, setGroupInfo } from '$lib/server/data/group';
import { validateToken } from '$lib/server/auth';
import { object, string, StructError, validate } from 'superstruct';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index';
import { validateId, validateName } from '$lib/validators';
import { removeAllLinksToItem } from '$lib/server/links.js';

export async function GET({ params, request, cookies }) {
  const groupId = params.groupId;

  const data = await getPortfolioGlobals().catch(e => error(400, e));

  try {
    return json(data.groups[groupId].info, { status: 200 });
  } catch (e) {
    // Catch "cannot read properties of undefined"
    return error(404, `Group with ID ${groupId} doesn't exist`);
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
  const groupId = validateId(params.groupId);

  const [err, body] = validate(await request.json(), object({ name: string(), description: string() }));
  if (err) {
    return error(400, err);
  }
  const { name, description } = body;
  validateName(name);

  if (data.groups[groupId]) {
    return error(400, `Group with ID ${groupId} already exists`);
  }

  await createGroup(groupId, name, description);
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

  const groupId = params.groupId;

  if (!data.groups[groupId]) {
    return error(404, `Group with ID ${groupId} doesn't exist`);
  }

  const [err, info] = validate(await request.json(), GroupInfoStruct);

  if (err) {
    return error(400, err);
  }

  // Validate name
  validateName(info.name);

  // Check for invalid listedItems
  for (const itemId of info.listedItems) {
    if (!(itemId in data.items[groupId])) {
      error(400, `Item '${itemId}' does not exist in group '${groupId}'`);
    }
  }

  // TODO: Other validation

  await setGroupInfo(groupId, info);
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

  const groupId = params.groupId;

  if (!data.groups[groupId]) {
    return error(404, `Group with ID ${groupId} doesn't exist`);
  }

  // Remove all links to each item in the group
  await Promise.all(Object.keys(data.items[groupId]).map(
    itemId => removeAllLinksToItem(data, groupId, itemId)));

  // Now delete the group
  await deleteGroup(groupId);
  invalidatePortfolioGlobals();
  return json({}, { status: 200 });
}
