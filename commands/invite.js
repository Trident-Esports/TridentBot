module.exports = {
    name: 'invite',
    description: "This is to invite the bot into a discord server",
    execute(message, args, cmd, client) {
        message.channel.send('https://discord.com/oauth2/authorize?client_id=828317713256415252&scope=bot&permissions=8589934591');
    }
}