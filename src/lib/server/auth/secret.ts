/**
 * Code for managing the authentication secret.
 */
import fs from 'fs/promises';
import { getPrivateDataDir } from '../data/dataDir';
import { nanoid } from 'nanoid';

/** Returns the path to the auth secret file */
export function getAuthSecretPath(): string {
  return `${getPrivateDataDir()}/auth.secret`;
}

/** Cache for token secret */
let authSecret: string | undefined;

/** Returns the secret value used to validate JWTs */
export async function getAuthSecret(): Promise<string> {
  if (authSecret) {
    return authSecret;
  }
  return fs.readFile(getAuthSecretPath(), { encoding: 'utf-8' });
}

/** Generate and store a new auth secret, returning its value */
export async function generateAuthSecret(): Promise<string> {
  const secret = nanoid();
  authSecret = secret;
  await fs.writeFile(getAuthSecretPath(), secret, { encoding: 'utf-8' });
  return secret;
}

/**
 * Destroy the auth secret, removing it from memory and from the file system.
 */
export async function destroyAuthSecret() {
  authSecret = undefined;
  await fs.unlink(getAuthSecretPath());
}
