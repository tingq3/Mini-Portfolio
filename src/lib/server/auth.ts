import { nanoid } from 'nanoid';
import { validate, number, string, type } from 'superstruct';
import jwt, { type Algorithm as JwtAlgorithm } from 'jsonwebtoken';
import { unixTime } from '$lib/util';
import { hash } from 'crypto';
import { generate as generateWords } from 'random-words';
import { setLocalConfig, type ConfigLocalJson } from './data/localConfig';
import consts from '$lib/consts';

/** Maximum lifetime of a session */
const sessionLifetime = '14d';

/** Algorithm to sign and validate JWT */
const algorithm: JwtAlgorithm = 'HS256';

/**
 * Validation for JWT payload.
 *
 * using `type` rather than `object` as there may be additional properties
 * added by the `jsonwebtoken` library.
 */
export const JwtPayload = type({
  /** Session ID */
  sessionId: string(),
  /** Expiry time (as UNIX timestamp) */
  exp: number(),
  /** Initialization time (as UNIX timestamp) */
  iat: number(),
});

/** Returns the secret value used to validate JWTs */
function getTokenSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret === 'CHANGE ME') {
    throw new Error('AUTH_SECRET environment variable must be set to a value');
  }
  return secret;
}

/** Generate a token */
export function generateToken(): string {
  const sessionId = nanoid();
  const iat = unixTime();

  return jwt.sign(
    { sessionId, iat },
    getTokenSecret(),
    { expiresIn: sessionLifetime, algorithm },
  );
}

/** Decode the given token, and return the session if it passes validation */
export function validateToken(token: string): string | undefined {
  try {
    const payload = jwt.verify(token, getTokenSecret(), { algorithms: [algorithm] });
    const [err, data] = validate(payload, JwtPayload);
    if (err) {
      // Token failed validation
      console.log(err);
      return undefined;
    }
    // Ensure that the session isn't in our revoked list
    // And also that it wasn't issued before our notBefore time
    return data.sessionId;
  } catch (e) {
    // Print the error
    console.log(e);
    return undefined;
  }
}

/** Revoke the session of the given token */
export function revokeToken(token: string) {
  // TODO
}

/** Credentials provided after first run */
export type FirstRunCredentials = {
  username: string,
  password: string,
  token: string,
}

/** Hash a password with the given salt, returning the result */
export function hashAndSalt(salt: string, password: string): string {
  // TODO: Thoroughly check this against the OWASP guidelines -- it probably
  // doesn't match the requirements.
  // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
  return hash('SHA256', salt + password);
}

/**
 * Set up auth information.
 *
 * This is responsible for generating and storing a secure password, thereby
 * creating the default "admin" account.
 */
export async function authSetup(): Promise<FirstRunCredentials> {
  const username = 'admin';

  // generate password using 4 random dictionary words
  // as per tradition, https://xkcd.com/936/
  // TODO: Can this package be used securely?
  // If not maybe just use a nanoid, even though that's much less fun
  const password = (generateWords({ exactly: 4, minLength: 5 }) as string[]).join('-');

  // Generate a salt for the password
  // Using nanoid for secure generation
  const salt = nanoid();

  const passwordHash = hashAndSalt(salt, password);

  // Set up auth config
  const config: ConfigLocalJson = {
    auth: {
      username,
      password: {
        hash: passwordHash,
        salt: salt,
      },
      sessions: {
        notBefore: unixTime(),
        revokedSessions: {},
      }
    },
    version: consts.VERSION,
  };

  await setLocalConfig(config);

  return {
    username,
    password,
    token: generateToken(),
  };
}
