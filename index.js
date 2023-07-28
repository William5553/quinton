import { readdir } from 'node:fs';
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';

import * as logger from './util/logger.js';

const client = new Client({
  intents: Object.values(GatewayIntentBits).reduce((acc, p) => acc | p, 0) ?? 32_767,
  partials: [ Partials.Channel ],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
  waitGuildTimeout: 5000,
  presence: {
    status: 'online',
    activities: [{
      name: '/isittuesday',
      type: 'LISTENING',
      url: 'https://www.github.com/William5553/quinton'
    }]
  }
});

client.owners = [];

client.commands = new Collection();
client.logger = logger;


readdir('./events/', async (err, files) => {
  if (err) logger.error(err);
  logger.log(`Loading a total of ${files.length} events.`);
  for (const file of files) {
    if (!file.endsWith('.js'))
      return logger.warn(`File not ending with .js found in events folder: ${file}`);
    const eventName = file.split('.')[0];
    logger.log(`Loading Event: ${eventName}. 👌`);
    const event = await import(`./events/${file}`);
    // Bind the client to any event, before the existing arguments provided by the discord.js event
    client.on(eventName, event.default.bind(undefined, client));
  }
});

readdir('./commands/', async (err, files) => {
  if (err) logger.error(err);
  logger.log(`Loading a total of ${files.length} commands.`);

  for (const file of files) {
    if (!file.endsWith('.js'))
      return logger.warn(`File not ending with .js found in commands folder: ${file}`);

    const command = await import(`./commands/${file}`);
    
    if (command.config.enabled !== true)
      return logger.warn(`${command.config.name} is disabled.`);
    if (!command.config)
      return logger.warn(`${command} failed to load as it is missing required command configuration`);
    logger.log(`Loading Command: ${command.config.name}. 👌`);
    if (command.config.name !== file.split('.')[0])
      return logger.warn(`File name ${command} has a different command name ${command.config.name}`);

    client.commands.set(command.config.name, command);
  }
});

await client.login(process.env.token);

process.on('uncaughtException', err => client.logger.error(`UNCAUGHT EXCEPTION:\n${err.stack ?? err}`));
process.on('unhandledRejection', err => client.logger.error(`UNHANDLED REJECTION:\n${err.stack ?? err}`));