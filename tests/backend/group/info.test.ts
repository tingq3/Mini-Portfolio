import api from '$endpoints';
import { beforeEach, expect, it, describe } from 'vitest';
import { createCustomGroupProperties, makeGroup, setup } from '../helpers';
import { invalidNames, validNames } from '../consts';

let token: string;
let groupId: string;

beforeEach(async () => {
  token = (await setup()).token;
  groupId = 'group';
  await makeGroup(token, groupId);
});

it('Gives an error if the server is not set up', async () => {
  await api.debug.clear();
  await expect(api.group.withId(groupId).info.get())
    .rejects.toMatchObject({ code: 400 });
  await expect(api.group.withId(groupId).info.set(token, createCustomGroupProperties()))
    .rejects.toMatchObject({ code: 400 });
});

it('Gives an error for invalid tokens', async () => {
  await expect(api.group.withId(groupId).info.set('invalid', createCustomGroupProperties()))
    .rejects.toMatchObject({ code: 401 });
});

describe("Gives an error if the group doesn't exist", () => {
  it('Get info', async () => {
    await expect(api.group.withId('invalid').info.get())
      .rejects.toMatchObject({ code: 404 });
  });

  it('Set info', async () => {
    await expect(api.group.withId('invalid').info.set(token, createCustomGroupProperties()))
      .rejects.toMatchObject({ code: 404 });
  });
});

it('Successfully updates the group info', async () => {
  await expect(api.group.withId(groupId).info.set(token, createCustomGroupProperties()))
    .toResolve();
  await expect(api.group.withId(groupId).info.get())
    .resolves.toStrictEqual(createCustomGroupProperties());
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
