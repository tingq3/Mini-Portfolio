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

const repo = {
  get,
};

export default repo;
