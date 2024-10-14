/**
 * Test cases for public key requests
 */

import api, { type ApiClient } from "$endpoints";
import { beforeEach, describe, expect, test } from "vitest";
import { setup } from "../../helpers";
import genTokenTests from "../../tokenCase";


/**
 * These first two tests fail due to the config.local.json not being generated
 * until first-run.
 *
 * TODO: Fix this when splitting the setup process into stages.
 */

test('Public key is `null` before it is generated', { fails: true }, async () => {
  await expect(api().admin.keys.get())
    .resolves.toStrictEqual({ publicKey: null });
});


test('Public key can be requested without token when server is not set up', { fails: true }, async () => {
  await api().admin.keys.generate();
  await expect(api().admin.keys.get())
    .resolves.toStrictEqual({ publicKey: expect.any(String), keyPath: expect.any(String) });
});

test('Public key can be requested with token when server is set up', async () => {
  const { api } = await setup();
  await api.admin.keys.generate();
  await expect(api.admin.keys.get())
    .resolves.toStrictEqual({ publicKey: expect.any(String), keyPath: expect.any(String) });
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
