import type { Handle } from '@sveltejs/kit';
import chalk, { type ChalkInstance } from 'chalk';

/** Colorize request method for pretty-printing */
function colorRequestMethod(method: string): string {
  const mapping: Record<string, ChalkInstance> = {
    get: chalk.blue,
    post: chalk.green,
    put: chalk.yellow,
    delete: chalk.red
  };

  return mapping[method.toLowerCase()](method) ?? method;
}

/** Format time to handle request, given a start time */
function formatDuration(start: number, end: number) {
  const duration = end - start;
  let color: ChalkInstance;
  if (duration < 10) {
    color = chalk.gray;
  } else if (duration < 50) {
    color = chalk.white;
  } else if (duration < 100) {
    color = chalk.green;
  } else if (duration < 500) {
    color = chalk.blue;
  } else if (duration < 1000) {
    color = chalk.yellow;
  } else {
    color = chalk.red;
  }

  return color(`(${duration}ms)`);
}

/** Colorize status code */
function colorStatus(code: number): string {
  if (code < 300) {
    return chalk.green(code);
  } else if (code < 400) {
    return chalk.blue(code);
  } else if (code < 500) {
    return chalk.yellow(code);
  } else {
    return chalk.red(code);
  }
}

/**
 * Logging middleware to display incoming requests
 *
 * Shows in the format:
 *
 *     2022-10-01T14:48:00.000Z GET / (23ms) 200
 *
 * Adapted from: https://www.reddit.com/r/sveltejs/comments/xtbkpb
 */
export const logger: Handle = async ({ event, resolve }) => {
  const requestStartTime = Date.now();
  const response = await resolve(event);

  console.log(
    new Date(requestStartTime).toISOString(),
    colorRequestMethod(event.request.method),
    chalk.magenta(event.url.pathname),
    formatDuration(requestStartTime, Date.now()),
    colorStatus(response.status)
  );
  return response;
};
