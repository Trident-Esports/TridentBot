module.exports = {
    name: 'Embed',
    aliases: ['e'],
    description: "This is a help embed",
    execute(message, args, cmd, client, Discord) {
        const newEmbed = new MessageEmbed()
            .setColor('#23dd17')
            .setTitle('***Help***')
            .setURL('https://discord.gg/KKYdRbZcPT')
            .setDescription(' This is a list of the commands and help for VillainsBot')
            .addField(
                
            )
            .addField(
              
            )
            .addField(
              
            )
            .setThumbnail('https://d1fdloi71mui9q.cloudfront.net/al4c957kR4eQffCsIv3o_N5PQkEjiGc43pxbU')
            .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
            .setTimestamp();

        message.channel.send(newEmbed);
    }
}