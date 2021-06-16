const fs = require('fs');
const db = require('../models/warns')

module.exports = {
    name : 'remove-all-warns',
    aliases: [
      'clearwarns',
      'clrwarns',
      'removewarns'
    ],
    async execute(message, args) {
        let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
        let DEV = GLOBALS.DEV;
        let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))

        APPROVED_ROLES = ROLES["admin"]

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name))) return message.channel.send('You do not have permission to use this command.')
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.channel.send('User not found.')
        db.findOne({ guildID: message.guild.id, user: user.user.id}, async(err,data) => {
            if(err) throw err;
            if(data) {
                if(! DEV) {
                    await db.findOneAndDelete({ user : user.user.id, guildID: message.guild.id})
                    message.channel.send(`Cleared ${user.user.tag}'s warns`)
                } else {
                    message.channel.send(`${user.user.tag}'s warns *would be* cleared if this wasn't in DEV Mode`)
                }
            } else {
                message.channel.send('This user does not have any warns in this server!')
            }
        })
    }
}
