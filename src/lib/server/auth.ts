import { nanoid } from 'nanoid';
import { validate, number, string, type, type Infer } from 'superstruct';
import jwt, { type Algorithm as JwtAlgorithm } from 'jsonwebtoken';
import { unixTime } from '$lib/util';
import { hash } from 'crypto';
import { generate as generateWords } from 'random-words';
import { getLocalConfig, setLocalConfig, type ConfigLocalJson } from './data/localConfig';
import { dev, version } from '$app/environment';
import { error, redirect, type Cookies } from '@sveltejs/kit';

/** Maximum lifetime of a session -- 14 days */
const sessionLifetime = 60 * 60 * 24 * 14;

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
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable must be set to a value');
  }
  if (!dev && secret === 'CHANGE ME') {
    throw new Error('AUTH_SECRET must be changed when running in production');
  }
  return secret;
}

/**
 * Generate a token.
 *
 * If cookies is provided, the token will also be stored to the cookies.
 */
export function generateToken(cookies?: Cookies): string {
  const sessionId = nanoid();
  const iat = unixTime();

  const token = jwt.sign(
    { sessionId, iat },
    getTokenSecret(),
    { expiresIn: sessionLifetime, algorithm }
  );
  const expires = iat + sessionLifetime;
  if (cookies) {
    cookies.set(
      'token',
      token,
      {
        path: '/',
        expires: new Date(expires * 1000)
      }
    );
  }
  return token;
}

/** Decode the given token, and return the session if it passes validation */
export async function validateToken(token: string): Promise<Infer<typeof JwtPayload>> {
  // If the token starts with 'Bearer ', strip that out
  if (token.startsWith('Bearer ')) {
    token = token.replace('Bearer ', '');
  }
  // Disallow token validation if auth is disabled
  const config = await getLocalConfig();
  if (!config.auth) {
    throw Error('Authentication is disabled');
  }
  // Otherwise attempt to validate the token
  let payload: unknown;
  try {
    payload = jwt.verify(token, getTokenSecret(), { algorithms: [algorithm] });
  } catch (e) {
    // Token failed to validate
    if (e instanceof Error) {
      throw Error(`Token failed to validate: ${e.message}`);
    } else {
      // Should always be an error
      throw Error('Token failed to validate');
    }
  }
  const [err, data] = validate(payload, JwtPayload);
  if (err) {
    // Token data format is incorrect
    throw Error('Token data is in incorrect format');
  }
  // Ensure that the session isn't in our revoked list
  if (data.sessionId in config.auth.sessions.revokedSessions) {
    throw Error('This session has been revoked');
  }

  // And also that it wasn't issued before our notBefore time
  if (data.iat < config.auth.sessions.notBefore) {
    throw Error('This session was created too long ago');
  }
  return data;
}

/**
 * Validates and returns the token from the given request.
 *
 * First attempts to get the token from the "Authorization" header, but if that
 * isn't present, the "token" property is checked within the cookies.
 *
 * If the token is invalid, it is removed from the cookies.
 */
export async function validateTokenFromRequest(req: { request: Request, cookies: Cookies }): Promise<string> {
  const tokenFromHeader = req.request.headers.get('Authorization');
  const tokenFromCookie = req.cookies.get('token');

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    throw error(401, 'A token is required to access this endpoint');
  }
  await validateToken(token).catch(e => {
    // Remove token from cookies, as it is invalid
    req.cookies.delete('token', { path: '/' });
    error(401, `${e}`);
  });
  return token;
}

/** Return whether the request is authorized (has a token) */
export async function isRequestAuthorized(req: { request: Request, cookies: Cookies }): Promise<boolean> {
  try {
    await validateTokenFromRequest(req);
    return true;
  } catch {
    return false;
  }
}

/** If the given token is invalid, throw a redirect to the given page */
export async function redirectOnInvalidToken(req: { request: Request, cookies: Cookies }, url: string) {
  await validateTokenFromRequest(req).catch(() => redirect(303, url));
}

/** Revoke the session of the given token */
export async function revokeSession(token: string): Promise<void> {
  const config = await getLocalConfig();
  if (!config.auth) {
    // Can't invalidate tokens if there is not auth
    throw Error('Authentication is disabled');
  }
  const sessionData = await validateToken(token);
  // Add to the revoked sessions
  config.auth.sessions.revokedSessions[sessionData.sessionId] = sessionData.exp;
  await setLocalConfig(config);
}

/** Credentials provided after first run */
export interface FirstRunCredentials {
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
export async function authSetup(cookies?: Cookies): Promise<FirstRunCredentials> {
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
    version,
  };

  await setLocalConfig(config);

  return {
    username,
    password,
    token: generateToken(cookies),
  };
}
