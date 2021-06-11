const fs = require('fs');

module.exports = {
    name: 'ban',
    description: 'Bans a member!',
    execute(message, args, cmd, client) {
        let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
        let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))
        let DEV = GLOBALS.DEV;

        APPROVED_ROLES = ROLES["admin"]

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) )

            return message.channel.send('Your Kryptonite is having no power! 🤡');

        const member = message.mentions.users.first();
        const memberTarger = member ? message.guild.members.cache.get(member.id) : message;
        if(! DEV) {
            if (memberTarger) {
                memberTarger.ban();
                message.channel.send(`<@${memberTarger}> has been Struck with the Ban Hammer`);
                message.channel.send('https://tenor.com/view/thor-banned-ban-hammer-thor-hammer-thor-chris-hemsworth-gif-11035060');
            } else {
                message.channel.send("Who you gonna ban?");
            }
        } else {
            message.channel.send(`<@${memberTarger}> *would be* banned if this wasn't in DEV Mode`)
        }
    }
}