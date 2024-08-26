import { getPortfolioGlobals } from '$lib/server';

export async function load({ params }) {
  const globals = await getPortfolioGlobals();
  return { globals };
}
