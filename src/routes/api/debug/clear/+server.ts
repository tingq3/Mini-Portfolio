import { getDataRepoPath } from '$lib/dataRepo.js';
import { json } from '@sveltejs/kit';
import { rimraf } from 'rimraf';


export async function DELETE({ request, cookies }) {

  // Delete data directory
  await rimraf(getDataRepoPath());

  return json({}, { status: 200 });
}
