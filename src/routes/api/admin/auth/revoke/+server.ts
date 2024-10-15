import { validateTokenFromRequest } from '$lib/server/auth/tokens';
import { getPortfolioGlobals } from '$lib/server/data/index';
import { getLocalConfig, setLocalConfig } from '$lib/server/data/localConfig';
import { unixTime } from '$lib/util';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies }: import('./$types.js').RequestEvent) {
  await getPortfolioGlobals().catch(e => error(400, e));

  const local = await getLocalConfig();

  if (!local.auth) {
    return error(403, 'Authentication was disabled');
  }

  const uid = await validateTokenFromRequest({ request, cookies });

  local.auth[uid].sessions.notBefore = unixTime();

  await setLocalConfig(local);

  return json({}, { status: 200 });
}
