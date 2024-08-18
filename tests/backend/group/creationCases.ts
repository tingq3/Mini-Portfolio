/** Shared test cases for creating groups and items */
import { beforeEach, describe, expect, it } from 'vitest';
import api from '$endpoints';
import { invalidIds, invalidNames, validIds, validNames } from '../consts';

/**
 * Generate shared test cases for creating data on the server.
 *
 * Note that there any global `beforeEach` in the test suite will also be
 * applied to this test suite.
 *
 * @param typeName the name to use when generating the test cases (eg `"item"`
 * or `"group"`)
 * @param setup setup function to generate required data for the test cases to
 * run. This should initialise the server and create any required data. It
 * should return this data in a format that the `create` function accepts.
 * @param create function to create the group or item. It should accept the
 * data returned by the `setup` function.
 */
export default function generateTestCases<T>(
  typeName: string,
  setup: () => Promise<T>,
  create: (data: T, id: string, name: string, description: string) => Promise<void>,
) {
  describe('Generated test cases', () => {
    let setupData: T;

    beforeEach(async () => {
      setupData = await setup();
    });

    describe(`${typeName} ID`, () => {
      // Invalid group IDs
      it.each(invalidIds)(`Rejects invalid ${typeName} IDs ($case)`, async ({ id }) => {
        await expect(create(setupData, id, 'Example', ''))
          .rejects.toMatchObject({ code: 400 });
      });

      // Valid group IDs
      it.each(validIds)(`Allows valid ${typeName} IDs ($case)'`, async ({ id }) => {
        await expect(create(setupData, id, `Example ${typeName}`, ''))
          .toResolve();
      });

      it(`Fails if a ${typeName} with a matching ID already exists`, async () => {
        await create(setupData, 'example', 'Example', '');
        // ID of this group matches
        await expect(create(setupData, 'example', 'Other example', ''))
          .rejects.toMatchObject({ code: 400 });
      });
    });

    describe(`${typeName} name`, () => {
      // Invalid group names
      it.each(invalidNames)(`Rejects invalid ${typeName} names ($case)`, async ({ name }) => {
        await expect(create(setupData, 'id', name, ''))
          .rejects.toMatchObject({ code: 400 });
      });

      // Valid group names
      it.each(validNames)(`Allows valid ${typeName} names ($case)`, async ({ name }) => {
        await expect(create(setupData, 'id', name, ''))
          .toResolve();
      });
    });

    it('Fails for invalid tokens', async () => {
      await expect(api.group.withId('id').create('invalid token', 'My group', ''))
        .rejects.toMatchObject({ code: 401 });
    });

    it('Fails if the data is not set up', async () => {
      await api.debug.clear();
      await expect(create(setupData, 'id', 'Example', ''))
        .rejects.toMatchObject({ code: 400 });
    });
  });
}
