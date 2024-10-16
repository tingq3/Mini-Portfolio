import { dev } from '$app/environment';
import { getDataDir, getPrivateDataDir } from '$lib/server/data/dataDir';
import { invalidatePortfolioGlobals } from '$lib/server/data/index';
import { error, json } from '@sveltejs/kit';
import { rimraf } from 'rimraf';

export async function DELETE({ cookies }: import('./$types.js').RequestEvent) {
  if (!dev) error(404);
  // Delete data directory
  await rimraf(getDataDir());
  await rimraf(getPrivateDataDir());
  invalidatePortfolioGlobals();

  // Also remove token from their cookies
  cookies.delete('token', { path: '/' });

  return json({}, { status: 200 });
}
