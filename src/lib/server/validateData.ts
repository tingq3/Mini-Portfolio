/**
 * lib / server / validateData
 *
 * Code for validating the portfolio data.
 */

import type { ClassifierSlug, LabelSlug } from '$types';
import type { PortfolioGlobals } from '$types/globals';

/** Entrypoint to data validation */
export default function validateData(data: PortfolioGlobals): string[] {
  const errors: string[] = [];
  // Check classifier's filters
  for (const classifier of data.classifierOrder) {
    errors.push(...validateFilterClassifiers(classifier, data));
  }
  // Check associations for each label
  for (const classifier of data.classifierOrder) {
    for (const label of data.classifiers[classifier].labelOrder) {
      errors.push(...validateLabelAssociations(classifier, label, data));
    }
  }

  return errors;
}

/** Validate all filter classifiers listed for the given classifier */
function validateFilterClassifiers(classifier: ClassifierSlug, data: PortfolioGlobals): string[] {
  const errors: string[] = [];
  const theClassifier = data.classifiers[classifier];

  // Check each filter item
  for (const filter of theClassifier.info.filterClassifiers) {
    if (!data.classifierOrder.includes(filter)) {
      errors.push(`Classifier '${classifier}' filters using non-existent classifier '${filter}'`);
    }
  }

  return errors;
}

/** Validate all associations within the given label */
function validateLabelAssociations(
  classifier: ClassifierSlug,
  label: LabelSlug,
  data: PortfolioGlobals,
): string[] {
  const errors: string[] = [];
  const errHead = `Label '${classifier}/${label}'`;
  const theLabel = data.classifiers[classifier].labels[label];

  for (const classifierToCheck of Object.keys(theLabel.info.associations) as ClassifierSlug[]) {
    // Check the associated classifier exists
    if (!(classifierToCheck in data.classifiers)) {
      errors.push(`${errHead} associates to non-existent classifier '${classifierToCheck}'`);
      continue;
    }
    // Classifier exists, check each of the labels in it
    const labelsInClassifier = data.classifiers[classifierToCheck].labelOrder;
    for (const labelToCheck of theLabel.info.associations[classifierToCheck]) {
      // Check label exists within classifier
      if (!labelsInClassifier.includes(labelToCheck)) {
        errors.push(
          `${errHead} associates to non-existent label '${classifierToCheck}/${labelToCheck}'`
        );
      }
    }
  }

  return errors;
}
