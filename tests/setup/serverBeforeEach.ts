import api from '$api';
import chalk from 'chalk';
import { beforeEach, expect } from 'vitest';

// Before each test, clear the server data, then echo the test name
beforeEach(async () => {
  await api.debug.clear();
  // https://stackoverflow.com/a/63625415/6335363
  const testName = expect.getState().currentTestName;
  if (testName) {
    await api.debug.echo(
      `${chalk.yellow('[Jest]')} Begin test ${chalk.cyan(testName)}`
    );
  }
});
