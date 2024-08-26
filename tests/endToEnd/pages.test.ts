/** Test cases to ensure pages load correctly */

import { beforeEach, expect, test } from 'vitest';
import endpoints from './endpoints';
import api from '$endpoints';
import { setup } from '../backend/helpers';

let token: string;

beforeEach(async () => {
  const res = await setup();
  token = res.token;
});

test('Homepage loads', async () => {
  await expect(endpoints.root()).resolves.toStrictEqual(expect.any(String));
});

test('Group page loads', async () => {
  await api.group.withId('my-group').create(token, 'My group', 'My group');
  await expect(endpoints.group('my-group')).resolves.toStrictEqual(expect.any(String));
});

test('Item page loads', async () => {
  await api.group.withId('my-group').create(token, 'My group', 'My group');
  await api.group.withId('my-group').item.withId('my-item').create(token, 'My item', 'My item');
  await expect(endpoints.item('my-group', 'my-item')).resolves.toStrictEqual(expect.any(String));
});
