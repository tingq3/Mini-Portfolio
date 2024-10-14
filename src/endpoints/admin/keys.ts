import { apiFetch, json } from "$endpoints/fetch"

export default function keys(token: string | undefined) {
  const get = async () => {
    return json(apiFetch(
      'GET',
      '/api/admin/keys',
      token,
    )) as Promise<{ publicKey: string, keyPath: string }>;
  };

  const setKeyPath = async (keyPath: string) => {
    return json(apiFetch(
      'POST',
      '/api/admin/keys',
      token,
      { keyPath }
    )) as Promise<{ publicKey: string, keyPath: string }>;
  };

  const disable = async () => {
    return json(apiFetch(
      'DELETE',
      '/api/admin/keys',
      token,
    )) as Promise<Record<string, never>>;
  }

  const generate = async () => {
    return json(apiFetch(
      'POST',
      '/api/admin/keys/generate',
      token,
    )) as Promise<{ publicKey: string, keyPath: string }>;
  }

  return {
    /**
     * Returns the server's SSH public key, and the path to the private key
     * file
     */
    get,
    /** Sets the path to the file the server should use as the private key */
    setKeyPath,
    /** Disables SSH key-based authentication */
    disable,
    /** Generate an SSH key-pair */
    generate,
  };
}
