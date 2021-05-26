module.exports = {
    name: 'ban',
    description: 'Bans a member!',
    execute(message, args, cmd, client) {

        if(!message.member.roles.cache.some(r=>["Overlords", "Evil Council", "Mod/Council Helper", "Mod"].includes(r.name)) )
            
            return message.channel.send('Your Kryptonite is having no power! 🤡');

        const member = message.mentions.users.first();
        if (member) {
            const memberTarger = message.guild.members.cache.get(member.id);
            memberTarger.ban();
            message.channel.send(`<@${memberTarger}> has been Struck with the Ban Hammer`);
            message.channel.send('https://tenor.com/view/thor-banned-ban-hammer-thor-hammer-thor-chris-hemsworth-gif-11035060');
        } else {
            message.channel.send("Who you gonna ban?");
        }
    }
}