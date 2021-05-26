const ms = require('ms');
module.exports = {
    name: 'mute',
    aliases: ['silence'],
    description: "This mutes a member",
    execute(message, args, cmd, client) {

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!message.member.roles.cache.some(r => ["Overlords", "Evil Council", "Mod/Council Helper", "Mod"].includes(r.name)))

            return message.channel.send("Your Kryptonite is having no power! 🤡");


        if (target) {

            let mainRole = message.guild.roles.cache.find(role => role.name === 'Minions');
            let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

            let memberTarget = message.guild.members.cache.get(target.id);

            if (!args[1]) {
                memberTarget.roles.remove(mainRole.id);
                memberTarget.roles.add(muteRole.id);
                message.channel.send(`<@${memberTarget.user.id}> has been muted`);
                message.channel.send('https://tenor.com/view/ash-mute-pokemon-role-muted-gif-12700315');
                return
            }
            memberTarget.roles.remove(mainRole.id);
            memberTarget.roles.add(muteRole.id);
            message.channel.send(`<@${memberTarget.user.id}> has been muted for ${ms(ms(args[1]))}`);
            message.channel.send('https://tenor.com/view/ash-mute-pokemon-role-muted-gif-12700315');

            setTimeout(function () {
                memberTarget.roles.remove(muteRole.id);
                memberTarget.roles.add(mainRole.id);
            }, ms(args[1]));
        } else {
            message.channel.send('Cant find that member!');
        }
    }
}