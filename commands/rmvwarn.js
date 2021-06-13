const db = require('../models/warns')
const fs = require('fs');

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name : 'remove-warn',
    aliases: ['rmvwarn', 'removewarn'],
    async execute(message, args, cmd, client) {
        APPROVED_ROLES = ROLES["admin"]

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) )
        return message.channel.send('You do not have permission to use this command.')

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.channel.send('User not found.')
        db.findOne({ guildID: message.guild.id, user: user.user.id}, async(err,data) => {
            if(err) throw err;
            if(data) {
                let number = parseInt(args[1]) - 1
                if(DEV) {
                    message.channel.send("!! DEV !! - This user has " + data.content.length + " warns. Would delete Warn #" + (isNaN(number) ? 1 : number))
                } else {
                    data.content.splice(number, 1)
                    message.channel.send('deleted the warn')
                    data.save()
                }
            } else {
                message.channel.send('This user does not have any warns in this server!')
            }
        })
    }
}
