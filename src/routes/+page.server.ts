import { error, redirect } from '@sveltejs/kit';
import { getPortfolioGlobals } from '$lib/server';
import { dataDirIsInit } from '$lib/server/data/dataDir.js';

export async function load({ params }) {
  if (!await dataDirIsInit()) {
    redirect(303, '/admin/firstrun');
  }
  const globals = await getPortfolioGlobals();
  return { globals };
}
