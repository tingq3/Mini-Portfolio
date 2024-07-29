/**
 * # Types / Repo
 *
 * Type definitions for the data repository
 */

/** Information about the repo */
export type RepoInfo = {
  /** Whether the repo exists */
  repoExists: true
  /** The repo URL */
  url: string
  /** The current branch */
  branch: string
  /** The current commit hash */
  commit: string
} | {
  /** Whether the repo exists */
  repoExists: false
}
