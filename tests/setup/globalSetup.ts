import { setup } from 'jest-dev-server';
import dotenv from 'dotenv';
dotenv.config();

module.exports = async () => {
  console.log('\nStarting server...');
  const command = `npm run dev -- --host ${process.env.HOST} --port ${process.env.PORT}`;
  globalThis.servers = await setup({
    command,
    launchTimeout: 50 * 1000,
    // Server started manually in another terminal? Simply run the test.
    // Used port actions are ['ask', 'error', 'ignore', 'kill'].
    usedPortAction: 'ignore',
    port: parseInt(process.env.PORT as string),
    host: process.env.HOST,
    debug: true,
    waitOnScheme: {
      delay: 1000,
    }
  });
  console.log('Server is up!');
};
