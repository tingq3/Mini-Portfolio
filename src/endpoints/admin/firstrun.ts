/** Git repository endpoints */
import type { FirstRunCredentials } from '$lib/server/auth/setup';
import { apiFetch, json } from '../fetch';

/**
 * Set up the site's data repository.
 *
 * @param repoUrl The clone URL of the git repo
 * @param branch The branch to check-out
 */
export default async function (
  username: string,
  password: string,
  repoUrl?: string | undefined,
  branch?: string | undefined,
) {
  return json(apiFetch(
    'POST',
    '/api/admin/firstrun',
    undefined,
    { username, password, repoUrl, branch },
  )) as Promise<{ credentials: FirstRunCredentials, firstTime: boolean }>;
}
