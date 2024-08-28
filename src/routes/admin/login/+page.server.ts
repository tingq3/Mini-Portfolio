import { getPortfolioGlobals } from '$lib/server';
import { validateTokenFromRequest } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

export async function load(req) {
  // Users that are already logged in should be redirected to the main admin
  // page
  await validateTokenFromRequest(req).catch(() => {}).then(redirect(303, '/admin'));
  const globals = await getPortfolioGlobals();
  return { globals };
}
