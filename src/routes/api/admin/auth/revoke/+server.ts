import { validateToken } from '$lib/server/auth';
import { getPortfolioGlobals } from '$lib/server/data/index.js';
import { getLocalConfig, setLocalConfig } from '$lib/server/data/localConfig.js';
import { unixTime } from '$lib/util.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  await getPortfolioGlobals().catch(e => error(400, e));

  const local = await getLocalConfig();

  if (!local.auth) {
    return error(403, 'Authentication was disabled');
  }

  await validateToken(token).catch(e => error(401, `${e}`));

  local.auth.sessions.notBefore = unixTime();

  await setLocalConfig(local);

  return json({}, { status: 200 });
}
