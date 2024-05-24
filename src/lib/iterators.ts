import type { ClassifierSlug, Label, PortfolioGlobals } from '$types';
import OrdRec from './OrderedRecord';

export function iterLabels(globals: PortfolioGlobals): Label[] {
  return OrdRec
    .fromItems(globals.classifiers)
    .values()
    .flatMap(c => OrdRec.fromItems(c.labels).values());
}

export function iterLabelsByClassifier(globals: PortfolioGlobals): [ClassifierSlug, Label[]][] {
  return OrdRec
    .fromItems(globals.classifiers)
    .items()
    .map(([cs, ci]) => [cs, OrdRec.fromItems(ci.labels).values()]);
}

export function iterLabelsFromClassifier(globals: PortfolioGlobals, classifier: ClassifierSlug): Label[] {
  return OrdRec.fromItems(OrdRec.fromItems(globals.classifiers).get(classifier).labels).values();
}
