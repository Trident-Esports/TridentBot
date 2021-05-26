module.exports = {
    name: 'kick',
    description: 'Kicks a member!',
    execute(message, args, cmd, client) {

        if(!message.member.roles.cache.some(r=>["Overlords", "Evil Council", "Mod/Council Helper", "Mod"].includes(r.name)) )
            
            return message.channel.send('Your Kryptonite is having no power! 🤡');

        const member = message.mentions.users.first();
        if (member) {
            const memberTarger = message.guild.members.cache.get(member.id);
            memberTarger.kick();
            message.channel.send(`${memberTarger} has been kicked from the server`);
            message.channel.send("https://tenor.com/view/missed-kick-missed-kick-minions-fail-gif-12718518")
        } else {
            message.channel.send('You could not kick that member');
        }
    }
}