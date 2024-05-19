import { reloadMainConfig } from './config';
import { reloadFrameworkData } from './framework';
import { reloadLanguageData } from './language';
import { reloadProjectData, validateProjects } from './project';

/** Reload all data used to drive the server */
export function reloadData() {
  reloadMainConfig();
  reloadProjectData();
  reloadLanguageData();
  reloadFrameworkData();
  // Then validate the data
  validateProjects();
}
