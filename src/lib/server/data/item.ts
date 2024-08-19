/**
 * Access item data
 */

import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { array, enums, intersection, object, optional, record, string, tuple, type, validate, type Infer } from 'superstruct';
import { getDataDir } from './dataDir';
import { rimraf } from 'rimraf';
import { setGroupInfo } from './group';
import { RepoInfoStruct } from './itemRepo';
import { PackageInfoStruct } from './itemPackage';
import formatTemplate from '../formatTemplate';

const DEFAULT_README = `
# {{item}}

{{description}}

This is the \`README.md\` file for the item {{item}}. Go ahead and modify it to
tell everyone more about it. Is it something you made, or something you use?
How does it demonstrate your abilities?
`;

/** Brief info about an item */
export const ItemInfoBriefStruct = type({
  /** User-facing name of the item */
  name: string(),

  /** Short description of the item */
  description: string(),

  /** Color */
  color: string(),

  // TODO: Support icons for item here
});

/** Brief info about an item */
export type ItemInfoBrief = Infer<typeof ItemInfoBriefStruct>;

/**
 * Links (associations) with other items.
 *
 * Array of `[group, [...items]]`
 *
 * * Each `group` is a group ID
 * * Each item in `items` is an item ID within that group
 */
export const LinksArray = array(
  tuple([
    string(), array(string()),
  ])
);

/** Full information about an item */
export const ItemInfoFullStruct = intersection([
  ItemInfoBriefStruct,
  type({
    /** Links to display as chips */
    chipLinks: LinksArray,
    /** Links to display as cards */
    cardLinks: LinksArray,

    /** URLs associated with the label */
    urls: object({
      /** URL of the source repository of the label */
      repo: optional(RepoInfoStruct),

      /** URL of the site demonstrating the label */
      site: optional(string()),

      /** URL of the documentation site for the label */
      docs: optional(string()),
    }),

    /** Information about the package distribution of the label */
    package: optional(PackageInfoStruct),
  }),
]);

/** Full information about an item */
export type ItemInfoFull = Infer<typeof ItemInfoFullStruct>;

/**
 * Return the full list of items within a group.
 *
 * This includes items not included in the main list.
 */
export async function listItems(groupId: string): Promise<string[]> {
  return (await readdir(`${getDataDir()}/${groupId}`, { withFileTypes: true }))
    // Only keep directories
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

/** Return the full info about the item from the given group with the given ID */
export async function getItemInfo(groupId: string, itemId: string): Promise<ItemInfoFull> {
  const infoJsonPath = `${getDataDir()}/${groupId}/${itemId}/info.json`;
  const data = await readFile(
    infoJsonPath,
    { encoding: 'utf-8' }
  );

  // Validate data
  const [err, parsed] = validate(JSON.parse(data), ItemInfoFullStruct);
  if (err) {
    console.log(`Error while parsing '${infoJsonPath}'`);
    console.error(err);
    throw err;
  }

  return parsed;
}

/** Return the brief info about the item with the given ID */
export async function getItemInfoBrief(groupId: string, itemId: string): Promise<ItemInfoBrief> {
  const info = await getItemInfo(groupId, itemId);

  return {
    name: info.name,
    description: info.description,
    color: info.color,
  };
}

/** Update the full info about the item with the given ID */
export async function setItemInfo(groupId: string, itemId: string, info: ItemInfoFull) {
  const infoJsonPath = `${getDataDir()}/${groupId}/${itemId}/info.json`;
  await writeFile(
    infoJsonPath,
    JSON.stringify(info, undefined, 2),
  );
}

/** Returns the contents of the item's README.md */
export async function getItemReadme(groupId: string, itemId: string): Promise<string> {
  return readFile(
    `${getDataDir()}/${groupId}/${itemId}/README.md`,
    { encoding: 'utf-8' },
  );
}

/** Update the contents of the item's README.md */
export async function setItemReadme(groupId: string, itemId: string, readme: string) {
  await writeFile(
    `${getDataDir()}/${groupId}/${itemId}/README.md`,
    readme,
  );
}

/** Creates a new item with the given ID and name */
export async function createItem(groupId: string, itemId: string, name: string, description: string) {
  await mkdir(`${getDataDir()}/${groupId}/${itemId}`);

  // If there is a description, add it to the readme text
  const readme = formatTemplate(DEFAULT_README, [['item', name], ['description', description]])
    // If the description was empty, we'll end up with extra newlines -- get
    // rid of them.
    .replace('\n\n\n', '');

  await setItemInfo(groupId, itemId, {
    name,
    description,
    // TODO: Generate a random color for the new item
    color: '#aa00aa',
    chipLinks: [],
    cardLinks: [],
    urls: {},
  });
  await setItemReadme(groupId, itemId, readme);
}

/** Removes the item with the given ID */
export async function deleteItem(groupId: string, itemId: string) {
  await rimraf(`${getDataDir()}/${groupId}/${itemId}`);
}
