
import { it, beforeEach, expect } from 'vitest';
import { makeGroup, setup } from '../helpers';
import api from '$endpoints';

let token: string;
const group = 'my-group';

beforeEach(async () => {
  token = (await setup()).token;
  await makeGroup(token, group);
});

it('Removes existing groups', async () => {
  await expect(api.group.withId(group).remove(token)).resolves.toStrictEqual({});
  // Group is removed
  await expect(api.group.withId(group).info.get()).rejects.toMatchObject({ code: 404 });
});

it("Gives an error if the group doesn't exist", async () => {
  await expect(api.group.withId('invalid').remove(token))
    .rejects.toMatchObject({ code: 404 });
});

it('Gives an error for invalid tokens', async () => {
  await expect(api.group.withId(group).remove('invalid'))
    .rejects.toMatchObject({ code: 401 });
});

it("Gives an error if the server isn't initialized", async () => {
  await api.debug.clear();
  await expect(api.group.withId(group).remove(token))
    .rejects.toMatchObject({ code: 400 });
});
