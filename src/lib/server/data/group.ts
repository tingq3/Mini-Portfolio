/**
 * Access group data
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { array, enums, intersection, object, string, validate, type Infer } from "superstruct";
import { getDataDir } from "./dataDir";

/** Brief info about a group */
export const GroupInfoBriefStruct = object({
  /** User-facing name of the group */
  name: string(),

  /** Short description of the group */
  description: string(),

  /** Color */
  color: string(),

  // TODO: Support icons for groups here
});

/** Brief info about a group */
export type GroupInfoBrief = Infer<typeof GroupInfoBriefStruct>;

/**
 * How to display associations:
 *
 * * `"chip"`: use a chip
 * * `"card"`: use a card
 */
export const AssociationOptionsDisplayStruct = enums(['chip', 'card']);

/**
 * How to display associations:
 *
 * * `"chip"`: use a chip
 * * `"card"`: use a card
 */
export type AssociationOptionsDisplay = Infer<typeof AssociationOptionsDisplayStruct>;

/**
 * Information about how to display associations.
 *
 * By default, the name of the classifier will be used, and it will be shown as
 * a list of chips.
 *
 * If the classifier is the same as the current label, by default it will be
 * named "See also" and displayed as cards.
 */
const AssociationOptionsStruct = object({
  /** ID of the group to show associations for */
  group: string(),
  /** Title to use when displaying the associations under this group. */
  title: string(),
  /** Display options. Use `"chip"` or `"card"`. */
  display: AssociationOptionsDisplayStruct,
});

/** Information about how to display associations */
export type AssociationOptions = Infer<typeof AssociationOptionsStruct>;

/** Full information about a group */
export const GroupInfoFullStruct = intersection([
  GroupInfoBriefStruct,
  object({
    /**
     * Groups whose items should be used for filtering on this group
     */
    filterGroups: array(string()),

    /**
     * Information on how to display associations for each item in this group.
     */
    associations: array(AssociationOptionsStruct),

    /**
     * Array of item IDs to display for this page.
     */
    listedItems: array(string()),
  }),
]);

/** Full information about a group */
export type GroupInfoFull = Infer<typeof GroupInfoFullStruct>;

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
export async function getGroupInfo(groupId: string): Promise<GroupInfoFull> {
  const data = await readFile(
    `${getDataDir()}/${groupId}/info.json`,
    { encoding: 'utf-8' }
  );

  // Validate data
  const [err, parsed] = validate(JSON.parse(data), GroupInfoFullStruct);
  if (err) {
    console.log(`Error while parsing '${getDataDir()}/${groupId}/info.json'`);
    console.error(err);
    throw err;
  }

  return parsed;
}

/** Return the brief info about the group with the given ID */
export async function getGroupInfoBrief(groupId: string): Promise<GroupInfoBrief> {
  const info = await getGroupInfo(groupId);

  return {
    name: info.name,
    description: info.description,
    color: info.color,
  };
}

/** Update the full info about the group with the given ID */
export async function setGroupInfo(groupId: string, info: GroupInfoFull) {
  await writeFile(
    `${getDataDir()}/${groupId}/info.json`,
    JSON.stringify(info, undefined, 2),
  );
}

export async function getGroupReadme(groupId: string): Promise<string> {
  return readFile(
    `${getDataDir()}/${groupId}/README.md`,
    { encoding: 'utf-8' },
  );
}
