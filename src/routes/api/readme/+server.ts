/** Endpoint for get/setting the README */

import { error, json } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { validateToken } from '$lib/server/auth.js';
import { object, string, validate } from 'superstruct';
import { getReadme, setReadme } from '$lib/server/data/readme.js';

export async function GET({ request, cookies }) {
  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  return json({ readme: await getReadme() }, { status: 200 });
}

export async function PUT({ request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  await validateToken(token).catch(e => error(401, `${e}`));

  const [err, newConfig] = validate(await request.json(), object({ readme: string() }));

  if (err) {
    return error(400, `${err}`);
  }

  await setReadme(newConfig.readme);

  return json({}, { status: 200 });
}
