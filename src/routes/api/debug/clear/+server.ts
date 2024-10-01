import { dev } from '$app/environment';
import { destroyAuthSecret } from '$lib/server/auth/secret.js';
import { getDataDir } from '$lib/server/data/dataDir';
import { invalidatePortfolioGlobals } from '$lib/server/data/index';
import { error, json } from '@sveltejs/kit';
import { rimraf } from 'rimraf';

export async function DELETE({ cookies }) {
  if (!dev) throw error(404);
  // Delete data directory
  await rimraf(getDataDir());
  invalidatePortfolioGlobals();

  // Destroy the auth secret
  await destroyAuthSecret();

  // Also remove token from their cookies
  cookies.delete('token', { path: '/' });

  return json({}, { status: 200 });
}
