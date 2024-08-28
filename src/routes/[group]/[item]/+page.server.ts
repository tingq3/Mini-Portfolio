import { error } from '@sveltejs/kit';
import { getPortfolioGlobals } from '$lib/server';
import { isRequestAuthorized } from '$lib/server/auth.js';

export async function load(req) {
  const globals = await getPortfolioGlobals();
  // Give a 404 if the group doesn't exist
  if (!(req.params.group in globals.groups)) {
    throw error(404, `Group '${req.params.group}' does not exist`);
  }
  // And also if the item doesn't exist
  if (!(req.params.item in globals.items[req.params.group])) {
    throw error(404, `Item '${req.params.item}' does not exist within group '${req.params.group}`);
  }
  return {
    groupId: req.params.group,
    itemId: req.params.item,
    globals,
    loggedIn: await isRequestAuthorized(req),
  };
}
