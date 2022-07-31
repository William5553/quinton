export default function(client, message) {
  if (message.author.bot) return;
  client.logger.log(message.content);
}