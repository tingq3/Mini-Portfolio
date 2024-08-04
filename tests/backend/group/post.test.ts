
import { beforeEach, describe, expect, it, test } from 'vitest';
import { setup } from '../helpers';
import api from '$endpoints';
import type { GroupInfoBrief } from '$lib/server/data/group';

let token: string;

beforeEach(async () => {
  token = (await setup()).token;
});

describe('Sets up basic group properties', async () => {
  let slug: string;
  let info: GroupInfoBrief;
  beforeEach(async () => {
    slug = (await api.group.create(token, 'My group')).slug;
    info = await api.group.info(slug);
  });

  test('Slug is name in lower-case, with spaces replaced by dashes', () => {
    expect(slug).toStrictEqual('my-group');
  });

  test('Description is empty', () => {
    expect(info.description).toStrictEqual('');
  });

  test('Name matches the name we gave', () => {
    expect(info.name).toStrictEqual('My group');
  });

  it('Chooses a random color for the group', () => {
    expect(info.color).toSatisfy((s: string) => /\#[0-9a-f]{6}/.test(s))
  });

  it('Sets up a simple README', async () => {
    await expect(api.group.getReadme(slug))
      .resolves.toStrictEqual({ readme: expect.any(String) });
  });
});

it('Fails if a group with a matching slug already exists', async () => {
  await api.group.create(token, 'My group');
  // Slug should match
  await expect(api.group.create(token, 'MY GROUP'))
    .rejects.toMatchObject({ code: 400 });
});

it('Fails if the group name is empty', async () => {
  await expect(api.group.create(token, '')).rejects.toMatchObject({ code: 400 });
});

it('Fails for invalid tokens', async () => {
  await expect(api.group.create('invalid token', 'My group'))
    .rejects.toMatchObject({ code: 401 });
});

it('Fails if the data is not set up', async () => {
  await api.debug.clear();
  await expect(api.group.create(token, 'My group'))
    .rejects.toMatchObject({ code: 400 });
});
