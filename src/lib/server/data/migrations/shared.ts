/**
 * Shared helper functions for common data migration actions.
 */
import { dev, version } from '$app/environment';
import fs from 'fs/promises';
import { getConfig, setConfig } from '../config';
import { getLocalConfig, setLocalConfig } from '../localConfig';
import { serverIsSetUp } from '../dataDir';

/** Update config versions (only for minor, non-breaking changes to config.json) */
export async function updateConfigVersions() {
  const config = await getConfig();
  config.version = version;
  await setConfig(config);
  // Only migrate local config if it is created
  if (await serverIsSetUp()) {
    const configLocal = await getLocalConfig();
    configLocal.version = version;
    await setLocalConfig(configLocal);
  }
}

/** Move config.local.json to the private data directory */
export async function moveLocalConfig(dataDir: string, privateDataDir: string) {
  const originalPath = `${dataDir}/config.local.json`;
  const newPath = `${privateDataDir}/config.local.json`;
  // Discard error (file not found), which occurs when cloning a new repo,
  // since the auth info isn't set up yet
  await fs.rename(originalPath, newPath).catch(() => { });
}

/** Write auth secret from environment variable */
export async function writeAuthSecret(privateDataDir: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable must be set to a value');
  }
  if (!dev && secret === 'CHANGE ME') {
    throw new Error('AUTH_SECRET must be changed when running in production');
  }
  await fs.writeFile(`${privateDataDir}/auth.secret`, secret, { encoding: 'utf-8' });
}
