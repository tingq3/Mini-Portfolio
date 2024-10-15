import { validateTokenFromRequest } from '$lib/server/auth/tokens';
import { serverIsSetUp } from '$lib/server/data/dataDir';
import { getLocalConfig } from '$lib/server/data/localConfig.js';
import { fileExists } from '$lib/server/index.js';
import { disableKey, getPublicKey, setKeyFile } from '$lib/server/keys.js';
import { error, json } from '@sveltejs/kit';

/** Return the current public key */
export async function GET(req) {
  // Auth needed when set up, but otherwise not
  if (await serverIsSetUp()) {
    await validateTokenFromRequest(req);
  }

  return json({
    publicKey: await getPublicKey(),
    keyPath: await getLocalConfig().then(c => c.keyFile),
  }, { status: 200 });
}

/** Set the path to the key */
export async function POST(req) {
  // Auth needed when set up, but otherwise not
  if (await serverIsSetUp()) {
    await validateTokenFromRequest(req);
  }

  const { keyPath } = await req.request.json();

  // Ensure private and public key files exist
  if (! await fileExists(keyPath)) {
    error(400, 'Private key file must exist');
  }
  if (! await fileExists(keyPath + '.pub')) {
    error(400, 'Public key file must exist');
  }

  await setKeyFile(keyPath);

  return json({
    publicKey: await getPublicKey(),
    keyPath: await getLocalConfig().then(c => c.keyFile),
  }, { status: 200 });
}

/** Disable SSH key-based authentication */
export async function DELETE(req) {
  // Auth needed when set up, but otherwise not
  if (await serverIsSetUp()) {
    await validateTokenFromRequest(req);
  }

  await disableKey();

  return json({}, { status: 200 });
}
