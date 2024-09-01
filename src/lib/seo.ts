/**
 * Helper functions used in SEO (search engine optimization).
 */

import type { PortfolioGlobals } from './server';

export function generateKeywords(globals: PortfolioGlobals, groupId?: string, itemId?: string): string {
  const keywords = [...globals.config.siteKeywords];
  if (groupId) {
    keywords.push(...globals.groups[groupId].info.keywords);
    if (itemId) {
      keywords.push(...globals.items[groupId][itemId].info.keywords);
    }
  }
  return keywords.join(', ');
}
