import { validateCredentials } from '$lib/server/auth/passwords';
import { generateToken } from '$lib/server/auth/tokens';
import { getPortfolioGlobals } from '$lib/server/data/index';
import { error, json } from '@sveltejs/kit';


export async function POST({ request, cookies }: import('./$types.js').RequestEvent) {
  await getPortfolioGlobals().catch(e => error(400, e));

  const { username, password } = await request.json();

  const uid = await validateCredentials(username, password);

  return json({ token: await generateToken(uid, cookies) }, { status: 200 });
}
