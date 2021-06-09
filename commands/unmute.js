const fs = require('fs');

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'unmute',
    description: "This unmutes a member",
    execute(message, args, cmd, client) {

        APPROVED_ROLES = [
          "Overlords",
          "Evil Council",
          "Mod"
        ]

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) )
        return message.channel.send("Your Kryptonite is having no power! 🤡");

        const target = message.mentions.users.first();
        if (target) {
            let mainRole = message.guild.roles.cache.find(role => role.name === 'Minions');
            let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

            let memberTarget = message.guild.members.cache.get(target.id);

            let msg = ""

            if(!DEV) {
                memberTarget.roles.remove(muteRole.id);
                memberTarget.roles.add(mainRole.id);
            } else {
                msg += " !! DEV !! - "
            }
            msg += `<@${memberTarget.user.id}> has been unmuted`;
            message.channel.send(msg);
        } else {
            message.channel.send('Cant find that member!');
        }
    }
}
