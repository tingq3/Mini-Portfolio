import { nanoid } from 'nanoid';
import { validate, number, string, type } from 'superstruct';
import { sign as signJwt, verify as verifyJwt, type Algorithm as JwtAlgorithm } from 'jsonwebtoken';
import { unixTime } from '$lib/util';

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

  return signJwt(
    { sessionId, iat },
    getTokenSecret(),
    { expiresIn: sessionLifetime, algorithm },
  );
}

/** Decode the given token, and return the session if it passes validation */
export function validateToken(token: string): string | undefined {
  try {
    const payload = verifyJwt(token, getTokenSecret(), { algorithms: [algorithm] });
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
