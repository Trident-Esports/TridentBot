const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'rules',
    description: "Rules to follow!",
    execute(message, args, cmd, client, Discord) {
        const newEmbed = new MessageEmbed()
            .setColor('#23dd17')
            .setTitle('Rules')
            .setURL('https://discord.gg/NtP24Gdbzd')
            .setDescription('Any breaking of these rules will result in consequences')
            .addFields(
                { name: '**Rule 1**', value: '`Be respectful to everyone (aka dont be a dick, or a hero)`' },
                { name: '**Rule 2**', value: '`Use the suitable chat for what youre talking about.`' },
                { name: '**Rule 3**', value: '`Dont be obnoxious`' },
                { name: '**Rule 4**', value: '`Dont spam`' },
                { name: '**Rule 5**', value: '`Be respectful around controversial issue`' },
                { name: '**Rule 6**', value: '`No promoting Twitch or Youtube streams (unless in #🗣-self-promote)`' },
                { name: '**Rule 7**', value: '`No impersonating staff members`' },
                { name: '**Rule 8**', value: '`No posting of porn/nudity/sexual pictures (instant ban)`' },
                { name: '**Rule 9**', value: '`No advertising servers`' }
            )
            .setThumbnail('https://d1fdloi71mui9q.cloudfront.net/al4c957kR4eQffCsIv3o_N5PQkEjiGc43pxbU')
            .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
            .setTimestamp();

        message.channel.send(newEmbed);
    }


}