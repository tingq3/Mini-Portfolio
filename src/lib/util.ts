
/**
 * Get a UNIX timestamp.
 * @returns current time. as a UNIX timestamp.
 */
export function unixTime(): number {
  return Math.floor(Date.now() / 1000);
}
