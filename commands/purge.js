import { ApplicationCommandOptionType, PermissionsBitField } from 'discord.js';

export const config = {
  name: 'purge',
  description: 'Deletes the specified amount of messages.',
  enabled: true,
  dm_permission: false,
  default_member_permissions: PermissionsBitField.Flags.ManageMessages.toString(),
  options: [
    {
      name: 'amount',
      description: 'The amount of messages to delete.',
      type: ApplicationCommandOptionType.Integer,
      required: true,
      min_value: 1,
      max_value: 100
    },
    {
      name: 'user',
      description: 'The user to delete messages from.',
      type: ApplicationCommandOptionType.User,
      required: false
    }
  ]
};
    
export const execute = async (client, interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const me = interaction.guild.members.me ?? await interaction.guild.members.fetchMe();

  if (!me.permissions.has(PermissionsBitField.Flags.ManageMessages))
    return interaction.editReply("I don't have the permission **MANAGE MESSAGES**");
  interaction.channel.messages
    .fetch({ limit: 100 })
    .then(messages => {
      messages = interaction.options.getMember('user') ? [...messages.filter(m => m.author.id === interaction.options.getMember('user').id).keys()].slice(0, interaction.options.getInteger('amount')) : [...messages.keys()].slice(0, interaction.options.getInteger('amount'));
      return interaction.channel.bulkDelete(messages, true);
    })
    .then(messages => interaction.editReply({ content: `Deleted ${messages.size} messages`, ephemeral: true }));
};