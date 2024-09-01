/** Text endpoints for the server */

import { apiFetch, text } from '$endpoints/fetch';

export function root(): Promise<string> {
  return text(apiFetch('GET', '/'));
}

export function about(token?: string): Promise<string> {
  return text(apiFetch('GET', '/about', token));
}

export function group(groupId: string): Promise<string> {
  return text(apiFetch('GET', `/${groupId}`));
}

export function item(groupId: string, itemId: string): Promise<string> {
  return text(apiFetch('GET', `/${groupId}/${itemId}`));
}

export function admin(token: string | undefined): Promise<string> {
  return text(apiFetch('GET', '/admin', token));
}

export default {
  root,
  about,
  group,
  item,
  admin,
};
