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

  return {
    /**
     * Retrieve information about the data repository.
     *
     * @param token The authentication token
     */
    get,
  };
}
