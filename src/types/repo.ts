/**
 * Type definitions for links to repos
 */

import { enums, object, string, union, type Infer } from 'superstruct';

/** Names of repos that are officially supported */
export const supportedRepos = ['github', 'gitlab'] as const;

export const RepoProviderStruct = enums(supportedRepos);

export type RepoProvider = Infer<typeof RepoProviderStruct>;

/** Repository info gathered using provider definition */
const ProviderRepoInfoStruct = object({
  /** The provider of the repo (eg "github") */
  provider: RepoProviderStruct,
  /** The repo's slug within the provider (eg MiguelGuthridge/portfolio) */
  path: string(),
});

/** Repository info gathered using provider definition */
export type ProviderRepoInfo = Infer<typeof ProviderRepoInfoStruct>;

/** Repository info set manually */
const ManualRepoInfoStruct = object({
  /** Title text to display for the repo */
  title: string(),
  /** URL to link to */
  url: string(),
  /** Icon to use for the button */
  icon: string(),
});

/** Repository info set manually */
export type ManualRepoInfo = Infer<typeof ManualRepoInfoStruct>;

/** Information about a repo */
export const RepoInfoStruct = union([
  /** Repository info gathered using provider definition */
  ProviderRepoInfoStruct,
  /** Manual repo, with manually set properties */
  ManualRepoInfoStruct,
]);

export type RepoInfo = ProviderRepoInfo | ManualRepoInfo;
