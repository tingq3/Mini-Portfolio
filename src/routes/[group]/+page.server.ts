import { error } from '@sveltejs/kit';
import { getPortfolioGlobals } from '$lib/server';

export async function load({ params }) {
  const globals = await getPortfolioGlobals();
  // Give a 404 if the group doesn't exist
  if (!(params.group in globals.groups)) {
    throw error(404, `Group '${params.group}' does not exist`);
  }
  return {
    groupId: params.group,
    globals,
  };
}
