# Tests

Basic test cases to validate that the site is working correctly.

## How I got this all working

It was really painful. Here's some sites I referred to whilst fighting to get
Jest, TypeScript and Svelte working nicely together:

* [GitHub: ts-jest | [Bug]: verbatimModuleSyntax support](https://github.com/kulshekhar/ts-jest/issues/4081#issuecomment-1515758013)
* [Koen Van Geert: Setting up Jest with SvelteKit](https://koenvg.medium.com/setting-up-jest-with-sveltekit-4f0a0e379668#3f2e)
* [Paweł Mucha: SvelteKit Jest setup](https://github.com/pmucha/sveltekit-jest-setup)

I still don't know if component testing works, but at the very least my config
lets me:

* Run Jest with TypeScript
* Import using Svelte's import aliases (eg `$lib`)

Things that don't seem to work:

* Sending requests to a running server using `fetch` (I'm using
  [`sync-request-curl`](https://github.com/nktnet1/sync-request-curl) instead
  because installing it was easier than figuring out what the issue was)

* Probably other things too - let me know :3
