/**
 * Migrate to v0.6.0
 *
 * Primary changes:
 *
 * * Move `config.local.json` to the new private data directory.
 * * Re-structure user auth info to support multiple users in the future
 * * Add more properties for banning IPs and user-agents
 */

import { nanoid } from 'nanoid';
import { moveLocalConfig } from './shared';
import { unsafeLoadLocalConfig } from './unsafeLoad';
import { setLocalConfig } from '../localConfig';
import { authIsSetUp } from '../dataDir';
import semver from 'semver';
import migrateV061 from './v0.6.1';

export default async function migrate(dataDir: string, privateDataDir: string) {
  await moveLocalConfig(dataDir, privateDataDir);
  if (await authIsSetUp()) {
    await updateLocalConfig(privateDataDir);
  }
  await migrateV061(dataDir, privateDataDir);
}

async function updateLocalConfig(privateDataDir: string) {
  // Too lazy to make this type-safe
  const config = await unsafeLoadLocalConfig(privateDataDir) as any;

  // If local config version is already v0.6.0 or greater, do nothing
  if (semver.gte(config.version, 'v0.6.0')) {
    return;
  }

  // Add IP/user-agent ban fields
  config.enableFail2ban = true;
  config.loginBannedIps = {};
  config.bannedIps = [];
  config.bannedUserAgents = [];

  // Add SSH key path field
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
