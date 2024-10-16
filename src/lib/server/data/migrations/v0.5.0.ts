/**
 * Migrate to v0.6.0
 *
 * Primary changes:
 *
 * * Move `config.local.json` to the new private data directory.
 * * Re-structure user auth info to support multiple users in the future
 */

import { nanoid } from 'nanoid';
import { moveLocalConfig, updateConfigVersions } from './shared';
import { unsafeLoadLocalConfig } from './unsafeLoad';
import { setLocalConfig } from '../localConfig';
import { authIsSetUp } from '../dataDir';
import semver from 'semver';

export default async function migrate(dataDir: string, privateDataDir: string) {
  await moveLocalConfig(dataDir, privateDataDir);
  if (await authIsSetUp()) {
    await updateLocalConfig(privateDataDir);
  }
  await updateConfigVersions();
}

async function updateLocalConfig(privateDataDir: string) {
  // Too lazy to make this type-safe
  const config = await unsafeLoadLocalConfig(privateDataDir) as any;

  // If local config version is already v0.6.0 or greater, do nothing
  if (semver.gte(config.version, 'v0.6.0')) {
    return;
  }

  config.keyPath = null;

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
