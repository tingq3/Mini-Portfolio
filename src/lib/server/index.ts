import { reloadMainConfig } from './config';
import { reloadFrameworkData } from './framework';
import { reloadLanguageData } from './language';
import loadData from './loadData';
import { reloadProjectData, validateProjects } from './project';

// TODO: Use an environment variable to avoid having this be hard-coded
const DATA_DIR = 'data';

let data = loadData(DATA_DIR);

/** Reload all data used to drive the server */
export function reloadData() {
  data = loadData(DATA_DIR);
}
