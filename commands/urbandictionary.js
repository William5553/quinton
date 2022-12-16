import fetch from 'node-fetch';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

export const config = {
  name: 'urbandictionary',
  description: 'Searches for a term on the Urban Dictionary.',
  enabled: true,
  options: [
    {
      name: 'query',
      description: 'The text to search.',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'result',
      description: 'The result number.',
      type: ApplicationCommandOptionType.Integer,
      required: false
    }
  ]
};
    
export const execute = async (client, interaction) => {
  await interaction.deferReply();

  fetch(`http://api.urbandictionary.com/v0/define?term=${interaction.options.getString('query')}`)
    .then(res => res.json())
    .then(body => {
      if (body.list.length === 0) return interaction.editReply('Could not find any results');

      const data = body.list[interaction.options.getInteger('result') ? Math.min(body.list.length - 1, Math.max(0, interaction.options.getInteger('result') - 1)) : 0];
    
      return interaction.editReply({ embeds: [
        new EmbedBuilder()
          .setColor(0x32_A8_F0)
          .setAuthor({ name: 'Urban Dictionary', iconURL: 'https://i.imgur.com/Fo0nRTe.png', url: data.permalink })
          .setURL(data.permalink)
          .setTitle(data.word)
          .setDescription(data.definition.slice(0, 1200))
          .setFooter({ text: `Author: ${data.author} | 👍 ${data.thumbs_up} 👎 ${data.thumbs_down}` })
          .setTimestamp(new Date(data.written_on))
          .addFields([{ name: 'Example', value: data.example ? data.example.slice(0, 800) : 'None' }])
      ]});
    });
};