import api from '$api';
import chalk from 'chalk';
import path from 'path';
import { beforeEach, expect } from 'vitest';

// Before each test, clear the server data, then echo the test name
beforeEach(async () => {
  await api.debug.clear();
  // https://stackoverflow.com/a/63625415/6335363
  const testName = expect.getState().currentTestName || 'Unknown test name';
  const testPath = expect.getState().testPath || 'Unknown test file';
  // Relative to tests directory
  const testFile = path.relative(path.join(process.cwd(), 'tests'), testPath);
  await api.debug.echo(
    `${chalk.yellow('[Test case]')} ${chalk.grey(testFile)} ${chalk.cyan(testName)}`
  );
});
