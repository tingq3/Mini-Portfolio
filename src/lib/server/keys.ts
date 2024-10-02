/** Code for managing the server's SSH keys */
import fs from 'fs/promises';
import { getPrivateDataDir } from './data/dataDir';
import { spawn } from 'child-process-promise';
import { APP_NAME } from '$lib/consts';

const KEY_TYPE = 'ed25519';

const publicKeyFile = () => `${getPrivateDataDir()}/id_${KEY_TYPE}.pub`;
const privateKeyFile = () => `${getPrivateDataDir()}/id_${KEY_TYPE}`;

let publicKey: string | undefined;

/** Returns the server's SSH public key */
export async function getPublicKey(): Promise<string> {
  if (publicKey) {
    return publicKey;
  }
  publicKey = (await fs.readFile(publicKeyFile(), { encoding: 'utf-8' })).trim();
  return publicKey;
}

/** Regenerate the SSH key pair for the server */
export async function regenerateKey(): Promise<string> {
  publicKey = undefined;
  await fs.unlink(privateKeyFile());
  await fs.unlink(publicKeyFile());
  await spawn('ssh-keygen', [
    '-t',
    KEY_TYPE,
    '-f',
    privateKeyFile(),
    '-N',
    '',
    '-C',
    `${APP_NAME} SSH key`,
  ]);
  return getPublicKey();
}
