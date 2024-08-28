/**
 * Migration from v0.1.0 to v0.2.0
 *
 * Since this will likely only be used by me, it probably won't be all that
 * reliable.
 *
 * # Instructions
 *
 * 1. Ensure your data is backed up to a git repo
 * 2. Remove the data directory to reset the server
 * 3. Set up the server using the git repo URL
 * 4. Note the new auth information
 *
 * # Incompatible data
 *
 * Some data is lost in this migration (mainly because I couldn't be bothered
 * to implement anything more than the minimum).
 *
 * * `README.md` clobbered by `info.md`.
 * * Sorting and listing of items within groups. All items are listed.
 * * Ordering of links (formerly associations) in items. Old data format did
 *   not order them.
 * * Link style (can't be bothered to look up data in old format).
 * * Filter groups per group.
 */

import fs from 'fs/promises';
import { setConfig, type ConfigJson } from '../config';
import { listGroups, setGroupInfo } from '../group';
import type { RepoInfo } from '../itemRepo';
import type { PackageInfo } from '../itemPackage';
import { LinksArray, listItems, setItemInfo } from '../item';
import type { Infer } from 'superstruct';
import { version } from '$app/environment';
import { setupGitignore } from '../git';

export default async function migrate(dataDir: string) {
  console.log(`Begin data migration v0.1.0 -> ${version}`);
  await config(dataDir);
  await readme(dataDir);

  // For each group
  for (const groupId of await listGroups()) {
    // Migrate the group info
    await groupInfo(dataDir, groupId);
    // Then migrate each item
    for (const itemId of await listItems(groupId)) {
      await itemInfo(dataDir, groupId, itemId);
    }
  }
  // Set up gitignore
  console.log('  .gitignore');
  await setupGitignore();
  console.log('Data migration complete!');
}

/** Migrate config.json */
async function config(dataDir: string) {
  console.log('  config.json');
  const configJsonPath = `${dataDir}/config.json`;
  const oldConfig: { name: string } = JSON.parse(await fs.readFile(configJsonPath, { encoding: 'utf-8' }));

  const groupsList = await listGroups();

  const newConfig: ConfigJson = {
    siteName: oldConfig.name,
    // Assumes that all groups are visible, since there is no visibility
    // setting for groups in 0.1.0
    listedGroups: groupsList,
    color: '#ffaaff',
    version: '0.2.0',
  };

  await setConfig(newConfig);
}

/** Migrate info.md -> README.md */
async function readme(dataDir: string) {
  console.log('  info.md -> README.md');
  await fs.unlink(`${dataDir}/README.md`);
  await fs.rename(`${dataDir}/info.md`, `${dataDir}/README.md`);
}

async function itemInfo(dataDir: string, groupId: string, itemId: string) {
  console.log(`  Item: ${groupId}/${itemId}`);

  const itemPath = `${dataDir}/${groupId}/${itemId}`;
  const item: {
    name: string,
    description: string,
    color: string,
    /** External links (not internal associative links) */
    links?: {
      repo?: RepoInfo,
      site?: string,
      docs?: string,
    },
    /** Internal (associative) links */
    associations: Record<string, string[]>,
    icon?: string,
    banner?: string,
    package?: PackageInfo,
  } = JSON.parse(await fs.readFile(`${itemPath}/info.json`, { encoding: 'utf-8' }));

  const links: Infer<typeof LinksArray> = [];

  if (item.associations) {
    for (const linkedGroup of Object.keys(item.associations)) {
      links.push([{ groupId: linkedGroup, title: linkedGroup, style: 'chip' }, item.associations[linkedGroup]]);
    }
  }

  await setItemInfo(groupId, itemId, {
    name: item.name,
    description: item.description,
    color: item.color,
    icon: item.icon ?? null,
    banner: item.banner ?? null,
    links,
    urls: {
      repo: item.links?.repo ?? null,
      site: item.links?.site ?? null,
      docs: item.links?.docs ?? null,
    },
    package: item.package ?? null,
  });
}

async function groupInfo(dataDir: string, groupId: string) {
  console.log(`  Group: ${groupId}`);

  const groupPath = `${dataDir}/${groupId}`;
  const group: {
    name: string,
    description: string,
    color: string,
  } = JSON.parse(await fs.readFile(`${groupPath}/info.json`, { encoding: 'utf-8' }));

  await setGroupInfo(groupId, {
    name: group.name,
    description: group.description,
    color: group.color,
    icon: null,
    banner: null,
    // Filter using all groups
    filterGroups: await listGroups(),
    // List all items
    listedItems: await listItems(groupId),
  });
}
