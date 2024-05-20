import type { PortfolioGlobals } from '$types';
import loadData from './loadData';
import validateData from './validateData';

// TODO: Use an environment variable to avoid having this be hard-coded
const DATA_DIR = 'data';

let data: PortfolioGlobals;

/** Reload all data used to drive the server */
export function reloadData() {
  const results = loadData(DATA_DIR);
  if (Array.isArray(results)) {
    console.error('!!! Errors occurred while loading data!');
    for (const err of results) {
      console.error(` >>> ${err}`);
    }
    process.exit(1);
  }
  // Now validate the data
  const errors = validateData(results);
  if (errors.length) {
    console.error('!!! Errors occurred while validating data!');
    for (const err of errors) {
      console.error(` >>> ${err}`);
    }
    process.exit(1);
  }
  data = results;
}
