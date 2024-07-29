/** Git repository endpoints */
import { apiFetch } from '../fetch';
import type { RepoInfo } from '$types/repo';

/**
 * Retrieve information about the data repository.
 *
 * @param token The authentication token
 */
export const get = async (token: string) => {
  return apiFetch(
    'GET',
    '/api/admin/repo',
    token,
  ) as Promise<RepoInfo>;
};

/**
 * Set up the site's data repository.
 *
 * @param repoUrl The clone URL of the git repo
 * @param branch The branch to check-out
 */
export const post = async (repoUrl: string | null, branch: string | null) => {
  return apiFetch(
    'POST',
    '/api/admin/repo',
    undefined,
    { repoUrl, branch },
  ) as Promise<Record<string, never>>;
};

const repo = {
  get,
  post,
};

export default repo;
