/** Text endpoints for the server */

import { apiFetch, text } from '$endpoints/fetch';

export function root(): Promise<string> {
  return text(apiFetch('GET', '/'));
}

export function group(groupId: string): Promise<string> {
  return text(apiFetch('GET', `/${groupId}`));
}

export function item(groupId: string, itemId: string): Promise<string> {
  return text(apiFetch('GET', `/${groupId}/${itemId}`));
}

export default {
  root,
  group,
  item,
};
