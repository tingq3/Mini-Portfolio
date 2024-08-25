import { error, json } from '@sveltejs/kit';
import { validateToken } from '$lib/server/auth.js';
import { ConfigJsonStruct, setConfig } from '$lib/server/data/config.js';
import { validate } from 'superstruct';
import consts from '$lib/consts.js';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index.js';

export async function GET({ request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  const data = await getPortfolioGlobals().catch(e => error(400, e));

  await validateToken(token).catch(e => error(401, `${e}`));

  return json(data.config, { status: 200 });
}

export async function PUT({ request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  const globals = await getPortfolioGlobals().catch(e => error(400, e));

  await validateToken(token).catch(e => error(401, `${e}`));

  const [err, newConfig] = validate(await request.json(), ConfigJsonStruct);

  if (err) {
    return error(400, `${err}`);
  }

  if (newConfig.version !== consts.VERSION) {
    return error(
      400,
      `New version (${newConfig.version}) doesn't match server version (${consts.VERSION})`
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
