import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import * as process from 'node:process';
import { readdir } from 'node:fs';

import * as logger from './util/logger.js';

const client = new Client({
  intents: Object.values(GatewayIntentBits).reduce((acc, p) => acc | p, 0) ?? 32_767,
  partials: [ Partials.Channel ],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
  waitGuildTimeout: 5000
});

client.commands = new Collection();
client.logger = logger;

readdir('./events/', (err, files) => {
  if (err) logger.error(err);
  logger.log(`Loading a total of ${files.length} events.`);
  files.forEach(async file => {
    if (!file.endsWith('.js'))
      return logger.warn(`File not ending with .js found in events folder: ${file}`);
    const eventName = file.split('.')[0];
    logger.log(`Loading Event: ${eventName}. 👌`);
    const event = await import(`./events/${file}`);
    // Bind the client to any event, before the existing arguments provided by the discord.js event
    client.on(eventName, event.default.bind(undefined, client));
  });
});

client.login(process.env.token);