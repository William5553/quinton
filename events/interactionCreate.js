import { EmbedBuilder } from 'discord.js';

export default async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(client, interaction);
  } catch (error) {
    client.logger.error(error.stack ?? error);

    return interaction.reply({ ephemeral: true, embeds: [
      new EmbedBuilder()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/quinton/issues')
        .addFields(
          { name: '**Command**', value: interaction.commandName, inline: true },
          { name: '**Options**', value: `${JSON.stringify(interaction.options.data, { depth: 2 })}` }
        )
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
    ]});
  }
};