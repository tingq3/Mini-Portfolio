
/**
 * Get a UNIX timestamp.
 * @returns current time. as a UNIX timestamp.
 */
export function unixTime(): number {
  return Math.floor(Date.now() / 1000);
}

/** Capitalise the given string */
export function capitalize(str: string): string {
  // https://stackoverflow.com/a/1026087/6335363
  return str.charAt(0).toUpperCase() + str.slice(1);
}
