import api from '$endpoints';

/** Set up the server */
export async function setup() {
  return (await api.admin.firstrun(null, null)).credentials;
}
