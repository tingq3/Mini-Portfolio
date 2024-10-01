import { error } from '@sveltejs/kit';

/** Regex for matching ID strings */
const idValidatorRegex = /^[a-z0-9-.]+$/;

/** Ensure that the given ID string is valid */
export function validateId(type: string, id: string): string {
  if (!id.trim().length) {
    return error(400, `${type} '${id}' is empty`);
  }
  if (!idValidatorRegex.test(id)) {
    return error(400, `${type} '${id}' is contains illegal characters`);
  }
  if (id.startsWith('.')) {
    return error(400, `${type} '${id}' has a leading dot`);
  }
  if (id.endsWith('.')) {
    return error(400, `${type} '${id}' has a trailing dot`);
  }
  if (id.startsWith('-')) {
    return error(400, `${type} '${id}' has a leading dash`);
  }
  if (id.endsWith('-')) {
    return error(400, `${type} '${id}' has a trailing dash`);
  }
  return id;
}

/** Array of illegal characters that cannot be used in names */
const illegalNameChars = ['\t', '\n', '\f', '\r'];

export function validateName(name: string): string {
  if (!name) {
    return error(400, 'Name cannot be empty');
  }
  if (name.trim().length !== name.length) {
    return error(400, 'Name cannot contain leading or trailing whitespace');
  }
  if (
    illegalNameChars
      .reduce((n, c) => n.replace(c, ''), name)
      .length
    !== name.length
  ) {
    return error(400, 'Name contains illegal whitespace characters');
  }

  return name;
}
