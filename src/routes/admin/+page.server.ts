import { getPortfolioGlobals } from '$lib/server';
import { redirectOnInvalidToken } from '$lib/server/auth.js';

export async function load(req) {
  const globals = await getPortfolioGlobals();
  await redirectOnInvalidToken(req, '/admin/login');
  return { globals };
}
