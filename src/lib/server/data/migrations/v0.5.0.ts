/**
 * Migrate to v0.6.0
 *
 * Primary changes:
 *
 * * Move `config.local.json` to the new private data directory.
 */

import { nanoid } from "nanoid";
import { moveLocalConfig, updateConfigVersions } from "./shared";
import { unsafeLoadLocalConfig } from "./unsafeLoad";
import { setLocalConfig } from "../localConfig";

export default async function migrate(dataDir: string, privateDataDir: string) {
  await moveLocalConfig(dataDir, privateDataDir);
  await updateLocalConfig(privateDataDir);
  await updateConfigVersions();
}

async function updateLocalConfig(privateDataDir: string) {
  // Too lazy to make this type-safe
  const config = await unsafeLoadLocalConfig(privateDataDir) as any;

  const userInfo = config.auth;

  if (userInfo === null) {
    // Auth disabled, register no users
    config.auth = null;
  } else {
    // Generate user ID
    const userId = nanoid();
    config.auth = {
      [userId]: userInfo
    };
  }
  await setLocalConfig(config);
}
