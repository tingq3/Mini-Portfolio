import { teardown } from 'jest-dev-server';
import { setTimeout } from 'timers/promises';

module.exports = async () => {
  // In case the server was started automatically by Jest (see globalSetup.ts)
  globalThis.servers.forEach(child => {
    console.log('Shutting down dev server with PID:', child.pid);
    child.kill('SIGINT');
  });

  // Wait a second for the server to die
  await setTimeout(1000);

  await teardown(globalThis.servers);
};
