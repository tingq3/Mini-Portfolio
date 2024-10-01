import { readFile, writeFile } from 'fs/promises';
import { number, object, record, string, validate, type Infer } from 'superstruct';
import { getPrivateDataDir } from './dataDir';

/** Path to config.local.json */
const CONFIG_LOCAL_JSON = () => `${getPrivateDataDir()}/config.local.json`;

/**
 * Validator for config.local.json file
 */
export const ConfigLocalJsonStruct = object({
  /**
   * Authentication data, as a record between user IDs and their
   * authentication info.
   */
  auth: record(string(), object({
    /** The user's username, used for logging in */
    username: string(),
    /** Information about the user's password */
    password: object({
      /** Hash of password */
      hash: string(),
      /** Salt of password */
      salt: string(),
    }),
    /**
     * Information about sessions for this user.
     *
     * Sessions should be implemented using a JWT, where each session has a
     * unique session ID, and an expiry time.
     */
    sessions: object({
      /**
       * Don't accept tokens issued before this unix timestamp.
       *
       * This is used to revoke all tokens, we can just update this value to
       * be the current time, which will cause all sessions to become invalid.
       */
      notBefore: number(),
      /**
       * Mapping of revoked sessions.
       *
       * Each key is the session ID, each value is the timestamp that it
       * would actually expire at (used for cleaning the data, so we can remove
       * sessions that have expired).
       */
      revokedSessions: record(string(), number()),
    })
  })),
  /** Version of server that last accessed the config.local.json */
  version: string(),
});

/** Type definition for config.local.json file */
export type ConfigLocalJson = Infer<typeof ConfigLocalJsonStruct>;

/** Cache of the local config to speed up operations */
let localConfigCache: ConfigLocalJson | undefined;

/** Return the local configuration, stored in `/private-data/config.local.json` */
export async function getLocalConfig(): Promise<ConfigLocalJson> {
  if (localConfigCache) {
    return localConfigCache;
  }
  const data = await readFile(CONFIG_LOCAL_JSON(), { encoding: 'utf-8' });

  // Validate data
  const [err, parsed] = validate(JSON.parse(data), ConfigLocalJsonStruct);
  if (err) {
    console.log('Error while parsing config.local.json');
    console.error(err);
    throw err;
  }

  localConfigCache = parsed;

  return localConfigCache;
}

/** Update the local configuration, stored in `/data/config.local.json` */
export async function setLocalConfig(newConfig: ConfigLocalJson) {
  localConfigCache = newConfig;
  await writeFile(CONFIG_LOCAL_JSON(), JSON.stringify(newConfig, undefined, 2));
}

/**
 * Invalidate the local config cache -- should be used if the data was erased
 */
export function invalidateLocalConfigCache() {
  localConfigCache = undefined;
}
