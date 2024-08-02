import api from '$api';

/** Set up the server */
export async function setup() {
  return (await api.admin.firstrun(null, null)).credentials;
}
