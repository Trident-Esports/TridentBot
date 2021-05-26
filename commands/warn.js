const db = require('../models/warns')
const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'warn',
    /**
     * @param {Message} message
     */
    async execute(message, args, cmd, client) {
        if (!message.member.roles.cache.some(r => ["Overlords", "Evil Council", "Mod/Council Helper", "Mod"].includes(r.name)))
            return message.channel.send('You do not have permissions to use this command.')

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!user)
            return message.channel.send('User not found.')

        const reason = args.slice(1).join(" ")

        db.findOne({ guildID: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                data = new db({
                    guildID: message.guild.id,
                    user: user.user.id,
                    content: [
                        {
                            moderator: message.author.id,
                            reason: reason
                        }
                    ]
                })
            } else {
                const obj = {
                    moderator: message.author.id,
                    reason: reason
                }
                data.content.push(obj)
            }
            data.save()
        });
        user.send(new MessageEmbed()
            .setDescription(`You have been warned for ${reason}`)
            .setColor("RED")
        )
        message.channel.send(new MessageEmbed()
            .setDescription(`Warned ${user} for ${reason}`).setColor('RED')
        )
    }
}