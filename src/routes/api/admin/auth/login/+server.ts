import { validateCredentials } from '$lib/server/auth/passwords';
import { generateToken } from '$lib/server/auth/tokens';
import { authIsSetUp } from '$lib/server/data/dataDir.js';
import { error, json } from '@sveltejs/kit';


export async function POST({ request, cookies }: import('./$types.js').RequestEvent) {
  if (!await authIsSetUp()) error(400, 'Auth is not set up yet');

  const { username, password } = await request.json();

  const uid = await validateCredentials(username, password);

  return json({ token: await generateToken(uid, cookies) }, { status: 200 });
}
