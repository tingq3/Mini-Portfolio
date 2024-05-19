import { boolean, defaulted, object, string, type Infer } from 'superstruct';

/** Represents a framework */
export const Framework = object({
  /** User-facing name of the framework */
  name: string(),
  /** A short description of the framework */
  description: string(),
  /** Color to use for the framework */
  color: string(),
  /** Whether to exclude the language from the main list */
  exclude: defaulted(boolean(), false),

  // Components not from info.json (added during load)
  // ==================================================

  /** Slug of framework, added during loading */
  slug: string(),
  /** Readme of framework, added during loading */
  readme: string(),
});

/** Represents a framework */
export type TFramework = Infer<typeof Framework>;

/** A map from a framework slug to its framework info */
export type TFrameworkMap = Record<string, TFramework>;
