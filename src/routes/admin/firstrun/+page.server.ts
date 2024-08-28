import { redirect } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir.js';

export async function load({ params }) {
  if (await dataDirIsInit()) {
    redirect(303, '/');
  }
  return {};
}
