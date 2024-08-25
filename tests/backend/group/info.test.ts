/**
 * Tests for getting and setting the info of groups.
 *
 * These are very similar to those for get/setting the info of items, but the
 * code to generate test cases for both in one go was more complex than it was
 * worth, so I decided to keep the duplicate code.
 */
import api from '$endpoints';
import { beforeEach, expect, it, describe } from 'vitest';
import { createCustomGroupProperties, makeGroup, setup } from '../helpers';
import { invalidNames, validNames } from '../consts';

let token: string;
let groupId: string;

beforeEach(async () => {
  token = (await setup()).token;
  groupId = 'group-id';
  await makeGroup(token, groupId);
});

it.each([
  { name: 'Get info', fn: () => api.group.withId(groupId).info.get() },
  { name: 'Set info', fn: () => api.group.withId(groupId).info.set(token, createCustomGroupProperties()) },
])('Gives an error if the server is not set up', async ({ fn }) => {
  await api.debug.clear();
  await expect(fn())
    .rejects.toMatchObject({ code: 400 });
});

it('Gives an error for invalid tokens', async () => {
  await expect(api.group.withId(groupId).info.set('invalid', createCustomGroupProperties()))
    .rejects.toMatchObject({ code: 401 });
});

it.each([
  { name: 'Get info', fn: (id: string) => api.group.withId(id).info.get() },
  { name: 'Set info', fn: (id: string) => api.group.withId(id).info.set(token, createCustomGroupProperties()) },
])("Gives an error if the group doesn't exist ($name)", async ({ fn }) => {
  await expect(fn('invalid'))
    .rejects.toMatchObject({ code: 404 });
});

it('Gives an error if the "listedItems" field contains invalid item IDs', async () => {
  await expect(api.group.withId(groupId).info.set(token, createCustomGroupProperties({ listedItems: ['invalid-item'] })))
    .rejects.toMatchObject({ code: 400 });
});

it('Successfully updates the group info', async () => {
  const newInfo = createCustomGroupProperties({ name: 'New name' });
  await expect(api.group.withId(groupId).info.set(token, newInfo))
    .toResolve();
  await expect(api.group.withId(groupId).info.get())
    .resolves.toStrictEqual(newInfo);
});

describe('Group name', () => {
  // Invalid group names
  it.each(invalidNames)('Rejects invalid group names ($case)', async ({ name }) => {
    await expect(api.group.withId(groupId).info.set(token, createCustomGroupProperties({ name })))
      .rejects.toMatchObject({ code: 400 });
  });

  // Valid group names
  it.each(validNames)('Allows valid group names ($case)', async ({ name }) => {
    await expect(api.group.withId(groupId).info.set(token, createCustomGroupProperties({ name })))
      .toResolve();
  });
});
