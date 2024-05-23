import OrdRec, { type OrderedRecord } from '$lib/OrderedRecord';
import { getClassifier } from '$lib/util';
import type { AssociationOptions, AssociationOptionsDisplay, Classifier, ClassifierSlug, Label, LabelSlug, PortfolioGlobals } from '$types';

export function getAssociationDisplayInfo(
  classifier: Classifier,
  thisClassifier: Classifier,
): AssociationOptions {
  // Check for provided value
  if (classifier.slug in thisClassifier.info.associations) {
    return thisClassifier.info.associations[classifier.slug];
  }
  // Give a default value
  if (classifier.slug === thisClassifier.slug) {
    // Same classifier means we should display it as a "See also" card list.
    return {
      title: 'See also',
      display: 'chip',
      reverseLookup: false,
    };
  } else {
    // Default representation
    return {
      title: classifier.info.name,
      display: 'chip',
      reverseLookup: false,
    };
  }
}

export function filterAssociatedLabelsByDisplayType(
  globals: PortfolioGlobals,
  labels: OrderedRecord<ClassifierSlug, OrderedRecord<LabelSlug, { label: Label }>>,
  thisClassifier: Classifier,
  displayOption: AssociationOptionsDisplay,
): OrderedRecord<ClassifierSlug, OrderedRecord<LabelSlug, { label: Label }>> {
  return OrdRec.fromItems(
    labels
      .items()
      .filter(
        ([classifier]) =>
          getAssociationDisplayInfo(getClassifier(globals, classifier), thisClassifier).display
          === displayOption
      )
  );
}
