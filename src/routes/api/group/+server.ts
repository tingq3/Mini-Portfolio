import { error, json } from '@sveltejs/kit';
import { getGroupInfo, listGroups, type GroupInfo } from '$lib/server/data/group';
import { getPortfolioGlobals } from '$lib/server/data/index.js';

export async function GET({ request, cookies }) {
  const data = await getPortfolioGlobals().catch(e => error(400, e));

  return json(
    Object.fromEntries(Object.entries(data.groups).map(([id, groupData]) => [id, groupData.info])),
    { status: 200 },
  );
}
