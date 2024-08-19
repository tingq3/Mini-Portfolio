import { error, json } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { createGroup, deleteGroup, getGroupInfo, GroupInfoStruct, setGroupInfo } from '$lib/server/data/group';
import { validateToken } from '$lib/server/auth';
import { object, string, StructError, validate } from 'superstruct';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index.js';

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

// TODO: Probably way more opportunities for optimising these functions by
// using the cache of data

/** Regex for matching group IDs */
const groupIdValidator = /^[a-z0-9-.]+$/;

const illegalNameChars = ['\t', '\n', '\f', '\r'];

export async function POST({ params, request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  await getPortfolioGlobals().catch(e => error(400, e));

  await validateToken(token).catch(e => error(401, `${e}`));

  // Validate group ID
  const groupId = params.groupId;

  if (!groupId.trim().length) {
    return error(400, `Group ID '${groupId}' is empty`);
  }
  if (!groupIdValidator.test(groupId)) {
    return error(400, `Group ID '${groupId}' is contains illegal characters`);
  }
  if (groupId.startsWith('.')) {
    return error(400, `Group ID '${groupId}' has a leading dot`);
  }
  if (groupId.endsWith('.')) {
    return error(400, `Group ID '${groupId}' has a trailing dot`);
  }
  if (groupId.startsWith('-')) {
    return error(400, `Group ID '${groupId}' has a leading dash`);
  }
  if (groupId.endsWith('-')) {
    return error(400, `Group ID '${groupId}' has a trailing dash`);
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

  let groupDataExists = false;
  try {
    await getGroupInfo(groupId);
    groupDataExists = true;
  } catch (e) {
    // If it's a validation error, we should say so
    if (e instanceof StructError) {
      return error(400, `Group with ID ${groupId} already exists, but has invalid data`);
    }
  }
  if (groupDataExists) {
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

  await getPortfolioGlobals().catch(e => error(400, e));

  await validateToken(token).catch(e => error(401, `${e}`));

  const groupId = params.groupId;

  try {
    await getGroupInfo(groupId);
  } catch (e) {
    return error(404, `Group with ID ${groupId} doesn't exist\n${e}`);
  }

  const [err, info] = validate(await request.json(), GroupInfoStruct);

  if (err) {
    return error(400, err);
  }

  // Validate name
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

  await setGroupInfo(groupId, info);
  invalidatePortfolioGlobals();

  return json({}, { status: 200 });
}

export async function DELETE({ params, request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  await getPortfolioGlobals().catch(e => error(400, e));

  await validateToken(token).catch(e => error(401, `${e}`));

  const groupId = params.groupId;

  try {
    await getGroupInfo(groupId);
  } catch (e) {
    return error(404, `Group with ID ${groupId} doesn't exist\n${e}`);
  }

  // Now delete the group
  await deleteGroup(groupId);
  invalidatePortfolioGlobals();
  return json({}, { status: 200 });
}
