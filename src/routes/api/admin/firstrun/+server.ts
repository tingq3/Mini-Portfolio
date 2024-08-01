import { json } from '@sveltejs/kit';
import { getDataDir } from '$lib/server/data/dataDir.js';
import { mkdir } from 'fs/promises';
import { setupGitRepo } from '$lib/server/data/git.js';
import { authSetup } from '$lib/server/auth.js';

export async function POST({ request, cookies }) {
  const { repoUrl, branch }: { repoUrl: string | null, branch: string | null }
    = await request.json();

  // If we were given a repoUrl, set it up
  if (repoUrl) {
    await setupGitRepo(repoUrl, branch);
  } else {
    // Otherwise, just create the data dir empty
    await mkdir(getDataDir());
  }

  // Now set up auth
  const credentials = await authSetup();

  return json(credentials, { status: 200 });
}
