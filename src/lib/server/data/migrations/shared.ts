/**
 * Shared helper functions for common data migration actions.
 */
import { dev } from '$app/environment';
import fs from 'fs/promises';

/** Move config.local.json to the private data directory */
export async function moveLocalConfig(dataDir: string, privateDataDir: string) {
  const originalPath = `${dataDir}/config.local.json`;
  const newPath = `${privateDataDir}/config.local.json`;
  await fs.rename(originalPath, newPath);
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
