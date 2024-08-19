/**
 * Code for serializing and deserializing filter parameters, such that they
 * can be stored within the URL bar
 *
 * ## Format
 *
 * `<classifier>:<labels,>;`
 *
 * Essentially:
 *
 * * The slug of the classifier
 * * a `:` colon
 * * The filtered labels selected within that classifier, separated by commas
 * * A `;` semicolon to separate classifiers
 */
import type { OrderedRecord } from '$lib/OrderedRecord';
import type { ClassifierSlug, LabelSlug } from '$types';

/** Convert a filter into a string to be placed in the query string */
export function filterToParams(filter: OrderedRecord<ClassifierSlug, OrderedRecord<LabelSlug, boolean>>): string {
  return filter
    // Convert each set of labels into a comma-separated list
    .map(
      (c, labels) =>
        labels
          .filter((k, selected) => selected)
          .keys()
          .join(',')
    )
    .items()
    // Filter out unselected classifiers
    .filter(([, v]) => v.length)
    // Map to `classifier=labels`
    .map(([classifier, labels]) => `${classifier}:${labels}`)
    // Join by a semicolon
    .join(';');
}

/**
 * Given a list of filters and a query string value, update the filters so that
 * the required filter labels are selected.
 */
export function applyParamsToFilter(
  filter: OrderedRecord<ClassifierSlug, OrderedRecord<LabelSlug, boolean>>,
  params: string,
) {
  try {
    params
      // Split into each classifier
      .split(';')
      // For each one, apply its selected values
      .forEach(classSelected => {
        const [classifier, labels] = classSelected.split(':');
        // Iterate over the labels
        labels
          .split(',')
          .forEach(
            label => filter
              .get(classifier as ClassifierSlug)
              // Select them
              .set(label as LabelSlug, true)
          );
      });
  } catch (e) {
    // Error occurred -- this probably indicates that the query string was
    // invalid, so just log it and continue
    console.error("Couldn't apply filters from query string", e);
  }
}
