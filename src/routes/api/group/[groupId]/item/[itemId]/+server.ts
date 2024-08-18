import { error, json } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { getGroupInfo } from '$lib/server/data/group';
import { validateToken } from '$lib/server/auth';
import { object, string, StructError, validate } from 'superstruct';
import { getItemInfo, createItem, setItemInfo, ItemInfoFullStruct, deleteItem } from '$lib/server/data/item.js';

export async function GET({ params, request, cookies }) {
  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  const { groupId, itemId } = params;

  try {
    return json(await getItemInfo(groupId, itemId), { status: 200 });
  } catch (e) {
    return error(404, `Item at ID ${groupId}/item/${itemId} doesn't exist\n${e}`);
  }
}

// FIXME: Extract to constants to reduce duplication
/** Regex for matching group IDs */
const itemIdValidator = /^[a-z0-9-.]+$/;

const illegalNameChars = ['\t', '\n', '\f', '\r'];

export async function POST({ params, request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  await validateToken(token).catch(e => error(401, `${e}`));

  // Validate group ID
  const { groupId, itemId } = params;

  // Ensure group exists
  await getGroupInfo(groupId).catch(e => error(404, e));

  if (!itemId.trim().length) {
    return error(400, `Item ID '${itemId}' is empty`);
  }
  if (!itemIdValidator.test(itemId)) {
    return error(400, `Item ID '${itemId}' is contains illegal characters`);
  }
  if (itemId.startsWith('.')) {
    return error(400, `Item ID '${itemId}' has a leading dot`);
  }
  if (itemId.endsWith('.')) {
    return error(400, `Item ID '${itemId}' has a trailing dot`);
  }
  if (itemId.startsWith('-')) {
    return error(400, `Item ID '${itemId}' has a leading dash`);
  }
  if (itemId.endsWith('-')) {
    return error(400, `Item ID '${itemId}' has a trailing dash`);
  }

  const [err, body] = validate(await request.json(), object({ name: string(), description: string() }));
  if (err) {
    return error(400, err);
  }
  const { name, description } = body;

  // Validate name
  if (!name) {
    return error(400, 'Name cannot be empty');
  }
  if (name.trim().length !== name.length) {
    return error(400, 'Name cannot contain leading or trailing whitespace');
  }
  if (
    illegalNameChars
      .reduce((n, c) => n.replace(c, ''), name)
      .length
    !== name.length
  ) {
    return error(400, 'Name contains illegal whitespace characters');
  }

  let itemDataExists = false;
  try {
    await getItemInfo(groupId, itemId);
    itemDataExists = true;
  } catch (e) {
    // If it's a validation error, we should say so
    if (e instanceof StructError) {
      return error(400, `Item with ID ${itemId} already exists, but has invalid data`);
    }
  }
  if (itemDataExists) {
    return error(400, `Group with ID ${groupId} already exists`);
  }

  await createItem(groupId, itemId, name, description);

  return json({}, { status: 200 });
}

export async function PUT({ params, request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  await validateToken(token).catch(e => error(401, `${e}`));

  const { groupId, itemId } = params;

  await getItemInfo(groupId, itemId)
    .catch(e => error(404, `Item with ID ${itemId} in group ${groupId} doesn't exist\n${e}`));

  const [err, info] = validate(await request.json(), ItemInfoFullStruct);
  if (err) {
    return error(400, err);
  }

  // Validate name
  // TODO: Helper function (create and edit, for both items and groups)
  const name = info.name;
  if (!name) {
    return error(400, 'Name cannot be empty');
  }
  if (name.trim().length !== name.length) {
    return error(400, 'Name cannot contain leading or trailing whitespace');
  }
  if (
    illegalNameChars
      .reduce((n, c) => n.replace(c, ''), name)
      .length
    !== name.length
  ) {
    return error(400, 'Name contains illegal whitespace characters');
  }

  // TODO: Other validation

  await setItemInfo(groupId, itemId, info);

  return json({}, { status: 200 });
}

export async function DELETE({ params, request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  await validateToken(token).catch(e => error(401, `${e}`));

  const { groupId, itemId } = params;

  await getItemInfo(groupId, itemId)
    .catch(e => error(404, `Item with ID ${itemId} in group ${groupId} doesn't exist\n${e}`));

  // Now delete the group
  await deleteItem(groupId, itemId);
  return json({}, { status: 200 });
}
