/**
 * lib / server / loadData
 *
 * Responsible for loading data from the given data directory.
 */
import fs from 'node:fs';
import path from 'node:path';

import { create } from 'superstruct';

import {
  PortfolioConfigJson,
  ClassifierInfo,
  LabelInfo,
  type PortfolioGlobals,
  type PortfolioConfig,
  type Classifier,
  type ClassifierSlug,
  type Label,
  type LabelSlug,
} from '$types';

/** Array of errors encountered while loading data */
type ErrorList = (string | Error)[];

/**
 * Load portfolio data from the given directory
 */
export default function loadData(dir: string): PortfolioGlobals | ErrorList {
  const errors: ErrorList = [];

  const config = tryOp(errors, () => loadGlobalConfig(dir));
  const readme = tryOp(errors, () => loadReadme(dir));

  // If we have errors at this point, we should probably quit to avoid
  // overwhelming the user
  if (errors.length) {
    return errors;
  }

  // Now load the classifiers
  const classifiers: Record<string, Classifier> = {};

  for (const classifier of findItemsInDirectory(dir) as ClassifierSlug[]) {
    // Try to load the classifier info
    const result = loadClassifier(dir, classifier);
    if (Array.isArray(result)) {
      // If it fails, store the errors
      errors.push(...result);
    } else {
      // Otherwise store the info
      classifiers[classifier] = result;
    }
  }

  // If we got any errors, return those instead
  if (errors.length) {
    return errors;
  }

  return {
    config,
    readme,
    classifiers,
    classifierOrder: sortBasedOnSortKey(classifiers),
  };
}

/** Try a potentially erroneous operation, and if there is an error,  */
function tryOp<T>(errors: ErrorList, fn: () => T): T {
  try {
    return fn();
  } catch (e) {
    if (e instanceof Error) {
      errors.push(e);
    } else {
      throw e;
    }
  }
  // This is a very yucky type-cast which is absolutely incorrect.
  // It relies on the fact that calling functions need to check for the
  // presence of items in the `errors` array before attempting to return or
  // access values from this function.
  // Essentially, I am breaking the rules to avoid having to do tons of yucky
  // assertions later on down the track
  return undefined as T;
}

/**
 * Accepts a record of items containing a `sort` key, and returns an array of
 * their slugs (keys within the main record) sorted based on this key.
 */
function sortBasedOnSortKey<SlugType extends string, ObjectInfo extends { sort: number }>(
  items: Record<SlugType, { slug: SlugType, info: ObjectInfo }>,
): SlugType[] {
  // I hate that I have to do a type cast on this -- I understand why
  // TypeScript can't infer it but also it's really annoying
  const entries = Object.entries(items) as [SlugType, { slug: SlugType, info: ObjectInfo }][];
  // I wish Node 18 had .toSorted, that code would be really pretty imo
  entries.sort(([, a], [, b]) => b.info.sort - a.info.sort);
  return entries.map(([slug]) => slug);
}

/** Load and return the contents of a README.md file in the given directory */
function loadReadme(dir: string): string {
  return fs.readFileSync(`${dir}/README.md`).toString();
}

/** Load and return parsed content from the given JSON file */
function loadJsonFile(path: string): object {
  const text = fs.readFileSync(path);
  return JSON.parse(text.toString());
}

/** Return a list of all classifiers or labels in the given directory */
function findItemsInDirectory(dir: string): string[] {
  const dirInfo = fs.readdirSync(dir);
  const items = [];

  for (const entry of dirInfo) {
    if (fs.statSync(path.join(dir, entry)).isDirectory()) {
      items.push(entry);
    }
  }

  return items;
}

/** Load global configuration */
function loadGlobalConfig(dir: string): PortfolioConfig {
  return create(
    loadJsonFile(path.join(dir, 'config.json')),
    PortfolioConfigJson,
  );
}

/** Load all information about a classifier */
function loadClassifier(base: string, slug: ClassifierSlug): Classifier | ErrorList {
  const dir = path.join(base, slug);

  const errors: ErrorList = [];

  // Attempt to load classifier info
  const info = tryOp(
    errors,
    () => create(
      loadJsonFile(path.join(dir, 'info.json')),
      ClassifierInfo,
    )
  );

  const readme: string = tryOp(errors, () => loadReadme(dir));

  // Now find all the labels
  const labels: Record<string, Label> = {};

  for (const label of findItemsInDirectory(dir) as LabelSlug[]) {
    // Try to load the label info
    const result = loadLabel(dir, label);
    if (Array.isArray(result)) {
      // If it fails, store the errors
      errors.push(...result);
    } else {
      // Otherwise store the info
      labels[label] = result;
    }
  }

  // If we got any errors, return those instead
  if (errors.length) {
    return errors;
  }

  return {
    slug,
    info,
    readme,
    labels,
    labelOrder: sortBasedOnSortKey(labels),
  };
}

/** Load all information about a label */
function loadLabel(base: string, slug: LabelSlug): Label | ErrorList {
  const dir = path.join(base, slug);

  const errors: ErrorList = [];

  // Attempt to load label info
  const info = tryOp(
    errors,
    () => create(
      loadJsonFile(path.join(dir, 'info.json')),
      LabelInfo,
    )
  );

  const readme: string = tryOp(errors, () => loadReadme(dir));

  if (errors.length) {
    return errors;
  }

  return {
    slug,
    info,
    readme,
    // Check for existence of extra files
    hasIcon: fs.existsSync(path.join(dir, 'icon.png')),
    hasBanner: fs.existsSync(path.join(dir, 'banner.png')),
    hasDemo: fs.existsSync(path.join(dir, 'demo.cast')),
  };
}
