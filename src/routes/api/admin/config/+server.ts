import { error, json } from '@sveltejs/kit';
import { validateTokenFromRequest } from '$lib/server/auth/tokens';
import { ConfigJsonStruct, setConfig } from '$lib/server/data/config';
import { validate } from 'superstruct';
import { version } from '$app/environment';
import { getPortfolioGlobals, invalidatePortfolioGlobals } from '$lib/server/data/index';
import fs from 'fs/promises';
import { getDataDir } from '$lib/server/data/dataDir';

export async function GET({ request, cookies }: import('./$types.js').RequestEvent) {
  const data = await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  return json(data.config, { status: 200 });
}

export async function PUT({ request, cookies }: import('./$types.js').RequestEvent) {
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

  // Check for invalid icon
  if (newConfig.siteIcon) {
    await fs.access(`${getDataDir()}/${newConfig.siteIcon}`, fs.constants.R_OK)
      .catch(() => error(400, `Cannot access site icon ${newConfig.siteIcon}`));
  }

  await setConfig(newConfig);
  invalidatePortfolioGlobals();

  return json({}, { status: 200 });
}
