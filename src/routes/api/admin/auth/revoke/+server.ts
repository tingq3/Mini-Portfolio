import { validateTokenFromRequest } from '$lib/server/auth';
import { getPortfolioGlobals } from '$lib/server/data/index.js';
import { getLocalConfig, setLocalConfig } from '$lib/server/data/localConfig.js';
import { unixTime } from '$lib/util.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  await getPortfolioGlobals().catch(e => error(400, e));

  const local = await getLocalConfig();

  if (!local.auth) {
    return error(403, 'Authentication was disabled');
  }

  await validateTokenFromRequest({ request, cookies });

  local.auth.sessions.notBefore = unixTime();

  await setLocalConfig(local);

  return json({}, { status: 200 });
}
