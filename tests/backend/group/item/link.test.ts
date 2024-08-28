import { beforeEach, describe, expect, it } from 'vitest';
import { makeGroup, makeItem, setup } from '../../helpers';
import type { ApiClient } from '$endpoints';
import genTokenTests from '../../tokenCase';

let api: ApiClient;
let groupId: string;
let itemId: string;
let otherItemId: string;

beforeEach(async () => {
  api = (await setup()).api;
  groupId = 'group-id';
  itemId = 'item-id';
  otherItemId = 'other-item-id';
  await makeGroup(api, groupId);
  await makeItem(api, groupId, itemId);
  await makeItem(api, groupId, otherItemId);
});

describe('Create link', () => {
  it('Creates links between items', async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).links.create(groupId, otherItemId))
      .resolves.toStrictEqual({});
    // Check side effect
    await expect(api.group.withId(groupId).item.withId(itemId).info.get())
      .resolves.toMatchObject({
        // By default link style is chips
        links: [
          [{ groupId, style: 'chip' }, [otherItemId]],
        ],
      });
  });

  it('Creates the reverse link', async () => {
    await api.group.withId(groupId).item.withId(itemId).links.create(groupId, otherItemId);
    await expect(api.group.withId(groupId).item.withId(otherItemId).info.get())
      .resolves.toMatchObject({
        links: [
          [{ groupId, style: 'chip' }, [itemId]],
        ],
      });
  });

  it('Does nothing if the link already exists', async () => {
    await api.group.withId(groupId).item.withId(itemId).links.create(groupId, otherItemId);
    await expect(api.group.withId(groupId).item.withId(itemId).links.create(groupId, otherItemId))
      .resolves.toStrictEqual({});
    // Other item should only appear once
    await expect(api.group.withId(groupId).item.withId(itemId).info.get())
      .resolves.toMatchObject({
        links: [
          [{ groupId, style: 'chip' }, [otherItemId]],
        ],
      });
  });

  it('Keeps links to items in the same group in the same section', async () => {
    await api.group.withId(groupId).item.withId(itemId).links.create(groupId, otherItemId);
    const yetAnotherItemId = 'yet-another-item';
    await makeItem(api, groupId, yetAnotherItemId);
    await expect(api.group.withId(groupId).item.withId(itemId).links.create(groupId, yetAnotherItemId))
      .resolves.toStrictEqual({});
    // Check data is stored correctly
    await expect(api.group.withId(groupId).item.withId(itemId).info.get())
      .resolves.toMatchObject({
        links: [
          [{ groupId, style: 'chip' }, [otherItemId, yetAnotherItemId]],
        ],
      });
  });

  it('Rejects links to self', async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).links.create(groupId, itemId))
      .rejects.toMatchObject({ code: 400 });
  });

  it("Errors if the target group doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).links.create('invalid-group', otherItemId))
      .rejects.toMatchObject({ code: 400 });
  });

  it("Errors if the target item doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).links.create(groupId, 'invalid-item'))
      .rejects.toMatchObject({ code: 400 });
  });

  it("Errors if the source group doesn't exist", async () => {
    await expect(api.group.withId('invalid-group').item.withId(itemId).links.create(groupId, otherItemId))
      .rejects.toMatchObject({ code: 404 });
  });

  it("Errors if the source item doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId('invalid-item').links.create(groupId, otherItemId))
      .rejects.toMatchObject({ code: 404 });
  });

  genTokenTests(
    () => api,
    api => api.group.withId(groupId).item.withId(itemId).links.create(groupId, otherItemId),
  );

  it('Respects existing display style preference for group', async () => {
    await api.group.withId(groupId).item.withId(itemId).links.create(groupId, otherItemId);
    // Update link style
    await api.group.withId(groupId).item.withId(itemId).links.style(groupId, 'card');
    // Create a link to another item
    const yetAnotherItemId = 'yet-another-item';
    await makeItem(api, groupId, yetAnotherItemId);
    await api.group.withId(groupId).item.withId(itemId).links.create(groupId, yetAnotherItemId);
    await expect(api.group.withId(groupId).item.withId(itemId).info.get())
      .resolves.toMatchObject({
        links: [
          [{ groupId, style: 'card' }, [otherItemId, yetAnotherItemId]],
        ],
      });
  });
});

describe('Update link style', () => {
  beforeEach(async () => {
    // Create the link
    await api.group.withId(groupId).item.withId(itemId).links.create(groupId, otherItemId);
  });

  it('Allows link display style to be updated', async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).links.style(groupId, 'card'))
      .resolves.toStrictEqual({});
    // Style got updated
    await expect(api.group.withId(groupId).item.withId(itemId).info.get())
      .resolves.toMatchObject({
        links: [
          [{ groupId, style: 'card' }, [otherItemId]],
        ],
      });
  });

  it('Rejects invalid style names', async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).links.style(
      groupId,
      // Deliberate type safety awfulness -- we intentionally want to send an
      // invalid request despite TypeScript's best efforts
      'invalid-style' as string as 'card',
    ))
      .rejects.toMatchObject({ code: 400 });
  });

  it("Errors if the target group doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).links.style('invalid-group', 'card'))
      .rejects.toMatchObject({ code: 400 });
  });

  it("Errors if the target group hasn't been linked to exist", async () => {
    const otherGroupId = 'other-group-id';
    await makeGroup(api, otherGroupId);
    await expect(api.group.withId(groupId).item.withId(itemId).links.style(otherGroupId, 'card'))
      .rejects.toMatchObject({ code: 400 });
  });

  it('Rejects invalid tokens', async () => {
    await expect(api.withToken('invalid').group.withId(groupId).item.withId(itemId).links.style(groupId, 'card'))
      .rejects.toMatchObject({ code: 401 });
  });
});

describe('Remove link', () => {
  beforeEach(async () => {
    // Create the link
    await api.group.withId(groupId).item.withId(itemId).links.create(groupId, otherItemId);
  });

  it('Removes links between items', async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).links.remove(groupId, otherItemId))
      .resolves.toStrictEqual({});
    // Check side effect
    await expect(api.group.withId(groupId).item.withId(itemId).info.get())
      .resolves.toMatchObject({
        links: [],
      });
  });

  it('Removes the reverse link', async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).links.remove(groupId, otherItemId))
      .resolves.toStrictEqual({});
    await expect(api.group.withId(groupId).item.withId(otherItemId).info.get())
      .resolves.toMatchObject({
        links: [],
      });
  });

  it('Leaves the group entry if there are multiple links present', async () => {
    const yetAnotherItemId = 'yet-another-item';
    await makeItem(api, groupId, yetAnotherItemId);
    await api.group.withId(groupId).item.withId(itemId).links.create(groupId, yetAnotherItemId);
    await expect(api.group.withId(groupId).item.withId(itemId).links.remove(groupId, otherItemId))
      .resolves.toStrictEqual({});
    await expect(api.group.withId(groupId).item.withId(itemId).info.get())
      .resolves.toMatchObject({
        links: [
          [{ groupId, style: 'chip' }, [yetAnotherItemId]],
        ],
      });
  });

  it("Does nothing if the link doesn't exist", async () => {
    await api.group.withId(groupId).item.withId(itemId).links.remove(groupId, otherItemId);
    await expect(api.group.withId(groupId).item.withId(itemId).links.remove(groupId, otherItemId))
      .resolves.toStrictEqual({});
  });

  it("Errors if the target group doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).links.remove('invalid-group', otherItemId))
      .rejects.toMatchObject({ code: 400 });
  });

  it("Errors if the target item doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).links.remove(groupId, 'invalid-item'))
      .rejects.toMatchObject({ code: 400 });
  });

  it("Errors if the source group doesn't exist", async () => {
    await expect(api.group.withId('invalid-group').item.withId(itemId).links.remove(groupId, otherItemId))
      .rejects.toMatchObject({ code: 404 });
  });

  it("Errors if the source item doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId('invalid-item').links.remove(groupId, otherItemId))
      .rejects.toMatchObject({ code: 404 });
  });

  it('Rejects invalid tokens', async () => {
    await expect(api.withToken('invalid').group.withId(groupId).item.withId(itemId).links.remove(groupId, otherItemId))
      .rejects.toMatchObject({ code: 401 });
  });
});
