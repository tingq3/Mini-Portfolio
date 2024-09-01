import { readFile, writeFile } from 'fs/promises';
import { array, nullable, object, string, validate, type Infer } from 'superstruct';
import { getDataDir } from './dataDir';
import { version } from '$app/environment';
import { unsafeLoadConfig } from './migrations/unsafeLoad';

/** Path to config.json */
const CONFIG_JSON = () => `${getDataDir()}/config.json`;

/** Validator for config.json file */
export const ConfigJsonStruct = object({
  /** Long-form name of the site, displayed in the navigator on the main page */
  siteName: string(),
  /** Short-form name of the site, displayed in the navigator on other pages */
  siteShortName: string(),
  /**
   * Description of the site, used for SEO on the main page. This will appear
   * as the description in web search results.
   */
  siteDescription: string(),
  /** Keywords of the site, used for SEO */
  siteKeywords: array(string()),
  /** Filename of icon to use for the site */
  siteIcon: nullable(string()),
  /**
   * The groups to list on the main page, in the order in which they should
   * appear.
   *
   * Any groups not within this array will still be accessible through their
   * pages, but won't be shown on the main page.
   */
  listedGroups: array(string()),
  /** The default color to use for the site */
  color: string(),
  /** Version of server that last accessed the config.json */
  version: string(),
});

/** Main configuration for the portfolio, `config.json` */
export type ConfigJson = Infer<typeof ConfigJsonStruct>;

/**
 * Return the version of the configuration. Used to determine if a migration is
 * necessary.
 *
 * This does not validate any of the data.
 */
export async function getConfigVersion(): Promise<string> {
  const data = await unsafeLoadConfig(getDataDir()) as { version?: string };

  // Note: v0.1.0 did not have a version number in the file
  return data.version ?? '0.1.0';
}

/** Return the configuration, stored in `/data/config.json` */
export async function getConfig(): Promise<ConfigJson> {
  const data = await readFile(CONFIG_JSON(), { encoding: 'utf-8' });

  // Validate data
  const [err, parsed] = validate(JSON.parse(data), ConfigJsonStruct);
  if (err) {
    console.log('Error while parsing config.json');
    console.error(err);
    throw err;
  }

  return parsed;
}

/** Update the configuration, stored in `/data/config.json` */
export async function setConfig(newConfig: ConfigJson) {
  await writeFile(CONFIG_JSON(), JSON.stringify(newConfig, undefined, 2));
}

/** Set up the default server configuration */
export async function initConfig() {
  await setConfig({
    siteName: 'My portfolio',
    siteShortName: 'Portfolio',
    siteDescription: 'View my portfolio',
    siteKeywords: ['portfolio'],
    siteIcon: null,
    listedGroups: [],
    color: '#ffaaff',
    version,
  });
}
