/** Code for managing the server's SSH keys */
import fs from 'fs/promises';
import { getPrivateDataDir } from './data/dataDir';
import { spawn } from 'child-process-promise';
import { APP_NAME } from '$lib/consts';
import { getLocalConfig, setLocalConfig } from './data/localConfig';

const DEFAULT_KEY_TYPE = 'ed25519';

const defaultPrivateKeyFile = () => `${getPrivateDataDir()}/id_${DEFAULT_KEY_TYPE}`;

const publicKeyFile = (privateKeyFile: string) => `${privateKeyFile}.pub`;

let publicKey: string | undefined;

/** Returns the server's SSH public key */
export async function getPublicKey(): Promise<string | null> {
  if (publicKey) {
    return publicKey;
  }

  // Determine public key location
  const keyPath = await getLocalConfig().then(c => c.keyFile);

  if (!keyPath) {
    return null;
  }

  // Read the key from the disk
  const key = await fs.readFile(publicKeyFile(keyPath), { encoding: 'utf-8' })
    .then(k => k.trim());
  publicKey = key;
  return key;
}

/**
 * Set the path to the program's SSH key file.
 */
export async function setKeyFile(keyFile: string) {
  publicKey = undefined;
  const cfg = await getLocalConfig();
  cfg.keyFile = keyFile;
  await setLocalConfig(cfg);
}

/** Disable the server's SSH authentication */
export async function disableKey() {
  publicKey = undefined;
  const cfg = await getLocalConfig();
  cfg.keyFile = null;
  await setLocalConfig(cfg);
}

/** Generate an SSH key pair for the server */
export async function generateKey(): Promise<string> {
  publicKey = undefined;
  // Remove keys from default location if they exist
  await fs.unlink(defaultPrivateKeyFile()).catch(() => { });
  await fs.unlink(publicKeyFile(defaultPrivateKeyFile())).catch(() => { });
  // Also need to create private data dir if it was removed
  await fs.mkdir(getPrivateDataDir()).catch(() => { });

  // Change configuration to use default SSH key location
  const cfg = await getLocalConfig();
  cfg.keyFile = defaultPrivateKeyFile();
  await setLocalConfig(cfg);

  // ssh-keygen -t $DEFAULT_KEY_TYPE -f ${defaultPrivateKeyFile()} -N '' -c "Minifolio SSH key"
  await spawn(
    'ssh-keygen',
    [
      '-t',
      DEFAULT_KEY_TYPE,
      '-f',
      defaultPrivateKeyFile(),
      '-N',
      '',
      '-C',
      `${APP_NAME} SSH key`,
    ],
    { capture: ['stdout', 'stderr'] }
  );
  // Public key is definitely not null now
  return getPublicKey() as Promise<string>;
}
