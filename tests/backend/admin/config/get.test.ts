/**
 * Test cases for GET /api/admin/config
 *
 * Returns the current site configuration.
 */
import { type ApiClient } from '$endpoints';
import { beforeEach, expect, it } from 'vitest';
import { setup } from '../../helpers';
import { version } from '$app/environment';

let api: ApiClient;

beforeEach(async () => {
  api = (await setup()).api;
});

it('Returns the current config contents', async () => {
  await expect(api.admin.config.get()).resolves.toStrictEqual({
    siteName: 'My portfolio',
    siteShortName: expect.any(String),
    siteDescription: expect.any(String),
    // Annoying that I can't specifically expect a string[]
    siteKeywords: expect.toBeArray(),
    siteIcon: null,
    listedGroups: [],
    color: expect.any(String),
    version,
  });
});

it('Errors if given an invalid token', async () => {
  await expect(api.withToken('invalid').admin.config.get())
    .rejects.toMatchObject({ code: 401 });
});

it("Errors if the data isn't set up", async () => {
  await api.debug.clear();
  await expect(api.admin.config.get())
    .rejects.toMatchObject({ code: 400 });
});
