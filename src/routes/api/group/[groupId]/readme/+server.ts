import { error, json } from '@sveltejs/kit';
import { setGroupReadme } from '$lib/server/data/group';
import { validateTokenFromRequest } from '$lib/server/auth';
import { assert, string } from 'superstruct';
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
  const data = await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  const groupId = params.groupId;

  if (!data.groups[groupId]) {
    return error(404, `Group with ID ${groupId} doesn't exist`);
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
