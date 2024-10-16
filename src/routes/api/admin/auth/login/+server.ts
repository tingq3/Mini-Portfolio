import { isIpBanned, notifyFailedLogin } from '$lib/server/auth/fail2ban.js';
import { validateCredentials } from '$lib/server/auth/passwords';
import { generateToken } from '$lib/server/auth/tokens';
import { authIsSetUp } from '$lib/server/data/dataDir.js';
import { error, json } from '@sveltejs/kit';


export async function POST(req: import('./$types.js').RequestEvent) {
  if (!await authIsSetUp()) error(400, 'Auth is not set up yet');

  if (await isIpBanned(req.getClientAddress())) {
    error(403, 'IP address is banned');
  }

  const { username, password } = await req.request.json();

  let uid: string;
  try {
    uid = await validateCredentials(username, password);
  } catch (e) {
    await notifyFailedLogin(req.getClientAddress());
    throw e;
  }

  return json({ token: await generateToken(uid, req.cookies) }, { status: 200 });
}
