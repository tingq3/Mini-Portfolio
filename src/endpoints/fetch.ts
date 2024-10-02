import dotenv from 'dotenv';
import ApiError from './ApiError';
// import fetch from 'cross-fetch';
import { browser } from '$app/environment';

export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE';

function getUrl() {
  if (browser) {
    // Running in browser (request to whatever origin we are running in)
    return '';
  } else {
    // Running in node
    dotenv.config();

    const PORT = process.env.PORT as string;
    const HOST = process.env.HOST as string;
    return `http://${HOST}:${PORT}`;
  }
}

/**
 * Fetch some data from the backend
 *
 * @param method Type of request
 * @param route route to request to
 * @param token auth token (note this is only needed if the token wasn't set in
 * the cookies)
 * @param bodyParams request body or params
 *
 * @returns promise of the resolved data.
 */
export async function apiFetch(
  method: HttpVerb,
  route: string,
  token?: string,
  bodyParams?: object
): Promise<Response> {
  const URL = getUrl();
  if (bodyParams === undefined) {
    bodyParams = {};
  }

  const tokenHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const contentType = ['POST', 'PUT'].includes(method) ? { 'Content-Type': 'application/json' } : {};

  const headers = new Headers({
    ...tokenHeader,
    ...contentType,
  } as Record<string, string>);

  let url: string;
  let body: string | null; // JSON string

  if (['POST', 'PUT'].includes(method)) {
    // POST and PUT use a body
    url = `${URL}${route}`;
    body = JSON.stringify(bodyParams);
  } else {
    // GET and DELETE use params
    url
      = `${URL}${route}?`
      + new URLSearchParams(bodyParams as Record<string, string>);
    body = null;
  }

  // Now send the request
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      body,
      headers,
      // Include credentials so that the token cookie is sent with the request
      // https://stackoverflow.com/a/76562495/6335363
      credentials: 'same-origin',
    });
  } catch (err) {
    // Likely a network issue
    if (err instanceof Error) {
      throw new ApiError(null, err.message);
    } else {
      throw new ApiError(null, `Unknown request error ${err}`);
    }
  }

  return res;
}

/** Process a text response, returning the text as a string */
export async function text(response: Promise<Response>): Promise<string> {
  const res = await response;
  if ([404, 405].includes(res.status)) {
    throw new ApiError(404, `Error ${res.status} at ${res.url}`);
  }
  if (![200, 304].includes(res.status)) {
    // Unknown error
    throw new ApiError(res.status, `Request got status code ${res.status}`);
  }

  const text = await res.text();

  if ([400, 401, 403].includes(res.status)) {
    throw new ApiError(res.status, text);
  }

  return text;
}

/** Process a JSON response, returning the data as a JS object */
export async function json(response: Promise<Response>): Promise<object> {
  const res = await response;
  if ([404, 405].includes(res.status)) {
    throw new ApiError(404, `Error ${res.status} at ${res.url}`);
  }
  if (res.status >= 500) {
    // Unknown error
    throw new ApiError(res.status, `Request got status code ${res.status}`);
  }
  // Decode the data
  let json: object;
  try {
    json = await res.json();
  } catch (err) {
    // JSON parse error
    if (err instanceof Error) {
      throw new ApiError(null, err.message);
    } else {
      throw new ApiError(null, `Unknown JSON error ${err}`);
    }
  }

  if ([400, 401, 403].includes(res.status)) {
    // All 400, 401 and 403 errors have an error message
    const message = (json as { message: string }).message;
    throw new ApiError(res.status, message);
  }

  // Got valid data
  // Assign it to a new object, because otherwise it'll fail to match using
  // `.toStrictEqual`, likely due to some weirdness with Jest
  // Seems to be similar to the issues described at these URLs
  // https://github.com/jestjs/jest/issues/8446
  // https://github.com/nktnet1/jewire?tab=readme-ov-file#53-rewire-and-jest
  return Object.assign({}, json);
}
