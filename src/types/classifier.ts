import { defaulted, enums, number, object, string, type Infer } from 'superstruct';
import type { Label } from './label';

/**
 * Visibility of the classifier. One of:
 *
 * * `'visible'`: classifier is visible in all locations
 * * `'unlisted'`: classifier is not displayed in site menu
 * * `'hidden'`: classifier is not linked anywhere on the site, but is shown on
 *   its primary page.
 * * `'private'`: classifier is not accessible anywhere on the site.
 */
const LabelVisibility = enums(['visible', 'filtered', 'unlisted', 'hidden', 'private']);

/** Represents information contained within a classifier's info.json */
export const ClassifierInfo = object({
  /** User-facing name of the classifier */
  name: string(),

  /** Short description of the classifier */
  description: string(),

  /** Ordering - higher values are placed earlier in lists */
  sort: defaulted(number(), 0),

  /** Visibility of this label */
  visibility: defaulted(LabelVisibility, 'visible'),
});

export type Classifier = {
  /** Slug of classifier */
  slug: string,

  /** Info about the classifier, loaded from `info.json` */
  info: Infer<typeof ClassifierInfo>

  /** `README.md` of classifier */
  readme: string,

  /** Labels within this classifier */
  labels: Record<string, Label>,

  /** Sort order for labels within this classifier */
  labelOrder: string[],
};
