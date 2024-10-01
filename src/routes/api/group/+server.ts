import { error, json } from '@sveltejs/kit';
import { getPortfolioGlobals } from '$lib/server/data/index';

export async function GET() {
  const data = await getPortfolioGlobals().catch(e => error(400, e));

  return json(
    Object.fromEntries(Object.entries(data.groups).map(([id, groupData]) => [id, groupData.info])),
    { status: 200 },
  );
}
