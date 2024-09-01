import { itemHasLink } from './links';
import type { PortfolioGlobals } from './server';

/**
 * 2D Array of filter items to display, including whether they are selected.
 *
 * Each array of items is displayed split by a separator.
 */
export type FilterOptions = {
  /** Group ID of the item */
  groupId: string;
  /** Item ID of the item */
  itemId: string;
  /** Whether the item is selected */
  selected: boolean;
}[][];

/** Create an item filter for the given items */
export function createItemFilter(globals: PortfolioGlobals, groupId: string): FilterOptions {
  return globals.groups[groupId].info.filterGroups
    .map(groupId => (
      globals.groups[groupId].info.filterItems
        .map(itemId => ({ groupId, itemId, selected: false }))
    ))
    .filter(group => group.length);
}

/**
 * Returns a list of itemIds within the given groupId that match the given filter
 *
 * @param globals global data
 * @param groupId group ID to find items within
 * @param filter filter options
 */
export function applyFiltersToGroupItems(
  globals: PortfolioGlobals,
  groupId: string,
  filter: FilterOptions,
): string[] {
  // Figure out what items to show to start with
  const items = globals.groups[groupId].info.listedItems;

  // Reduce items based on the filter
  return filter.reduce(
    (prevItems, filterSet) => {
      const selectedFilters = filterSet.filter(f => f.selected);
      // If there are no selections, don't modify the items
      if (!selectedFilters.length) {
        return prevItems;
      }
      // For each item, check if it links to all selected filters
      return prevItems.filter(itemId => {
        const itemToCheck = globals.items[groupId][itemId].info;
        // Item must meet all selected filters
        // If we can find one that doesn't match, exclude it
        return undefined !== selectedFilters.find(f => itemHasLink(itemToCheck, f.groupId, f.itemId));
      });
    },
    items,
  );
}
