import { error, json } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { getGroupInfoBrief, listGroups, type GroupInfoBrief } from '$lib/server/data/group.js';
import { validateToken } from '$lib/server/auth';

export async function GET({ request, cookies }) {
  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  return json(
    Object.fromEntries(
      await Promise.all(
        (await listGroups())
          .map(async g => [g, await getGroupInfoBrief(g)] as [string, GroupInfoBrief])
      )
    ),
    { status: 200 },
  );
}

export async function POST({ request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  try {
    await validateToken(token);
  } catch (e) {
    return error(401, `${e}`);
  }

  return json({}, { status: 418 });
}
