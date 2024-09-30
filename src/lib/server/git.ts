import { error } from '@sveltejs/kit';
import { dataDirContainsData, dataDirIsInit, getDataDir } from './data/dataDir';
import simpleGit, { type FileStatusResult } from 'simple-git';
import fs from 'fs/promises';
import { rimraf } from 'rimraf';
import { spawn } from 'child-process-promise';
import os from 'os';
import { fileExists } from '.';

/** Path to SSH directory */
const SSH_DIR = `${os.homedir()}/.ssh`;

/** Path to the SSH known hosts file */
const KNOWN_HOSTS_FILE = `${os.homedir()}/.ssh/known_hosts`;

const DEFAULT_GITIGNORE = `
config.local.json
`.trimStart();

/** Status information of a git repo */
export interface RepoStatus {
  /** The repo URL */
  url: string
  /** The current branch */
  branch: string | null
  /** The current commit hash */
  commit: string | null
  /** Whether the repository has any uncommitted changes */
  clean: boolean
  /** Number of commits ahead of origin */
  ahead: number
  /** Number of commits behind origin */
  behind: number
  /** Changes for files */
  changes: FileStatusResult[],
}

/** Returns whether the given URL requires SSH */
export function urlRequiresSsh(url: string): boolean {
  return (
    url.includes('@')
    && url.includes(':')
  );
}

/**
 * Run an ssh-keyscan command for the host at the given URL.
 *
 * Eg given URL "git@host.com:path/to/repo", we should extract:
 *                   ^^^^^^^^
 */
export async function runSshKeyscan(url: string) {
  // FIXME: This probably doesn't work in some cases
  const host = url.split('@', 2)[1].split(':', 1)[0];

  // mkdir -p ~/.ssh
  await fs.mkdir(SSH_DIR).catch(() => { });

  // Check if ~/.ssh/known_hosts already has this host in it
  if (await fileExists(KNOWN_HOSTS_FILE)) {
    const hostsContent = await fs.readFile(KNOWN_HOSTS_FILE, { encoding: 'utf-8' });
    for (const line of hostsContent.split(/\r?\n/)) {
      if (line.startsWith(`${host} `)) {
        // Host is already known
        return;
      }
    }
  }

  const process = await spawn('ssh-keyscan', [host], { capture: ['stdout'] });

  console.log(process.stdout);
  console.log(typeof process.stdout);

  // Now add to ~/.ssh/known_hosts
  await fs.appendFile(KNOWN_HOSTS_FILE, process.stdout, { encoding: 'utf-8' });
}

/** Return status info for repo */
export async function getRepoStatus(): Promise<RepoStatus> {
  const repo = simpleGit(getDataDir());
  const status = await repo.status();

  // Workaround for issue with simple-git
  // https://github.com/steveukx/git-js/issues/1020
  const branch = status.current !== 'No' ? status.current : null;

  return {
    url: (await repo.remote(['get-url', 'origin']) || '').trim(),
    branch,
    // If command fails, no commit has been made
    commit: await repo.revparse(['--short', 'HEAD']).catch(() => null),
    clean: status.isClean(),
    ahead: status.ahead,
    behind: status.behind,
    // Need to map changed files to a new object or we get a JSON serialize
    // error
    changes: status.files.map(f => ({ ...f })),
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
  } catch (e: any) {
    console.log(e);
    throw error(400, `${e}`);
  }

  // If there are files in the repo, we should validate that it is a proper
  // portfolio data repo.
  // Ignore .git, since it is included in empty repos too.
  if ((await fs.readdir(getDataDir())).find(f => f !== '.git')) {
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
  // TODO: Skip this step if the gitignore already ignores all contents
  // probably worth finding a library to deal with this, since it is
  // complicated
  await fs.appendFile(`${getDataDir()}/.gitignore`, DEFAULT_GITIGNORE, { encoding: 'utf-8' });
}
