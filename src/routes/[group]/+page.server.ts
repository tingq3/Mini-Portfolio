import { error } from '@sveltejs/kit';
import OrdRec from '$lib/OrderedRecord';
import { getData } from '$lib/server';
import type { ClassifierSlug } from '$types';

export function load({ params }: { params: { classifier: ClassifierSlug }}) {
  const globals = getData();
  // Give a 404 if the classifier doesn't exist
  if (!OrdRec.fromItems(globals.classifiers).keys().includes(params.classifier)) {
    throw error(404, `Classifier '${params.classifier}' does not exist`);
  }
  return {
    classifier: params.classifier,
    globals,
  };
}
