/** Test cases for POST /api/debug/echo */
import { it, expect } from 'vitest';
import api from '$api';

it('echoes the value', async () => {
  expect(api.debug.echo('Hello world!'))
    .resolves.toStrictEqual({ text: 'Hello world!' });
});
