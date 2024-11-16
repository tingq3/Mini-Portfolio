/**
 * Sets up Jest Extended to work with Vitest
 *
 * https://jest-extended.jestcommunity.dev/docs/getting-started/setup#use-with-vitest
 */

// Need to use interfaces, as they don't register the extended type definitions
// otherwise.
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type CustomMatchers from 'jest-extended';
import 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> { }
  interface AsymmetricMatchersContaining<T = any> extends CustomMatchers<T> { }
  interface ExpectStatic<T = any> extends CustomMatchers<T> { }
}
