import path from 'path';
import fs from 'fs/promises';
import simpleGit, { CheckRepoActions, type SimpleGit } from 'simple-git';

export function getDataRepoPath(): string {
  const repoPath = process.env.DATA_REPO_PATH;
  if (!repoPath) {
    throw new Error('DATA_REPO_PATH environment variable is not set');
  }
  return repoPath;
}

export function getDataRepo(): SimpleGit {
  return simpleGit(getDataRepoPath());
}

export async function dataRepoIsInitialized(): Promise<boolean> {
  const repoPath = getDataRepoPath();

  // Check for config.json
  try {
    await fs.access(repoPath, fs.constants.F_OK);
  } catch {
    return false;
  }
  return true;
}

export async function dataRepoUsesGit(): Promise<boolean> {
  const repoPath = getDataRepoPath();
  const repo = simpleGit(repoPath);
  return repo.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);
}
