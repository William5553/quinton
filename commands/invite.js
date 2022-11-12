import { EmbedBuilder, OAuth2Scopes, PermissionsBitField } from 'discord.js';

export const config = {
  name: 'invite',
  description: 'Sends an invite link for the bot',
  enabled: true
};
  
export const execute = async (client, interaction) => {
  if (!client.application.botPublic && !client.owners.includes(interaction.member.id))
    return interaction.reply({ content: 'The bot is private.', ephemeral: true });
  const url = client.generateInvite({ permissions: PermissionsBitField.All, scopes: [ OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands ]});
  interaction.reply({embeds: [
    new EmbedBuilder()
      .setColor(0x00_AE_86)
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }), url})
      .setDescription(`[Invite me](${url})`)
  ]});
};