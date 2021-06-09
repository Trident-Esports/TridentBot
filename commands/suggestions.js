const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'suggestions',
    aliases: ['suggest', 'suggestion'],
    permissions: [],
    description: 'creates a suggestion!',
    execute(message, args, cmd, client, Discord) {
        const channel = message.guild.channels.cache.find(c => c.name === '❓suggestions❓');
        if (!channel) return message.channel.send('suggestions channel does not exist!');

        let messageArgs = args.join(' ');
        const embed = new MessageEmbed()
            .setColor('#23dd17')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(messageArgs);

        channel.send(embed).then((msg) => {
            msg.react('👍');
            msg.react('👎');
            message.delete();
        }).catch((err) => {
            throw err;
        });
    }
}