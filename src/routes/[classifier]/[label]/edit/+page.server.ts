import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import OrdRec from '$lib/OrderedRecord';
import { getData } from '$lib/server';
import type { ClassifierSlug, LabelSlug } from '$types';

export function load({ params: { classifier, label } }: { params: { classifier: ClassifierSlug, label: LabelSlug }}) {
  // Check that we're running in dev mode
  if (!dev) {
    throw error(403, 'Must be running in dev mode to edit data');
  }

  const globals = getData();
  const theClassifier = OrdRec.fromItems(globals.classifiers).get(classifier);
  // Give a 404 if the classifier doesn't exist
  if (!theClassifier) {
    throw error(404, `Classifier '${classifier}' does not exist`);
  }
  // And also if the label doesn't exist
  if (!OrdRec.fromItems(theClassifier.labels).keys().includes(label)) {
    throw error(404, `Label '${label}' does not exist within classifier '${classifier}`);
  }
  return {
    classifier,
    label,
    globals: getData()
  };
}
