import fs from 'fs/promises';
export { getPortfolioGlobals, invalidatePortfolioGlobals, type PortfolioGlobals } from './data';

/** Returns whether a file exists at the given path */
export async function fileExists(path: string): Promise<boolean> {
  return fs.access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}
