import { validateTokenFromRequest } from '$lib/server/auth/tokens';
import { authIsSetUp } from '$lib/server/data/dataDir';
import { getLocalConfig } from '$lib/server/data/localConfig.js';
import { generateKey } from '$lib/server/keys.js';
import { error, json } from '@sveltejs/kit';

/** Generate an SSH key */
export async function POST(req: import('./$types.js').RequestEvent) {
  if (!await authIsSetUp()) {
    error(400);
  }
  await validateTokenFromRequest(req);

  const publicKey = await generateKey();

  return json({
    publicKey,
    keyPath: await getLocalConfig().then(c => c.keyPath),
  }, { status: 200 });
}
