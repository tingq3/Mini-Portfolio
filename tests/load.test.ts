/**
 * load.test.ts
 *
 * Tests to ensure that pages can be loaded without issue.
 */
import { getProjectSlugs } from "$lib/server/project";
import { getLanguageSlugs } from "$lib/server/language";


const BASE_URL = 'http://localhost:5173';


async function checkPageForError(path: string) {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  const res = await fetch(`${BASE_URL}/${path}`);

  if (res.status >= 400) {
    throw new Error(`GET /${path} got unexpected status ${res.status}`);
  }
}

// Main page

test('load main page', async () => {
  expect(checkPageForError('/')).resolves.toBeUndefined();
});

test('load languages page', async () => {
  expect(checkPageForError('/language')).resolves.toBeUndefined();
});

// Generated pages

describe('load project pages', async () => {
  test.each(
    getProjectSlugs()
  )('load project page %s', async (slug: string) => {
    await expect(checkPageForError(`projects/${slug}`)).resolves.toBeUndefined();
  });
});

describe('load language pages', async () => {
  test.each(
    getLanguageSlugs()
  )('load language page %s', async (slug: string) => {
    await expect(checkPageForError(`languages/${slug}`)).resolves.toBeUndefined();
  });
});
