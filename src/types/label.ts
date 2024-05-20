import {
  defaulted,
  number,
  object,
  string,
  record,
  array,
  optional,
  type Infer,
  enums,
  define,
} from 'superstruct';
import { ClassifierSlugStruct } from './classifier';

/** The slug referring to a label, unique within a classifier */
export type LabelSlug = string & { __label_slug: string };
/** The slug referring to a label, unique within a classifier */
const LabelSlugStruct = define<LabelSlug>('LabelSlug', v => typeof v === 'string');

/**
 * Visibility of the label. One of:
 *
 * * `'visible'`: label is visible in all locations
 * * `'filtered'`: label is not displayed in filter controls
 * * `'unlisted'`: label is only shown when explicitly linked to
 * * `'hidden'`: label is not linked anywhere on the site, but is shown on its
 *   primary page.
 * * `'private'`: label is not accessible anywhere on the site.
 */
const LabelVisibility = enums(['visible', 'filtered', 'unlisted', 'hidden', 'private']);

/** Represents information contained within a label's info.json */
export const LabelInfo = object({
  /** User-facing name of the label */
  name: string(),

  /** Short description of the label */
  description: string(),

  /** Ordering - higher values are placed earlier in lists */
  sort: defaulted(number(), 0),

  /** Color to use when representing the label */
  color: string(),

  /** Visibility of this label */
  visibility: defaulted(LabelVisibility, 'visible'),

  /**
   * Used to associate this label with other categories.
   *
   * * Each key should be a classifier within the project.
   * * Each value should be an array of labels within that classifier, which
   *   should be associated with this label.
   */
  associations: defaulted(
    record(ClassifierSlugStruct, array(LabelSlugStruct)),
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
});

/** Represents a label */
export type Label = {
  /** Slug of label */
  slug: LabelSlug,

  /** Info about the label, loaded from `info.json` */
  info: Infer<typeof LabelInfo>

  /** `README.md` of label */
  readme: string,

  /** Whether the label has an asciinema demo in `demo.cast` */
  hasDemo: boolean,

  /** Whether the label has an icon in `icon.png` */
  hasIcon: boolean,

  /** Whether the label has a banner image in `banner.png` */
  hasBanner: boolean,
}
