const fs = require('fs');
const ms = require('ms');

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'mute',
    aliases: ['silence'],
    description: "This mutes a member",
    execute(message, args, cmd, client) {

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        APPROVED_ROLES = ROLES["admin"]

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) )
            return message.channel.send("Your Kryptonite is having no power! 🤡");


        if (target) {

            let mainRole = message.guild.roles.cache.find(role => role.name === 'Minions');
            let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

            let memberTarget = message.guild.members.cache.get(target.id);

            let msg = ""
            if(!DEV) {
                memberTarget.roles.remove(mainRole.id);
                memberTarget.roles.add(muteRole.id);
            } else {
                msg += "!! DEV !! - "
            }
            let duration = args[1] ? args[1] : 0
            msg += `<@${memberTarget.user.id}> has been muted`
            if (duration > 0) {
                msg += ` for ${ms(ms(duration))}`
            }
            message.channel.send(msg);
            message.channel.send('https://tenor.com/view/ash-mute-pokemon-role-muted-gif-12700315');

            if(!DEV) {
                if(duration > 0) {
                    setTimeout(function () {
                        memberTarget.roles.remove(muteRole.id);
                        memberTarget.roles.add(mainRole.id);
                    }, ms(duration));
                }
            }
        } else {
            message.channel.send('Cant find that member!');
        }
    }
}
