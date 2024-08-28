import { error, json } from '@sveltejs/kit';
import { validateToken, validateTokenFromRequest } from '$lib/server/auth.js';
import { ConfigJsonStruct, setConfig } from '$lib/server/data/config.js';
import { validate } from 'superstruct';
import { version } from '$app/environment';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index.js';

export async function GET({ request, cookies }) {
  const data = await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  return json(data.config, { status: 200 });
}

export async function PUT({ request, cookies }) {
  const globals = await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  const [err, newConfig] = validate(await request.json(), ConfigJsonStruct);

  if (err) {
    return error(400, `${err}`);
  }

  if (newConfig.version !== version) {
    return error(
      400,
      `New version (${newConfig.version}) doesn't match server version (${version})`
    );
  }

  // Check for invalid listedGroups
  for (const groupId of newConfig.listedGroups) {
    if (!(groupId in globals.groups)) {
      error(400, `Group '${groupId}' does not exist`);
    }
  }

  await setConfig(newConfig);
  invalidatePortfolioGlobals();

  return json({}, { status: 200 });
}
