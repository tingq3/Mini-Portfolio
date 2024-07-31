/**
 * # Lib / Server / First-run
 *
 * Code important for managing the first-run of the server.
 */

import type { ConfigLocalJson } from "$types/localConfig";
import { hash } from "crypto";
import { nanoid } from "nanoid";
import { generate as generateWords } from "random-words";

/**
 * Set up auth information.
 *
 * This is responsible for generating and storing a secure password, thereby
 * creating the default "admin" account.
 */
export function authSetup(): { username: string, password: string } {
  const username = 'admin';

  // generate password using 4 random dictionary words
  // as per tradition, https://xkcd.com/936/
  // TODO: Can this package be used securely?
  // If not maybe just use a nanoid, even though that's much less fun
  const password = (generateWords({ exactly: 4, minLength: 5 }) as string[]).join('-');

  // Generate a salt for the password
  // Using nanoid for secure generation
  const passwordSalt = nanoid();

  const passwordHash = hash('SHA256', salt + password);

  // Store auth data
  const storedData: ConfigLocalJson['auth'] = {
    username,
    passwordHash,
    passwordSalt,
  };
}
