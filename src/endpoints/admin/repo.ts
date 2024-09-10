/** Git repository endpoints */
import type { RepoStatus } from '$lib/server/data/git';
import { apiFetch, json } from '../fetch';

export default function repo(token: string | undefined) {
  const get = async () => {
    return json(apiFetch(
      'GET',
      '/api/admin/repo',
      token,
    )) as Promise<{ repo: RepoStatus }>;
  };

  const commit = async (message: string) => {
    return json(apiFetch(
      'POST',
      '/api/admin/repo/commit',
      token,
      { message },
    )) as Promise<RepoStatus>;
  };

  const push = async () => {
    return json(apiFetch(
      'POST',
      '/api/admin/repo/push',
      token,
    )) as Promise<RepoStatus>;
  };

  const pull = async () => {
    return json(apiFetch(
      'POST',
      '/api/admin/repo/pull',
      token,
    )) as Promise<RepoStatus>;
  };

  return {
    /** Retrieve information about the data repository */
    get,
    /** Perform a git commit */
    commit,
    /** Perform a git push */
    push,
    /** Perform a git pull */
    pull,
  };
}
