import api from '$api';
import chalk from 'chalk';

// Before each test, clear the server data, then echo the test name
global.beforeEach(async () => {
  await api.debug.clear();
  // https://stackoverflow.com/a/63625415/6335363
  const testPath = expect.getState().testPath;
  const testName = expect.getState().currentTestName;
  if (testName) {
    await api.debug.echo(
      `${chalk.yellow('[Jest]')} Begin test ${chalk.blue(testPath)}::${chalk.magenta(testName)}`
    );
  }
});
