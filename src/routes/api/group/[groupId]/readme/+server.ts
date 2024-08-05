import { error, json } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { createGroup, getGroupInfo, getGroupReadme } from '$lib/server/data/group.js';
import { validateToken } from '$lib/server/auth';
import { object, string, StructError, validate } from 'superstruct';

export async function GET({ params, request, cookies }) {
  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  const groupId = params.groupId;

  try {
    return json({ readme: await getGroupReadme(groupId) }, { status: 200 });
  } catch (e) {
    return error(400, `Group with ID ${groupId} doesn't exist\n${e}`);
  }
}
