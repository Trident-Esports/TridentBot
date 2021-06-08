const db = require('../models/warns')
const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: 'warns',

    async execute(message, args) {
        if (!message.member.roles.cache.some(r => ["Overlords", "Evil Council", "Mod"].includes(r.name))) return message.channel.send('You do not have permissions to use this command.')
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.channel.send('User not found.')

        db.findOne({
            guildID: message.guild.id,
            user: user.user.id
        }, async (err, data) => {
            if (err) throw err;
            if (data) {
                message.channel.send(
                    new MessageEmbed()
                    .setTitle(`${user.user.tag}'s warns`)
                    .setDescription(
                        data.content.map(
                            (w, i) =>
                            `\`${i + 1}\` | Moderator : ${message.guild.members.cache.get(w.moderator).user.tag}\nReason : ${w.reason}`
                        )
                    )
                    .setColor("BLUE")
                )
            } else {
                message.channel.send('User has no data')
            }

        })
    }
}