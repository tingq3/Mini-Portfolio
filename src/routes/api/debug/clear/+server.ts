import { dev } from '$app/environment';
import { getDataDir } from '$lib/server/data/dataDir.js';
import { invalidatePortfolioGlobals } from '$lib/server/data/index.js';
import { error, json } from '@sveltejs/kit';
import { rimraf } from 'rimraf';

export async function DELETE({ request, cookies }) {
  if (!dev) throw error(404);
  // Delete data directory
  await rimraf(getDataDir());
  invalidatePortfolioGlobals();

  return json({}, { status: 200 });
}
