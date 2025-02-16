/** Endpoint for get/setting the README */

import { error, json } from '@sveltejs/kit';
import { validateTokenFromRequest } from '$lib/server/auth/tokens';
import { object, string, validate } from 'superstruct';
import { setReadme } from '$lib/server/data/readme';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index';

export async function GET() {
  const data = await getPortfolioGlobals().catch(e => error(400, e));

  return json({ readme: data.readme }, { status: 200 });
}

export async function PUT(req: import('./$types.js').RequestEvent) {
  await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest(req);

  const [err, newConfig] = validate(await req.request.json(), object({ readme: string() }));

  if (err) {
    return error(400, `${err}`);
  }

  await setReadme(newConfig.readme);
  invalidatePortfolioGlobals();

  return json({}, { status: 200 });
}
