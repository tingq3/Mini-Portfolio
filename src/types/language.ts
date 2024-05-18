import { boolean, defaulted, object, string, type Infer } from "superstruct"

/** Represents a programming language */
export const Language = object({
  /** Language slug, used to generate links. Added when loading data. */
  slug: string(),
  /** User-facing name of the programming language */
  name: string(),
  /** A short description of the programming language */
  description: string(),
  /** The contents of README.md, added when loading data */
  readme: string(),
  /** The color to use for language chips */
  color: string(),
  /** Whether to exclude the language from the main list */
  exclude: defaulted(boolean(), false),
});

export type TLanguage = Infer<typeof Language>;
