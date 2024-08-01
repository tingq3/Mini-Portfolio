import { array, boolean, nullable, number, object, optional, record, string, type Infer } from 'superstruct';

/**
 * Validator for config.local.json file
 */
export const ConfigLocalJsonStruct = object({
  /**
   * Authentication data.
   *
   * If null, then authentication is disabled, and logging in is now allowed.
   */
  auth: nullable(object({
    /** Username of account */
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
});

/** Type definition for config.local.json file */
export type ConfigLocalJson = Infer<typeof ConfigLocalJsonStruct>;
