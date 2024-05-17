import { object, string, type Infer } from "superstruct"

/** Represents a programming language */
export const Language = object({
  /** Language slug, used to generate links */
  slug: string(),
  /** User-facing name of the programming language */
  name: string(),
  /** A short description of the programming language */
  description: string(),
  /** The color to use for language chips */
  color: string(),
});

export type TLanguage = Infer<typeof Language>;
