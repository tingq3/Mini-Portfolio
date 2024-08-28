import { hashAndSalt, validateTokenFromRequest } from '$lib/server/auth';
import { getPortfolioGlobals } from '$lib/server/data/index.js';
import { getLocalConfig, setLocalConfig } from '$lib/server/data/localConfig.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  const local = await getLocalConfig();

  if (!local.auth) {
    throw Error('Unreachable');
  }

  const { password } = await request.json();

  if (hashAndSalt(local.auth.password.salt, password) !== local.auth.password.hash) {
    return error(403, 'Incorrect password');
  }

  // Disable authentication
  local.auth = null;
  await setLocalConfig(local);

  return json({}, { status: 200 });
}
