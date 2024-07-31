import { boolean, nullable, object, optional, string, type Infer } from "superstruct";

/**
 * Validator for config.local.json file
 */
export const ConfigLocalJsonStruct = object({
  /** Authentication data */
  auth: object({
    username: string(),
    passwordHash: string(),
    passwordSalt: string(),
  })
});

export type ConfigLocalJson = Infer<typeof ConfigLocalJsonStruct>;
