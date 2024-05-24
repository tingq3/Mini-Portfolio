/**
 * lib / server / transformData
 *
 * Code for transforming the portfolio data.
 *
 * In particular, we do all reverse lookups ahead of time so we can give
 * errors.
 */

import { iterLabelsByClassifier, iterLabelsFromClassifier } from '$lib/iterators';
import { getClassifier } from '$lib/util';
import type { ClassifierSlug, Label, LabelSlug, PortfolioGlobals } from '$types';

export default function transformData(data: PortfolioGlobals): string[] {
  const errors = [];

  // Build reverse associations for each classifier
  errors.push(...buildReverseAssociations(data));

  return errors;
}

function buildReverseAssociations(data: PortfolioGlobals): string[] {
  const errors = [];

  for (const [classifier, classLabels] of iterLabelsByClassifier(data)) {
    // console.log(`Processing classifier '${classifier}'`);
    // console.log();
    const theClassifier = getClassifier(data, classifier);
    const classifiersToRemap = Object.entries(theClassifier.info.associations).filter(([, a]) => a.reverseLookup).map(([a]) => a as ClassifierSlug);
    // console.log(`Remap classifiers [${classifiersToRemap}]`);
    for (const theLabel of classLabels) {
      // console.log();
      // console.log(`Processing label ${classifier}/${theLabel.slug}`);
      for (const [associatedClass, labels] of findLabelsAssociatedWith(theLabel.classifier, theLabel.slug, data)) {
        if (classifiersToRemap.includes(associatedClass)) {
          // console.log(`Remapping ${associatedClass}, replaces '${JSON.stringify(theLabel.info.associations)}' with [${labels}]`);
          if (associatedClass in theLabel.info.associations) {
            // console.log('Failed');
            console.log(theLabel);
            errors.push(`Classifier '${classifier}' requires reverse lookups for associations with '${associatedClass}', but label '${theLabel.slug}' defines its own associations.`);
          } else {
            theLabel.info.associations[associatedClass] = labels;
          }
        }
      }
    }
  }

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
