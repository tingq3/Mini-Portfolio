import { error, json } from '@sveltejs/kit';
import simpleGit from 'simple-git';
import debug from 'debug';
import { dataRepoIsInitialized, getDataRepo, getDataRepoPath } from '$lib/dataRepo.js';
import { appendFile, writeFile, readdir, mkdir } from 'fs/promises';
import path from 'path';
import { rimraf } from 'rimraf';

// TODO: Delete debugging code
debug.enable('simple-git,simple-git:*');

export async function POST({ request, cookies }) {
  const { repoUrl, branch }: { repoUrl: string | null, branch: string | null }
    = await request.json();

  // Check whether the data repo is set up
  if (await dataRepoIsInitialized()) {
    throw error(403, 'Data repo is already set up');
  }

  const dir = getDataRepoPath();

  // Set up branch options
  const options: Record<string, string> = branch === null ? {} : { '--branch': branch };

  if (repoUrl) {
    try {
      await simpleGit().clone(repoUrl, dir, options);
    } catch (e) {
      throw error(400, `${e}`);
    }
  } else {
    // Create an empty directory
    // Pretty sure the recursive option means it'll be ok with the directory
    // already existing
    await mkdir(getDataRepoPath(), { recursive: true });
  }

  // Ignore .git, since it is included in empty repos too
  const dirContents = (await readdir(getDataRepoPath())).filter(f => f !== '.git');
  // Check for config.json if the repo isn't empty
  if (dirContents.length) {
    if (!dirContents.includes('config.json')) {
      // Clean up and delete repo
      await rimraf(getDataRepoPath());
      throw error(
        400,
        'The repo directory is non-empty, but does not contain a config.json file'
      );
    }
  }

  // Add config.local.json repo info
  let repo: { url: string, branch: string } | null;
  if (repoUrl) {
    repo = {
      url: repoUrl,
      // TODO: When can branch be null? Is my check for it reasonable?
      // Should I give an error if it is?
      branch: (await getDataRepo().status()).current ?? 'main',
    };
  } else {
    // Not using a git repo, so set it as null
    repo = null;
  }

  await writeFile(path.join(dir, 'config.local.json'), JSON.stringify({
    repo,
  }));

  // Also gitignore the config.local.json
  await appendFile(path.join(dir, '.gitignore'), 'config.local.json\n');

  return json({}, { status: 200 });
}
