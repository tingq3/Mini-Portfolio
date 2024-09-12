import { error } from '@sveltejs/kit';
import { dataDirContainsData, dataDirIsInit, getDataDir } from './data/dataDir';
import simpleGit, { type FileStatusResult } from 'simple-git';
import { appendFile, readdir } from 'fs/promises';
import { rimraf } from 'rimraf';

const DEFAULT_GITIGNORE = `
config.local.json
`.trimStart();

/** Status information of a git repo */
export type RepoStatus = {
  /** The repo URL */
  url: string
  /** The current branch */
  branch: string
  /** The current commit hash */
  commit: string
  /** Whether the repository has any uncommitted changes */
  clean: boolean
  /** Number of commits ahead of origin */
  ahead: number
  /** Number of commits behind origin */
  behind: number
  /** Changes for files */
  changes: FileStatusResult[],
};

/** Return status info for repo */
export async function getRepoStatus(): Promise<RepoStatus> {
  const repo = simpleGit(getDataDir());
  const status = await repo.status();

  void status.created;

  return {
    url: (await repo.remote(['get-url', 'origin']) || '').trim(),
    branch: status.current as string,
    commit: await repo.revparse(['--short', 'HEAD']),
    clean: status.isClean(),
    ahead: status.ahead,
    behind: status.behind,
    changes: status.files,
  };
}

/** Set up the data dir given a git repo URL and branch name */
export async function setupGitRepo(repo: string, branch: string | null) {
  // Check whether the data repo is set up
  if (await dataDirIsInit()) {
    throw error(403, 'Data repo is already set up');
  }

  const dir = getDataDir();

  // Set up branch options
  const options: Record<string, string> = branch === null ? {} : { '--branch': branch };

  try {
    await simpleGit().clone(repo, dir, options);
  } catch (e) {
    throw error(400, `${e}`);
  }

  // If there are files in the repo, we should validate that it is a proper
  // portfolio data repo.
  // Ignore .git, since it is included in empty repos too.
  if ((await readdir(getDataDir())).find(f => f !== '.git')) {
    if (!await dataDirContainsData()) {
      // Clean up and delete repo before giving error
      await rimraf(getDataDir());
      throw error(
        400,
        'The repo directory is non-empty, but does not contain a config.json file'
      );
    }
  } else {
    // Empty repo, setup up gitignore
    await setupGitignore();
  }
}

/** Set up a default gitignore */
export async function setupGitignore() {
  await appendFile(`${getDataDir()}/.gitignore`, DEFAULT_GITIGNORE, { encoding: 'utf-8' });
}
