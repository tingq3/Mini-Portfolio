import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import logger from './middleware/logger';

const middleware: Handle[] = [];

middleware.push(logger());

export const handle = sequence(...middleware);
