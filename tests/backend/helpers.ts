import api from '$endpoints';

/** Set up the server */
export async function setup() {
  return (await api.admin.firstrun(null, null)).credentials;
}

/** Create a group with the given ID */
export async function makeGroup(token: string, id: string) {
  await api.group.withId(id).create(token, id, id);
}
