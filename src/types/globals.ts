import { object, string, type Infer } from 'superstruct';
import { ClassifierSlugStruct, type Classifier, type ClassifierSlug } from './classifier';
import type { RecordItems } from '$lib/OrderedRecord';

/** Main configuration for the portfolio, `config.json` */
export const PortfolioConfigJson = object({
  /** Name of the person to use within the website. */
  name: string(),
  /** The default classifier to show when loading the root page of the website */
  defaultClassifier: ClassifierSlugStruct,
});

export type PortfolioConfig = Infer<typeof PortfolioConfigJson>;

/** Global information about the portfolio */
export type PortfolioGlobals = {
  /** Configuration of the site */
  config: PortfolioConfig

  /** Top-level `README.md` of the site */
  readme: string

  /** Mapping of all classifiers */
  classifiers: RecordItems<ClassifierSlug, Classifier>
}
