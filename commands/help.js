const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: "This is a help embed",
    execute(message, args, cmd, client, Discord) {

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
            .setDescription(' This is a list of the commands and help for VillainsBot.\nIf you would like a list of commands for the MiniGame please type _.gamehelp_')
            .addFields(
                { name: '**COMMANDS**', value: 'List of commands' },
                { name: '`.help`', value: '_Brings up this menu\n_ [Aliases: h]' },
                { name: '`.invite`', value: '_Invite Link to Villains Esports Discord_' },
                { name: '`.discord`', value: '_Invite Link to VillainsBot Discord_' },
                { name: '`.socials`', value: '_Link to all Villains Esports Socials_' },
                { name: '`.rules`', value: '_List of rules for the server_' },
                { name: '`.suggest`', value: '_Make a suggestion for the server/bot/etc._' },
                {name: '`.survey`', value: 'creates a yes/no survey for whatever you specify'}
                )
            .addFields(
                { name: '**MUSIC COMMANDS**', value: "List of commands for listening to music. Must be in a Voice Channel for these to work!" },
                { name: '`.play`', value: '_To play a song you specify_\n [Aliases: p]' },
                { name: '`.skip`', value: '_Skips to the next song in the queue_\n [Aliases: next]' },
                { name: '`.stop`', value: '_Stops the music and makes the bot leave_' },
                { name: '`.leave`', value: "_Tells the bot to Leave your Voice Channel_" }
                )
            .addFields(
                { name: '**OTHER COMMANDS**', value: 'Extra commands' },
                { name: '`.ping`', value: '_pong!_' },
                { name: '`.image`', value: '_searches google for an image specified_' },
                {name: '`.weather`', value: '_Tells you the weather for the city provided_'}
            )
            .setThumbnail('https://d1fdloi71mui9q.cloudfront.net/al4c957kR4eQffCsIv3o_N5PQkEjiGc43pxbU')
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        message.channel.send("I have sent some Minions to your dm's.");
        message.channel.send("https://tenor.com/view/minions-despicable-me-cheer-happy-yay-gif-3850878")
        message.delete
        message.author.send(newEmbed);
    }
}