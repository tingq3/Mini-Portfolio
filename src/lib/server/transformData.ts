/**
 * lib / server / transformData
 *
 * Code for transforming the portfolio data.
 *
 * In particular, we do all reverse lookups ahead of time so we can give
 * errors.
 */

import OrdRec from '$lib/OrderedRecord';
import { iterLabelsByClassifier } from '$lib/iterators';
import type { ClassifierSlug, Label, LabelSlug, PortfolioGlobals } from '$types';

export default function transformData(data: PortfolioGlobals): string[] {
  const errors = [];

  return errors;
}

function buildReverseAssociationsForClassifier(data: PortfolioGlobals, classifier: ClassifierSlug): string[] {
  const errors = [];

  const theClassifier = OrdRec.fromItems(data.classifiers).get(classifier);

  // TODO: Keep working on this

  return errors;
}

function findLabelsAssociatedWith(classifier: ClassifierSlug, label: LabelSlug, data: PortfolioGlobals): [ClassifierSlug, LabelSlug[]][] {
  return iterLabelsByClassifier(data)
    .map(
      ([c, labels]) => [
        c,
        labels
          .filter(l => labelAssociatesWith(l, classifier, label))
          .map(l => l.slug)
      ]
    );
}

function labelAssociatesWith(label: Label, classifier: ClassifierSlug, slug: LabelSlug): boolean {
  if (classifier in label.info.associations) {
    return label.info.associations[classifier].includes(slug);
  } else {
    return false;
  }
}
