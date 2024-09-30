import path from 'path';
import simpleGit, { CheckRepoActions } from 'simple-git';
import { fileExists } from '..';

/** Returns the path to the data repository */
export function getDataDir(): string {
  const repoPath = process.env.DATA_REPO_PATH;
  if (!repoPath) {
    throw new Error('DATA_REPO_PATH environment variable is not set');
  }
  return repoPath;
}

/**
 * Returns whether the data directory contains data that can conceivably
 * be used by the portfolio website.
 *
 * Currently, this checks for the existence of a config.json, but in the future
 * I may force it to check more thoroughly for data validity.
 */
export async function dataDirContainsData(): Promise<boolean> {
  const repoPath = getDataDir();
  return await fileExists(path.join(repoPath, 'config.json'));
}

/**
 * Returns whether the data directory has been initialized.
 *
 * This checks for the existence of a config.local.json.
 */
export async function dataDirIsInit(): Promise<boolean> {
  const repoPath = getDataDir();
  return await fileExists(path.join(repoPath, 'config.local.json'));
}

/** Returns whether the data directory is backed by git */
export async function dataDirUsesGit(): Promise<boolean> {
  const repoPath = getDataDir();
  const repo = simpleGit(repoPath);
  return repo.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);
}
