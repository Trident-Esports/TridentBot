module.exports = {
    name: 'ping',
    description: "This is a ping command",
    execute(message, args, cmd, client) {
        message.channel.send('Pong!');
        message.channel.send('https://tenor.com/view/cat-ping-pong-funny-animals-cats-gif-8766860')
    }
}