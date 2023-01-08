import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { translate, isSupported, langs, getCode } from '@william5553/translate-google-api';

export const config = {
  name: 'translate',
  description: 'Translates text to another language using Google Translate.',
  enabled: true,
  options: [
    {
      name: 'text',
      description: 'The text to translate.',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'to',
      description: 'The language to translate to.',
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: 'from',
      description: 'The language to translate from.',
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ]
}; // TODO: https://discordjs.guide/slash-commands/autocomplete.html#enabling-autocomplete
    
export const execute = async (client, interaction) => {
  if (interaction.options.getString('from') && !isSupported(interaction.options.getString('from'))) return interaction.reply(`${interaction.options.getString('from')} isn't a supported language`);
  if (interaction.options.getString('to') && !isSupported(interaction.options.getString('to'))) return interaction.reply(`${interaction.options.getString('to')} isn't a supported language`);

  await interaction.deferReply();

  translate(interaction.options.getString('text'), { from: interaction.options.getString('from'), to: interaction.options.getString('to') })
    .then(res =>
      interaction.editReply({ embeds: [
        new EmbedBuilder()
          .setColor(0x53_90_F5)
          .setTitle('Translation')
          .addFields(
            { name: '**Input**', value: `${interaction.options.getString('text')}` },
            { name: '**From**', value: `${Object.keys(langs).find(key => langs[key] === res.from.language.iso)}`, inline: true },
            { name: '**To**', value: `${Object.keys(langs).find(key => langs[key] === getCode(interaction.options.getString('to') ?? 'en'))}`, inline: true },
            { name: '**Text**', value: `${res.text}` }
          )
          .setTimestamp()
          .setFooter({ text: 'Powered by Google Translate', iconURL: 'https://www.gstatic.com/images/branding/product/1x/translate_96dp.png' })
      ]})
    );
};