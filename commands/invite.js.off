module.exports = {
    name: 'invite',
    description: "This is to invite the bot into a discord server",
    execute(message, args, cmd, client) {
        BOT_INVITE = {
          "client_id": "828317713256415252",
          "scope": "bot",
          "permissions": "8589934591"
        }
        message.channel.send(
          'Invite `@VillainsBot` to your server! ' +
          '<' +
          'https://discord.com/oauth2/authorize?client_id=' + BOT_INVITE["client_id"] +
          '&scope=' + BOT_INVITE["scope"] +
          '&permissions=' + BOT_INVITE["permissions"] + '>'
        );
    }
}
