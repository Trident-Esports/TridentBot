const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'survey',
    description: 'simple yes/no survey!',
    execute(message, args, cmd, client, discord){
        const channel = message.guild.channels.cache.find(c => c.name === 'survey');
        if(!channel) return message.channel.send('survey channel does not exist!');

        let messageArgs = args.join(' ');
        const embed = new MessageEmbed()
        .setColor('FADF2E')
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(messageArgs);

        channel.send(embed).then((msg) =>{
            msg.react('✔️');
            msg.react('❌');
            message.delete();
        }).catch((err)=>{
            throw err;
        });
    }
}