const fs = require('fs');

module.exports = {
    name: 'kick',
    description: 'Kicks a member!',
    execute(message, args, cmd, client) {
        let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
        let DEV = GLOBALS.DEV;

        APPROVED_ROLES = [
          "Overlords",
          "Evil Council",
          "Mod"
        ]

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) )

            return message.channel.send('Your Kryptonite is having no power! 🤡');

        const member = message.mentions.users.first();
        const memberTarger = member ? message.guild.members.cache.get(member.id) : message;
        if(! DEV) {
            if (member) {
                memberTarger.kick();
                message.channel.send(`${memberTarger} has been kicked from the server`);
                message.channel.send("https://tenor.com/view/missed-kick-missed-kick-minions-fail-gif-12718518")
            } else {
                message.channel.send('You could not kick that member');
            }
        } else {
            message.channel.send(`<@${memberTarger}> *would be* kicked if this wasn't in DEV Mode`)
        }

    }
}
