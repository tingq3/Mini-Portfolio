/** Shared test cases for creating groups and items */
import { beforeEach, describe, expect, it } from 'vitest';
import api from '$endpoints';
import { invalidIds, invalidNames, validIds, validNames } from '../consts';

/**
 * Generate shared test cases for creating data on the server.
 *
 * Note that there any global `beforeEach` in the test suite will also be
 * applied to this test suite, which you probably don't want.
 *
 * Additionally, this test case should be placed in its own `describe`, so
 * that its setup doesn't affect other test cases.
 *
 * @param typeName the name to use when generating the test cases (eg `"item"`
 * or `"group"`)
 * @param setup setup function to generate required data for the test cases to
 * run. This should initialise the server and create any required data (stored
 * in the caller's scope).
 * @param create function to create the group or item. It should make use of
 * the setup data from the caller's scope.
 */
export default function generateTestCases(
  typeName: string,
  setup: () => Promise<void>,
  create: (id: string, name: string, description: string) => Promise<void>,
) {
  beforeEach(async () => { await setup(); });

  describe(`${typeName} ID`, () => {
    // Invalid group IDs
    it.each(invalidIds)(`Rejects invalid ${typeName} IDs ($case)`, async ({ id }) => {
      await expect(create(id, 'Example', ''))
        .rejects.toMatchObject({ code: 400 });
    });

    // Valid group IDs
    it.each(validIds)(`Allows valid ${typeName} IDs ($case)'`, async ({ id }) => {
      await expect(create(id, `Example ${typeName}`, ''))
        .toResolve();
    });

    it(`Fails if a ${typeName} with a matching ID already exists`, async () => {
      await create('example', 'Example', '');
      // ID of this group matches
      await expect(create('example', 'Other example', ''))
        .rejects.toMatchObject({ code: 400 });
    });
  });

  describe(`${typeName} name`, () => {
    // Invalid group names
    it.each(invalidNames)(`Rejects invalid ${typeName} names ($case)`, async ({ name }) => {
      await expect(create('id', name, ''))
        .rejects.toMatchObject({ code: 400 });
    });

    // Valid group names
    it.each(validNames)(`Allows valid ${typeName} names ($case)`, async ({ name }) => {
      await expect(create('id', name, ''))
        .toResolve();
    });
  });

  it('Fails if the data is not set up', async () => {
    await api.debug.clear();
    await expect(create('id', 'Example', ''))
      .rejects.toMatchObject({ code: 400 });
  });
}
