import { getPortfolioGlobals } from '$lib/server';
import { isRequestAuthorized } from '$lib/server/auth.js';
import blankConfig from '$lib/blankConfig.js';
import type { ConfigJson } from '$lib/server/data/config.js';
import { version } from '$app/environment';
import { VERSION as SVELTE_VERSION } from 'svelte/compiler';
import { VERSION as SVELTEKIT_VERSION } from '@sveltejs/kit';
import { version as VITE_VERSION } from 'vite';
import os from 'os';

export async function load(req) {
  // If config fails to load (eg firstrun), just give a blank config
  let config: ConfigJson;
  let isInit = true;
  try {
    const globals = await getPortfolioGlobals();
    config = globals.config;
  } catch {
    isInit = false;
    config = blankConfig;
  }

  const loggedIn = isInit ? await isRequestAuthorized(req) : undefined;

  let versions = null;
  if (!isInit || loggedIn) {
    versions = {
      site: version,
      node: process.version,
      svelte: SVELTE_VERSION,
      sveltekit: SVELTEKIT_VERSION,
      vite: VITE_VERSION,
      os: `${os.platform()} ${os.release()}`
    };
  }

  return {
    config,
    loggedIn,
    versions,
  };
}
