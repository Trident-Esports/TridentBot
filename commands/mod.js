const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'mod',
    description: 'Mod Commands!',
    execute(message, args, cmd, client) {

        if(!message.member.roles.cache.some(r=>["Overlords", "Evil Council", "Mod/Council Helper", "Mod"].includes(r.name)) )
            
            return message.channel.send('You dont have the correct permissions');

            let props = {
                "embedColor": "#B2EE17",
                "title": "***Help***",
                "url": "https://discord.com/KKYdRbZcPT"
            }
            let footer = {
                "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
                "msg": "This bot was Created by Noongar1800#1800"
            }

        const newEmbed = new MessageEmbed()
        .setColor(props["embedColor"])
        .setTitle(props["title"])
        .setURL(props["url"])
            .addFields(
                { name: 'MOD COMMANDS', value: "Commands for only Moderators to use" },
                { name: '.purge #', value: 'Deletes the last sent messages in the channel' },
                { name: '.warn @member (reason)', value: '_Warns a member._' },
                { name: '.warns @member', value: '_Shows the Warns for a member._' },
                { name: '.rmvwarn @member', value: '_Removes a warn for a member._\n _[Aliases:Remove-warn]_' },
                { name: '.clrwarn @member', value: '_Removes all warns for a member._\n _[Aliases:Clearwarns, removewarns, remove-all-warns]_' },
                { name: '.kick @member', value: '_Kicks a member._' },
                { name: '.ban @member', value: '_Bans a member._' },
                { name: '.mute @member', value: '_Mutes a member._\n _[Aliases:Silence]_' },
                {name: '.unmute @member', value: '_Unmutes a member._'}
            )
            .setThumbnail('https://d1fdloi71mui9q.cloudfront.net/al4c957kR4eQffCsIv3o_N5PQkEjiGc43pxbU')
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        message.channel.send("I have sent a list of the mod commands to your dm's")
        message.delete
        message.author.send(newEmbed);
    }
}