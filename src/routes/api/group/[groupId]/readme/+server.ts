import { error, json } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { getGroupInfo, getGroupReadme, setGroupReadme } from '$lib/server/data/group';
import { validateToken } from '$lib/server/auth';
import { assert, object, string, StructError, validate } from 'superstruct';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index.js';

export async function GET({ params, request, cookies }) {
  const groupId = params.groupId;
  const data = await getPortfolioGlobals().catch(e => error(400, e));

  try {
    return json({ readme: data.groups[groupId].readme }, { status: 200 });
  } catch (e) {
    return error(400, `Group with ID ${groupId} doesn't exist\n${e}`);
  }
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

  let readme: string;
  try {
    const newReadme = (await request.json()).readme;
    assert(newReadme, string());
    readme = newReadme;
  } catch (e) {
    return error(400, `${e}`);
  }

  await setGroupReadme(groupId, readme);
  invalidatePortfolioGlobals();

  return json({}, { status: 200 });
}
