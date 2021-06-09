const db = require('../models/warns')
const fs = require('fs');
const { Message, MessageEmbed } = require('discord.js')

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'warn',
    /**
     * @param {Message} message
     */
    async execute(message, args, cmd, client) {
        APPROVED_ROLES = [
          "Overlords",
          "Evil Council",
          "Mod"
        ]

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) )
            return message.channel.send('You do not have permissions to use this command.')

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!user)
            return message.channel.send('User not found.')

        const reason = args.slice(1).join(" ")

        let msg = "[]"
        db.findOne({ guildID: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (DEV) {
                msg = "!! DEV !! - Warned for " + reason
            } else {
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
                msg = `You have been warned for ${reason}`
            }
        });
        msg = ""
        if(DEV) {
            msg += "!! DEV !! - "
        }
        msg += `Warned ${user} for ${reason}`
        user.send(new MessageEmbed()
            .setDescription(msg)
            .setColor("RED")
        )
        message.channel.send(new MessageEmbed()
            .setDescription(msg)
            .setColor('RED')
        )
    }
}
