const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'bonk',
    
    async execute(message, args) {

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!user)
            return message.channel.send('User not found.')

        BonkEmbed = new MessageEmbed()
            .setDescription(`${message.author} just bonked ${user}🔨`)
            .setColor('RANDOM')

        message.channel.send(BonkEmbed);

    }
}