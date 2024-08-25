import { error } from '@sveltejs/kit';
import { getPortfolioGlobals } from '$lib/server';

export async function load({ params }) {
  const globals = await getPortfolioGlobals();
  // Give a 404 if the classifier doesn't exist
  if (!(params.group in globals.groups)) {
    throw error(404, `Group '${params.group}' does not exist`);
  }
  // And also if the label doesn't exist
  if (!(params.item in globals.items[params.group])) {
    throw error(404, `Item '${params.item}' does not exist within group '${params.group}`);
  }
  return {
    groupId: params.group,
    itemId: params.item,
    globals,
  };
}
