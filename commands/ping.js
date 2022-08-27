import { EmbedBuilder } from 'discord.js';
import { randomItem, require } from '../util/Util.js';
const options = require('../assets/ping.json');

export const config = {
  name: 'ping',
  description: "Checks the bot's latency",
  enabled: true
};

export const execute = async (client, interaction) =>
  interaction
    .reply({ embeds: [
      new EmbedBuilder().setColor('#FFFFFF').setTitle('Pong!')
    ]})
    .then(() => interaction.editReply({ embeds: [
      new EmbedBuilder()
        .setColor('#FFFFFF')
        .setTitle(randomItem(options))
        .setDescription(`${Date.now() - interaction.createdTimestamp}ms\nAPI Latency: ${client.ws.ping}ms`)
    ]}));