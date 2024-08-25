import { beforeEach, describe, expect, it } from 'vitest';
import { makeGroup, makeItem, setup } from '../../helpers';
import api from '$endpoints';

let token: string;
let groupId: string;
let itemId: string;
let otherItemId: string;

beforeEach(async () => {
  token = (await setup()).token;
  groupId = 'group-id';
  itemId = 'item-id';
  otherItemId = 'other-item-id';
  await makeGroup(token, groupId);
  await makeItem(token, groupId, itemId);
  await makeItem(token, groupId, otherItemId);
});

describe('Create link', () => {
  it('Creates links between items', async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).link(token, groupId, otherItemId))
      .resolves.toStrictEqual({});
    // Check side effect
    await expect(api.group.withId(groupId).item.withId(itemId).info.get())
      .resolves.toMatchObject({
        // By default link style is chips
        chipLinks: [
          [groupId, [otherItemId]],
        ],
      });
  });

  it('Creates the reverse link', async () => {
    await api.group.withId(groupId).item.withId(itemId).link(token, groupId, otherItemId);
    await expect(api.group.withId(groupId).item.withId(otherItemId).info.get())
      .resolves.toMatchObject({
        chipLinks: [
          [groupId, [itemId]],
        ],
      });
  });

  it('Does nothing if the link already exists', async () => {
    await api.group.withId(groupId).item.withId(itemId).link(token, groupId, otherItemId);
    await expect(api.group.withId(groupId).item.withId(itemId).link(token, groupId, otherItemId))
      .resolves.toStrictEqual({});
    // Other item should only appear once
    await expect(api.group.withId(groupId).item.withId(itemId).info.get())
      .resolves.toMatchObject({
        chipLinks: [
          [groupId, [otherItemId]],
        ],
      });
  });

  it("Errors if the target group doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).link(token, 'invalid-group', otherItemId))
      .rejects.toMatchObject({ code: 400 });
  });

  it("Errors if the target item doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).link(token, groupId, 'invalid-item'))
      .rejects.toMatchObject({ code: 400 });
  });

  it("Errors if the source group doesn't exist", async () => {
    await expect(api.group.withId('invalid-group').item.withId(itemId).link(token, groupId, otherItemId))
      .rejects.toMatchObject({ code: 404 });
  });

  it("Errors if the source item doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId('invalid-item').link(token, groupId, otherItemId))
      .rejects.toMatchObject({ code: 404 });
  });

  it('Rejects invalid tokens', async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).link('invalid-token', groupId, otherItemId))
      .rejects.toMatchObject({ code: 401 });
  });

  it.todo('Uses a card link if the link style for that group is cards');
});

describe('Remove link', () => {
  beforeEach(async () => {
    // Create the link
    await api.group.withId(groupId).item.withId(itemId).link(token, groupId, otherItemId);
  });

  it('Removes links between items', async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).unlink(token, groupId, otherItemId))
      .resolves.toStrictEqual({});
    // Check side effect
    await expect(api.group.withId(groupId).item.withId(itemId).info.get())
      .resolves.toMatchObject({
        chipLinks: [],
      });
  });

  it('Removes the reverse link', async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).unlink(token, groupId, otherItemId))
      .resolves.toStrictEqual({});
    await expect(api.group.withId(groupId).item.withId(otherItemId).info.get())
      .resolves.toMatchObject({
        chipLinks: [],
      });
  });

  it('Leaves the group entry if there are multiple links present', async () => {
    const yetAnotherItemId = 'yet-another-item';
    await makeItem(token, groupId, yetAnotherItemId);
    await api.group.withId(groupId).item.withId(itemId).link(token, groupId, yetAnotherItemId);
    await expect(api.group.withId(groupId).item.withId(itemId).unlink(token, groupId, otherItemId))
      .resolves.toStrictEqual({});
    await expect(api.group.withId(groupId).item.withId(itemId).info.get())
      .resolves.toMatchObject({
        chipLinks: [
          [groupId, [yetAnotherItemId]],
        ],
      });
  });

  it("Does nothing if the link doesn't exist", async () => {
    await api.group.withId(groupId).item.withId(itemId).unlink(token, groupId, otherItemId);
    await expect(api.group.withId(groupId).item.withId(itemId).unlink(token, groupId, otherItemId))
      .resolves.toStrictEqual({});
  });

  it("Errors if the target group doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).unlink(token, 'invalid-group', otherItemId))
      .rejects.toMatchObject({ code: 400 });
  });

  it("Errors if the target item doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).unlink(token, groupId, 'invalid-item'))
      .rejects.toMatchObject({ code: 400 });
  });

  it("Errors if the source group doesn't exist", async () => {
    await expect(api.group.withId('invalid-group').item.withId(itemId).unlink(token, groupId, otherItemId))
      .rejects.toMatchObject({ code: 404 });
  });

  it("Errors if the source item doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId('invalid-item').unlink(token, groupId, otherItemId))
      .rejects.toMatchObject({ code: 404 });
  });

  it('Rejects invalid tokens', async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).unlink('invalid-token', groupId, otherItemId))
      .rejects.toMatchObject({ code: 401 });
  });

  // TODO: Test cases for when the link is uses a card instead of a chip
});
