import { setup } from 'jest-dev-server';

module.exports = async () => {
  console.log('\nStarting server...');
  const command = 'npm run dev -- --host localhost --port 5173';
  globalThis.servers = await setup({
    command,
    launchTimeout: 50 * 1000,
    // Server started manually in another terminal? Simply run the test.
    // Used port actions are ['ask', 'error', 'ignore', 'kill'].
    usedPortAction: 'ignore',
    port: 5173,
    host: 'localhost',
    debug: true,
    waitOnScheme: {
      delay: 1000,
    }
  });
  console.log('Server is up!');
};
