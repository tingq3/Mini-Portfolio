/** Unsafely load data, so that types are not checked */
import fs from 'fs/promises';

/** Load old config.json */
export async function unsafeLoadConfig(dataDir: string): Promise<object> {
  return JSON.parse(await fs.readFile(`${dataDir}/config.json`, { encoding: 'utf-8' }));
}

/** Load item info in old format */
export async function unsafeLoadItemInfo(dataDir: string, groupId: string, itemId: string): Promise<object> {
  return JSON.parse(await fs.readFile(`${dataDir}/${groupId}/${itemId}/info.json`, { encoding: 'utf-8' }));
}

/** Load group info in old format */
export async function unsafeLoadGroupInfo(dataDir: string, groupId: string): Promise<object> {
  return JSON.parse(await fs.readFile(`${dataDir}/${groupId}/info.json`, { encoding: 'utf-8' }));
}
