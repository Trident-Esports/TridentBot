module.exports = {
    name: 'unmute',
    description: "This unmutes a member",
    execute(message, args, cmd, client) {

        if(!message.member.roles.cache.some(r=>["Overlords", "Evil Council", "Mod/Council Helper", "Mod"].includes(r.name)) )
            
        return message.channel.send("Your Kryptonite is having no power! 🤡");

        const target = message.mentions.users.first();
        if (target) {
            let mainRole = message.guild.roles.cache.find(role => role.name === 'Minions');
            let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

            let memberTarget = message.guild.members.cache.get(target.id);

            memberTarget.roles.remove(muteRole.id);
            memberTarget.roles.add(mainRole.id);
            message.channel.send(`<@${memberTarget.user.id}> has been unmuted`);
        } else {
            message.channel.send('Cant find that member!');
        }
    }
}//FIXME