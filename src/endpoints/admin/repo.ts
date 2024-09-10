/** Git repository endpoints */
import { apiFetch, json } from '../fetch';

/** Information about the repo */
export type RepoInfo = {
  /** Object if repo exists, or null otherwise */
  repo: {
    /** The repo URL */
    url: string
    /** The current branch */
    branch: string
    /** The current commit hash */
    commit: string
    /** Whether the repository has any uncommitted changes */
    clean: boolean
  } | null,
};

export default function repo(token: string | undefined) {
  const get = async () => {
    return json(apiFetch(
      'GET',
      '/api/admin/repo',
      token,
    )) as Promise<RepoInfo>;
  };

  const commit = async (message: string) => {
    return json(apiFetch(
      'POST',
      '/api/admin/repo/commit',
      token,
      { message },
    )) as Promise<RepoInfo>;
  };

  const push = async () => {
    return json(apiFetch(
      'POST',
      '/api/admin/repo/push',
      token,
    )) as Promise<RepoInfo>;
  };

  const pull = async () => {
    return json(apiFetch(
      'POST',
      '/api/admin/repo/pull',
      token,
    )) as Promise<RepoInfo>;
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
