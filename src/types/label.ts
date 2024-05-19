import {
  defaulted,
  number,
  object,
  string,
  record,
  array,
  optional,
  boolean,
  type Infer,
} from 'superstruct';

export const Label = object({
  /** User-facing name of the label */
  name: string(),

  /** Short description of the label */
  description: string(),

  /** Ordering - higher values are placed earlier in lists */
  sort: defaulted(number(), 0),

  /** Color to use when representing the label */
  color: string(),

  /**
   * Used to associate this label with other categories.
   *
   * * Each key should be a classifier within the project.
   * * Each value should be an array of labels within that classifier, which
   *   should be associated with this label.
   */
  associations: defaulted(
    record(string(), array(string())),
    {},
  ),

  /** URLs associated with the label */
  links: defaulted(
    object({
      /** URL of the source repository of the label */
      repo: optional(string()),

      /** URL of the site demonstrating the label */
      site: optional(string()),

      /** URL of the documentation site for the label */
      docs: optional(string()),
    }),
    {},
  ),

  /** Information about the package distribution of the label */
  package: optional(object({
    /** Installation command */
    command: string(),
    /** URL for viewing the label's package listing */
    url: string(),
  })),

  // Components not from info.json (added during load)
  // ==================================================

  /** Slug of label, added during loading */
  slug: string(),

  /** `README.md` of label, added during loading */
  readme: string(),

  /** Whether the label has an asciinema demo in `demo.cast` */
  hasDemo: boolean(),

  /** Whether the label has an icon in `icon.png` */
  hasIcon: boolean(),

  /** Whether the label has a banner image in `banner.png` */
  hasBanner: boolean(),
});

export type TLabel = Infer<typeof Label>;
