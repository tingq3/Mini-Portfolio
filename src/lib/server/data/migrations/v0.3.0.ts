/**
 * Migration from 0.2.0 to 0.3.0.
 *
 * Adds missing `filterItems` property to groups.
 */
import { version } from '$app/environment';
import { listGroups, setGroupInfo, type GroupInfo } from '../group';
import { unsafeLoadGroupInfo } from './unsafeLoad';
import migrateV040 from './v0.4.0';

export default async function migrate(dataDir: string, privateDataDir: string) {
  console.log(`Migrate from v0.2.x -> ${version}`);

  // For each group
  for (const groupId of await listGroups()) {
    console.log(`  ${groupId}`);
    // Technically the `filterItems` property doesn't exist, but it's close
    // enough since we add it immediately
    const info = await unsafeLoadGroupInfo(dataDir, groupId) as GroupInfo;
    info.filterItems = info.listedItems;
    await setGroupInfo(groupId, info);
  }

  // Also perform v0.3.0 migration
  await migrateV040(dataDir, privateDataDir);
}
