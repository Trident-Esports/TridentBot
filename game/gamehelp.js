const { Message, MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = {
    name: 'gamehelp',
    aliases: ['gh'],
    description: "This is a help embed",
    execute(message, args, cmd, client, Discord) {
        let props = {
            "embedColor": "#B217EE",  // Purple; Default is B2EE17 (Green)
            "title": "***Game Help***",
            "url": "https://discord.com/KKYdRbZcPT",
            "thumbnail": "https://cdn.discordapp.com/icons/788021898146742292/a_cc4d6460f0b5cc5f77d65aa198609843.gif"
        }
        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
          }
        let info = JSON.parse(fs.readFileSync("GAMECOMMANDS.json", "utf8"))

        const newEmbed = new MessageEmbed()
            .setColor(props["embedColor"])
            .setTitle(props["title"])
            .setURL(props["url"])
            .setDescription(' This is a list of commands for the VillainsBot MiniGame')
            .addField('**PERSONAL COMMANDS**', info["personal commands"]["info"], true)
            .addField('**INTERACTIVE COMMANDS**',info["interactive commands"]["info"], true)
            .addField('**GAMBLE COMMANDS**', info["gambling commands"]["info"], true)
            .setThumbnail(props["thumbnail"])
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

            // Need to show all command names under each category
            // Access info for each command name and the aliases
        message.channel.send("I have sent some Minions to your dm's.");
        message.channel.send("https://tenor.com/view/minions-despicable-me-cheer-happy-yay-gif-3850878")
        message.author.send(newEmbed);
    }
}
