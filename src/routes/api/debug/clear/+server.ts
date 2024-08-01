import { getDataDir } from '$lib/server/data/dataDir.js';
import { json } from '@sveltejs/kit';
import { rimraf } from 'rimraf';


export async function DELETE({ request, cookies }) {

  // Delete data directory
  await rimraf(getDataDir());

  return json({}, { status: 200 });
}
