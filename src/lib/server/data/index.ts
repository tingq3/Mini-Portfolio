/**
 * Overall data for the server.
 *
 * This loads all of the data into one giant object, with the idea of massively
 * speeding up read operations. Since write operations are comparatively
 * uncommon, it's fine if we just invalidate the entire data structure when
 * one of those happens -- I may experiment with only invalidating parts of the
 * data, or having the objects live in memory as references, but that is a lot
 * of effort for very little gain.
 */

import { getConfig, type ConfigJson } from './config';
import { getGroupData, listGroups, type GroupData } from './group';
import { getItemData, listItems, type ItemData } from './item';
import { invalidateLocalConfigCache } from './localConfig';
import { getReadme } from './readme';

/** Public global data for the portfolio */
export type PortfolioGlobals = {
  config: ConfigJson,
  readme: string,
  groups: Record<string, GroupData>,
  items: Record<string, Record<string, ItemData>>,
}

/**
 * Load all portfolio data into memory.
 *
 * Note that this does not perform deep data validation (eg ensuring all name
 * references are valid).
 */
async function loadPortfolioGlobals(): Promise<PortfolioGlobals> {
  const config = await getConfig();
  const readme = await getReadme();

  // Load list of groups
  const groupIds = await listGroups();

  // Load all group data
  const groups: Record<string, GroupData> = Object.fromEntries(await Promise.all(
    groupIds.map(async g => [g, await getGroupData(g)])
  ));

  // Load all item data
  // Yucky nesting, but it should be somewhat parallel at least
  // Basically, this is a nested version of the code for loading all group data
  const items: Record<string, Record<string, ItemData>> = Object.fromEntries(await Promise.all(
    groupIds.map(async (g) => [
      g,
      Object.fromEntries(await Promise.all(
        (await listItems(g)).map(async i => [i, await getItemData(g, i)])
      )),
    ])
  ));

  return {
    config,
    readme,
    groups,
    items,
  };
}

let portfolioGlobals: PortfolioGlobals | undefined;

/**
 * Return a reference to the portfolio globals present in-memory, or load it
 * if it hasn't been loaded yet.
 */
export async function getPortfolioGlobals(): Promise<PortfolioGlobals> {
  if (portfolioGlobals) {
    return portfolioGlobals;
  }

  portfolioGlobals = await loadPortfolioGlobals();
  return portfolioGlobals;
}

/**
 * Invalidate the cached data. This should be performed whenever the data has
 * been modified.
 */
export function invalidatePortfolioGlobals() {
  portfolioGlobals = undefined;
  invalidateLocalConfigCache();
}
