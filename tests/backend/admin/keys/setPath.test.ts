/**
 * Test cases for setting the path to the SSH key-pair.
 */
import fs from 'fs/promises';
import path from 'path';
import api, { type ApiClient } from "$endpoints";
import { beforeEach, describe, expect, it } from "vitest";
import { setup } from "../../helpers";
import genTokenTests from "../../tokenCase";
import { getPrivateDataDir } from '$lib/server/data/dataDir';

const DUMMY_PUBLIC_KEY = 'DUMMY PUBLIC KEY';
const DUMMY_PRIVATE_KEY = 'DUMMY PRIVATE KEY';

/**
 * Generate a dummy key pair to use
 */
async function generateDummyKeypair(): Promise<[string, string]> {
  const privateData = getPrivateDataDir();
  const privateKeyFile = path.join(privateData, 'keys', 'dummyKey');
  const publicKeyFile = privateKeyFile + '.pub';
  await fs.mkdir(path.join(privateData, 'keys'), { recursive: true });
  await fs.writeFile(privateKeyFile, DUMMY_PRIVATE_KEY);
  await fs.writeFile(publicKeyFile, DUMMY_PUBLIC_KEY);

  return [privateKeyFile, publicKeyFile];
}

it('Allows users to set an explicit path to an SSH key-pair', async () => {
  const { api } = await setup();
  const [privateKeyFile] = await generateDummyKeypair();
  await expect(api.admin.keys.setKeyPath(privateKeyFile))
    .resolves.toStrictEqual({
      keyPath: privateKeyFile,
      publicKey: DUMMY_PUBLIC_KEY,
    });
});

// Fails due to current setup process being single-step
it("Doesn't require a token when the server hasn't been set up", { fails: true }, async () => {
  const [privateKeyFile] = await generateDummyKeypair();
  await expect(api().admin.keys.setKeyPath(privateKeyFile))
    .toResolve();
});

it('Rejects SSH key-pair paths where the private key file does not exist', async () => {
  const { api } = await setup();
  const [privateKeyFile] = await generateDummyKeypair();
  await fs.unlink(privateKeyFile);
  await expect(api.admin.keys.setKeyPath(privateKeyFile))
    .rejects.toMatchObject({ code: 400 });
});

it('Rejects SSH key-pair paths where the public key file does not exist', async () => {
  const { api } = await setup();
  const [privateKeyFile, publicKeyFile] = await generateDummyKeypair();
  await fs.unlink(publicKeyFile);
  await expect(api.admin.keys.setKeyPath(privateKeyFile))
    .rejects.toMatchObject({ code: 400 });
});

describe('Token tests', () => {
  let api: ApiClient;
  beforeEach(async () => {
    api = (await setup()).api;
  });

  genTokenTests(
    () => api,
    api => api.admin.keys.get(),
  );
});
