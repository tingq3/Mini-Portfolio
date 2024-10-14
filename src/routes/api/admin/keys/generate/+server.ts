import { validateTokenFromRequest } from '$lib/server/auth/tokens';
import { serverIsSetUp } from '$lib/server/data/dataDir';
import { getLocalConfig } from '$lib/server/data/localConfig.js';
import { generateKey } from '$lib/server/keys.js';
import { json } from '@sveltejs/kit';

/** Generate an SSH key */
export async function POST(req) {
  // Auth needed when set up, but otherwise not
  if (await serverIsSetUp()) {
    await validateTokenFromRequest(req);
  }

  const publicKey = await generateKey();

  return json({
    publicKey,
    keyPath: await getLocalConfig().then(c => c.keyFile),
  }, { status: 200 });
}
