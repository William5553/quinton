export default async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(client, interaction);
  } catch (error) {
    client.logger.error(error.stack ?? error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
};