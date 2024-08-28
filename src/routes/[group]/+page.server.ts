import { error } from '@sveltejs/kit';
import { getPortfolioGlobals } from '$lib/server';
import { isRequestAuthorized } from '$lib/server/auth.js';

export async function load(req) {
  const globals = await getPortfolioGlobals();
  // Give a 404 if the group doesn't exist
  if (!(req.params.group in globals.groups)) {
    throw error(404, `Group '${req.params.group}' does not exist`);
  }
  return {
    groupId: req.params.group,
    globals,
    loggedIn: await isRequestAuthorized(req)
  };
}
