export const config = {
  name: 'isittuesday',
  description: 'Determines if today is Tuesday',
  enabled: true
};

export const execute = async (client, interaction) => interaction.reply(`Today **is${new Date().getDay() === 2 ? '' : ' not'}** Tuesday.`);