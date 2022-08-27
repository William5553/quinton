import { randomItem, require } from '../util/Util.js';
const options = require('../assets/ping.json');

export const config = {
  name: 'ping',
  description: "Checks the bot's latency",
  enabled: true
};

export const execute = async (client, interaction) => {
  interaction.reply('Pong!').then(() => interaction.editReply(`${randomItem(options)} (${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms)`));
};