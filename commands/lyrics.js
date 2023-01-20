import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js';
import { Client } from 'genius-lyrics';
import { splitMessage, clamp } from '../util/Util.js';

const GClient = new Client(process.env.genius_api_key);

export const config = {
  name: 'lyrics',
  description: 'Gets lyrics for a song',
  enabled: true,
  options: [
    {
      name: 'query',
      description: 'The song to get lyrics for.',
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

  const query = interaction.options.getString('query');
  const result = interaction.options.getInteger('result');

  let lyrics, song;
  try {
    const search = await GClient.songs.search(query, { sanitizeQuery: true });
    song = search[result ? clamp(result - 1, 0, search.length - 1) : 0];
    lyrics = await song.lyrics(false);
  } catch (error) {
    interaction.editReply(`No lyrics found for ${query}${error.message === 'No result was found' ? '' : `: ${error.message ?? error}`}`);
    return 'No lyrics found';
  }

  const embeds = [];
  
  for (const m of splitMessage(lyrics, { maxLength: 3700 })) {
    if (embeds.length < 10) {
      const embed = new EmbedBuilder()
        .setDescription(m)
        .setColor('#F8AA2A');

      if (embeds.length === 0)
        embed.setTitle(song.fullTitle);

      embeds.push(embed);
    }
  }
  interaction.editReply({ embeds });
};