import { array, defaulted, number, object, record, string, type Infer } from 'superstruct';
import { Label } from './label';

export const Classifier = object({
  /** User-facing name of the classifier */
  name: string(),

  /** Short description of the classifier */
  description: string(),

  /** Ordering - higher values are placed earlier in lists */
  sort: defaulted(number(), 0),

  // Components not from info.json (added during load)
  // ==================================================

  /** Slug of classifier, added during parsing */
  slug: string(),

  /** `README.md` of classifier, added during parsing */
  readme: string(),

  /** Labels within this classifier */
  labels: record(string(), Label),

  /** Sort order for labels within this classifier */
  labelOrder: array(string()),
});

export type TClassifier = Infer<typeof Classifier>;
