import { createRequire } from 'node:module';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, BaseInteraction } from 'discord.js';

export { setTimeout as wait } from 'node:timers/promises';
export const randomItem = array => array[Math.floor(Math.random() * array.length)];
export const require = createRequire(import.meta.url);
export const splitMessage = (content, options = {}) => {
  const maxLength = options.maxLength ?? 2000;
  const char = options.char ?? '\n';
  const prepend = options.prepend ?? '';
  const append = options.append ?? '';
  if (content.length <= maxLength) return [content];
  const splitText = content.split(char);
  if (splitText.some(piece => piece.length > maxLength)) throw new RangeError('SPLIT_MAX_LEN');
  const messages = [];
  let msg = '';
  for (const piece of splitText) {
    if (msg && (msg + char + piece + append).length > maxLength) {
      messages.push(prepend + msg + append);
      msg = '';
    }
    msg += (msg && piece !== '' ? char : '') + piece;
  }
  return messages.concat(prepend + msg + append);
};

export const confirm = async (interaction, author, time = 30_000) => {
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger)
    );

  if (interaction instanceof BaseInteraction)
    interaction.editReply({ components: [row] });
  else
    interaction = await interaction.channel.send({ content: 'Are you sure?', components: [row] });
  const filter = i => i.user.id === author.id;
  try {
    const buttonInteraction = await interaction.channel.awaitMessageComponent({ filter, time });
    if (buttonInteraction.customId === 'confirm') {
      await buttonInteraction.reply({ content: 'Confirmed.', ephemeral: true });
      interaction.editReply({ components: [] });
      return true;
    }
    await buttonInteraction.reply({ content: 'Cancelled.', ephemeral: true });
    interaction.editReply({ components: [] });
    return false;
  } catch {
    await interaction.editReply({ content: 'Timed out.', components: [] });
    return false;
  }
};