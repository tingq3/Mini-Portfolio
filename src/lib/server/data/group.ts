/**
 * Access group data
 */

import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { array, nullable, string, type, validate, type Infer } from 'superstruct';
import { getDataDir } from './dataDir';
import { rimraf } from 'rimraf';
import formatTemplate from '../formatTemplate';

const DEFAULT_README = `
# {{group}}

{{description}}

This is the \`README.md\` file for the group {{group}}. Go ahead and modify it to
tell everyone more about it. Is this for your projects? Your skills? Tools you
know how to use?
`;

/** Brief info about a group */
export const GroupInfoStruct = type({
  /** User-facing name of the group */
  name: string(),

  /** Short description of the group */
  description: string(),

  /** Color */
  color: string(),

  /** Icon to display in lists */
  icon: nullable(string()),

  /** Banner image to display on item page */
  banner: nullable(string()),

  // TODO: Support icons for groups here

  /**
   * Groups whose items should be used for filtering on this group
   */
  filterGroups: array(string()),

  /**
   * Array of item IDs to display for this page.
   */
  listedItems: array(string()),

  /** Array of item IDs to use as filters when this group is used as a filter for other group's items */
  filterItems: array(string()),
});

/** Brief info about a group */
export type GroupInfo = Infer<typeof GroupInfoStruct>;

/**
 * Return the full list of groups.
 *
 * This includes groups not included in the main list.
 */
export async function listGroups(): Promise<string[]> {
  return (await readdir(getDataDir(), { withFileTypes: true }))
    // Only keep directories
    .filter(d => d.isDirectory())
    // .git isn't a valid group
    .filter(d => d.name !== '.git')
    .map(d => d.name);
}

/** Return the full info about the group with the given ID */
export async function getGroupInfo(groupId: string): Promise<GroupInfo> {
  const data = await readFile(
    `${getDataDir()}/${groupId}/info.json`,
    { encoding: 'utf-8' }
  );

  // Validate data
  const [err, parsed] = validate(JSON.parse(data), GroupInfoStruct);
  if (err) {
    console.log(`Error while parsing '${getDataDir()}/${groupId}/info.json'`);
    console.error(err);
    throw err;
  }

  return parsed;
}

/** Update the full info about the group with the given ID */
export async function setGroupInfo(groupId: string, info: GroupInfo) {
  await writeFile(
    `${getDataDir()}/${groupId}/info.json`,
    JSON.stringify(info, undefined, 2),
  );
}

/** Returns the contents of the group's README.md */
export async function getGroupReadme(groupId: string): Promise<string> {
  return readFile(
    `${getDataDir()}/${groupId}/README.md`,
    { encoding: 'utf-8' },
  );
}

/** Update the contents of the group's README.md */
export async function setGroupReadme(groupId: string, readme: string) {
  await writeFile(
    `${getDataDir()}/${groupId}/README.md`,
    readme,
  );
}

/** Creates a new group with the given ID and name */
export async function createGroup(id: string, name: string, description: string) {
  await mkdir(`${getDataDir()}/${id}`);

  // If there is a description, add it to the readme text
  const readme = formatTemplate(DEFAULT_README, [['group', name], ['description', description]])
    // If the description was empty, we'll end up with extra newlines -- get
    // rid of them.
    .replace('\n\n\n', '');

  await setGroupInfo(id, {
    name,
    description,
    // TODO: Generate a random color for the new group
    color: '#aa00aa',
    icon: null,
    banner: null,
    filterGroups: [],
    listedItems: [],
    filterItems: [],
  });
  await setGroupReadme(id, readme);
}

/** Removes the group with the given ID */
export async function deleteGroup(id: string) {
  await rimraf(`${getDataDir()}/${id}`);
}

/**
 * Overall data for a group, comprised of the group's `info.json`, `README.md`
 * and potentially other data as required.
 */
export type GroupData = {
  info: GroupInfo,
  readme: string,
}

/** Return full data for the group */
export async function getGroupData(id: string): Promise<GroupData> {
  return {
    info: await getGroupInfo(id),
    readme: await getGroupReadme(id),
  };
}
