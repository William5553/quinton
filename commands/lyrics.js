import { EmbedBuilder, ApplicationCommandOptionType, ActivityType } from 'discord.js';
import { Client, SongsClient } from 'genius-lyrics';
import { splitMessage, confirm } from '../util/Util.js';

const clientConfig = new Client(process.env.genius_api_key);
const GClient = new SongsClient(clientConfig);

export const config = {
  name: 'lyrics',
  description: 'Gets lyrics for a song',
  enabled: true,
  options: [
    {
      name: 'query',
      description: 'The text to search.',
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ]
};
  
export const execute = async (client, interaction) => {
  await interaction.deferReply();
  let query = interaction.options.getString('query');
  if (!query && interaction.member.presence.activities.length > 0) {
    const listening = await interaction.member.presence.activities.find(activity => activity.type === ActivityType.Listening && activity.name === 'Spotify');
    if (!listening) return interaction.editReply('Please specify which song you want to get the lyrics for.');
    await interaction.editReply({embeds: [
      new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: 'Spotify', iconURL: 'https://cdn.discordapp.com/emojis/408668371039682560.png' })
        .setDescription(`You are currently listening to [**${listening.details}** by **${listening.state.split(';')[0]}**](https://open.spotify.com/track/${listening.syncId}) in the album **${listening.assets.largeText}** on Spotify, would you like to get the lyrics of that song?`)
    ]});
    const confirmed = await confirm(interaction, interaction.member);
    if (confirmed != true) return interaction.editReply({ content: 'Okay, you can also specify a song to fetch the lyrics for.', embeds: [] });
    query = `${listening.details} ${listening.state.split(';')[0]}`;
  }
  if (!query) return interaction.editReply('Please specify which song you want to get the lyrics for.');
  
  let lyrics, emtitle;
  try {
    const search = await GClient.search(query, { sanitizeQuery: true });
    lyrics = await search[0].lyrics(false);
    emtitle = search[0].fullTitle;
  } catch (error) {
    interaction.editReply(`No lyrics found for ${query}: ${error.message ?? error}`);
    return 'No lyrics found';
  }

  const embeds = [];
  
  for (const m of splitMessage(lyrics, { maxLength: 3500 })) {
    if (embeds.length < 10) {
      const embed = new EmbedBuilder()
        .setDescription(m)
        .setColor('#F8AA2A');

      if (embeds.length === 0)
        embed.setTitle(emtitle);

      embeds.push(embed);
    }
  }
  interaction.editReply({ embeds });
};