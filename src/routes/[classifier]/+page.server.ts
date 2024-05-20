import { getData } from '$lib/server';
import type { ClassifierSlug } from '$types';

export function load({ params }: { params: { classifier: ClassifierSlug }}) {
  // FIXME: We should give a 404 if the classifier doesn't exist
  return {
    classifier: params.classifier,
    globals: getData()
  };
}
