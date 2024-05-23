import { any, array, defaulted, define, enums, number, object, record, string, type Infer } from 'superstruct';
import type { Label, LabelSlug } from './label';
import type { RecordItems } from '$lib/OrderedRecord';

/** The slug referring to a classifier, unique within a data-set */
export type ClassifierSlug = string & { __classifier_slug: string };
/** The slug referring to a classifier, unique within a data-set */
export const ClassifierSlugStruct = define<ClassifierSlug>('ClassifierSlug', v => typeof v === 'string');

export const AssociationDisplay = enums(['chip', 'card']);

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

  /**
   * How to display associations for labels in this classifier.
   *
   * Any classifiers not included in this array are displayed as chips.
   */
  associations: defaulted(array(object({
    classifier: ClassifierSlugStruct,
    title: string(),
    display: AssociationDisplay,
  })), []),

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
  labels: RecordItems<LabelSlug, Label>,
};
