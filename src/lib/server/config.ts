import { create } from 'superstruct';
import fs from 'node:fs';
import { MainConfig } from '$types';

const BASE = 'data';

/**
 * Load main config file
 */
function loadMainConfig() {
  const config = fs.readFileSync(`${BASE}/config.json`);
  const lang = JSON.parse(config.toString());
  return create({
    ...lang,
    info: loadInfoReadme(),
  }, MainConfig);
}

/**
 * Load info.md
 */
function loadInfoReadme() {
  return fs.readFileSync(`${BASE}/info.md`).toString();
}

/**
 * Reload the data
 */
export function reloadMainConfig() {
  config = loadMainConfig();
}

// Set up data
// ==================================================

let config = loadMainConfig();

// Getter
// ==================================================

export function getMainConfig() {
  return config;
}
