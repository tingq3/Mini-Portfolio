import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';
import type { Label } from '$types';
import { saveLabel } from '$lib/server/saveData.js';
import simpleGit from 'simple-git';
import { dataRepoIsInitialized, getDataRepo, getDataRepoPath } from '$lib/dataRepo.js';

export async function POST({ request, cookies }) {
  const { repoUrl, branch }: { repoUrl: string | null, branch: string | null }
    = await request.json();

  // Check whether the data repo is set up
  if (await dataRepoIsInitialized()) {
    throw error(403, 'Data repo is already set up');
  }

  const dir = getDataRepoPath();

  if (repoUrl) {
    try {
      await simpleGit().clone(repoUrl, dir, { branch });
    } catch (e) {
      throw error(400, `${e}`);
    }
  }

  return json({}, { status: 200 });
}
