import { reloadLanguageData } from './language';
import { reloadProjectData } from './project';

/** Reload all data used to drive the server */
export function reloadData() {
  reloadProjectData();
  reloadLanguageData();
}
