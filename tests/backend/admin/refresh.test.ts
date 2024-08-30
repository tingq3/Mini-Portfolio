/** Test suite for POST /api/admin/refresh */

import { beforeEach, expect, it } from 'vitest';
import { setup } from '../helpers';
import { getConfig, setConfig } from '$lib/server/data/config';
import type { ApiClient } from '$endpoints';
import genTokenTests from '../tokenCase';

let api: ApiClient;

beforeEach(async () => {
  api = (await setup()).api;
});

it('Reloads data from the file system', async () => {
  // Manually modify the config data
  const config = await getConfig();
  config.siteName = 'New name';
  await setConfig(config);
  // After we refresh the data, the new site name is shown
  await expect(api.admin.data.refresh()).resolves.toStrictEqual({});
  await expect(api.admin.config.get()).resolves.toMatchObject({ siteName: 'New name' });
});

genTokenTests(
  () => api,
  api => api.admin.data.refresh(),
);
