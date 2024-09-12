/** Git repository endpoints */
import type { RepoStatus } from '$lib/server/git';
import { apiFetch, json } from '../fetch';

export default function git(token: string | undefined) {
  const status = async () => {
    return json(apiFetch(
      'GET',
      '/api/admin/git',
      token,
    )) as Promise<{ repo: RepoStatus }>;
  };

  const init = async (url: string) => {
    return json(apiFetch(
      'POST',
      '/api/admin/git/init',
      token,
      { url },
    )) as Promise<RepoStatus>;
  };

  const commit = async (message: string) => {
    return json(apiFetch(
      'POST',
      '/api/admin/git/commit',
      token,
      { message },
    )) as Promise<RepoStatus>;
  };

  const push = async () => {
    return json(apiFetch(
      'POST',
      '/api/admin/git/push',
      token,
    )) as Promise<RepoStatus>;
  };

  const pull = async () => {
    return json(apiFetch(
      'POST',
      '/api/admin/git/pull',
      token,
    )) as Promise<RepoStatus>;
  };

  return {
    /** Retrieve information about the data repository */
    status,
    /** Initialise a git repo */
    init,
    /** Perform a git commit */
    commit,
    /** Perform a git push */
    push,
    /** Perform a git pull */
    pull,
  };
}
