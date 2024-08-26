/**
 * Session token
 */
import storage from './localStore';

const token = storage<string | undefined | null>('maddyfolio-token', undefined);

export default token;
