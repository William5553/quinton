import { createRequire } from 'node:module';

export { setTimeout as wait } from 'node:timers/promises';
export const randomItem = array => array[Math.floor(Math.random() * array.length)];
export const require = createRequire(import.meta.url);