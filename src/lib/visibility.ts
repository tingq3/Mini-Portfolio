import type { Label, LabelSlug, LabelVisibility } from '$types/label';

/** Create a filter function for the given visibility level */
export function visibilityFilter(visibility: LabelVisibility) {
  const toFilter: LabelVisibility[] = [];
  switch (visibility) {
    case 'hidden':
      toFilter.push('hidden');
      // falls through
    case 'unlisted':
      toFilter.push('unlisted');
      // falls through
    case 'filtered':
      toFilter.push('filtered');
      // falls through
    case 'visible': // No action;
  }
  return (k: LabelSlug, label: Label) => {
    return !toFilter.includes(label.info.visibility);
  };
}
