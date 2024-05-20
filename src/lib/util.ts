import type { ClassifierSlug, Label, LabelSlug } from '$types';

/**
 * Filter the given array of labels based on the selected labels from the given
 * classifier.
 *
 * Labels are only included in the result if they are associated with at least
 * one of the selected labels.
 */
export function filterLabelsByAssociations(labels: Label[], classifier: ClassifierSlug, selectedLabels: LabelSlug[]) {
  return labels
    .filter(p => p.info.associations[classifier].find(l => selectedLabels.includes(l)) !== undefined);
}
