import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import logger from './middleware/logger';
import banMiddleware from './middleware/bans';

const middleware: Handle[] = [];

middleware.push(banMiddleware);
middleware.push(logger());

export const handle = sequence(...middleware);
