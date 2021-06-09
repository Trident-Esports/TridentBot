const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'bonk',
    /**
     * @param {Message} message
     */
    async execute(message, args, cmd, client) {
        let bonkIcon = "🔨"

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!user)
            return message.channel.send('User not found.')

        BonkEmbed = new MessageEmbed()
            .setDescription(`${message.author} just bonked ${user}` + bonkIcon)
            .setColor('RANDOM')

        message.channel.send(BonkEmbed);

    }
}