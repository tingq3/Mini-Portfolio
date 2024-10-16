/** Git repository endpoints */
import { apiFetch, json } from '../fetch';

export default function firstrun(token: string | undefined) {
  const account = async (username: string, password: string) => {
    return json(apiFetch(
      'POST',
      '/api/admin/firstrun/account',
      token,
      { username, password },
    )) as Promise<{ token: string }>;
  };

  const data = async (repoUrl: string | null = null, branch: string | null = null) => {
    return json(apiFetch(
      'POST',
      '/api/admin/firstrun/data',
      token,
      { repoUrl, branch },
    )) as Promise<{ firstTime: boolean }>;
  };

  return {
    /**
     * Set up account information.
     *
     * @param username The username to use
     * @param password A strong and secure password
     */
    account,
    /**
     * Set up the site's data repository.
     *
     * @param repoUrl The clone URL of the git repo
     * @param branch The branch to check-out
     */
    data,
  };
}
