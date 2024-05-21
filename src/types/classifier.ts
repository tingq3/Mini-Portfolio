import { any, array, defaulted, define, enums, number, object, record, string, type Infer } from 'superstruct';
import type { Label, LabelSlug } from './label';
import type { OrderedRecord } from '$lib/orderedRecord';

/** The slug referring to a classifier, unique within a data-set */
export type ClassifierSlug = string & { __classifier_slug: string };
/** The slug referring to a classifier, unique within a data-set */
export const ClassifierSlugStruct = define<ClassifierSlug>('ClassifierSlug', v => typeof v === 'string');

/**
 * Visibility of the classifier. One of:
 *
 * * `'visible'`: classifier is visible in all locations
 * * `'unlisted'`: classifier is not displayed in site menu
 * * `'private'`: classifier is not accessible anywhere on the site.
 */
const ClassifierVisibility = enums(['visible', 'unlisted']);

/** Represents information contained within a classifier's info.json */
export const ClassifierInfo = object({
  /** User-facing name of the classifier */
  name: string(),

  /** Short description of the classifier */
  description: string(),

  /** Ordering - higher values are placed earlier in lists */
  sort: defaulted(number(), 0),

  /**
   * Classifier IDs whose labels should be used for filtering on this classifier
   */
  filterClassifiers: defaulted(array(ClassifierSlugStruct), []),

  /** Visibility of this classifier */
  visibility: defaulted(ClassifierVisibility, 'visible'),

  // TODO: implement this
  /** Extra properties that can be used by labels within this classifier */
  extras: defaulted(record(string(), any()), {}),
});

export type Classifier = {
  /** Slug of classifier */
  slug: ClassifierSlug,

  /** Info about the classifier, loaded from `info.json` */
  info: Infer<typeof ClassifierInfo>

  /** `README.md` of classifier */
  readme: string,

  /** Labels within this classifier */
  labels: OrderedRecord<LabelSlug, Label>,
};
