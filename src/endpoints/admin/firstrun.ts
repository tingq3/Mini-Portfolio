/** Git repository endpoints */
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
  repoUrl?: string  ,
  branch?: string  ,
) {
  return json(apiFetch(
    'POST',
    '/api/admin/firstrun',
    undefined,
    { username, password, repoUrl, branch },
  )) as Promise<{ token: string, firstTime: boolean }>;
}
