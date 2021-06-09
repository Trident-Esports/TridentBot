const {
    MessageEmbed
} = require('discord.js')
const fs = require('fs')

module.exports = {
        name: 'gamehelp',
        aliases: ['gh'],
        description: "This is a help embed",
        execute(message, args, cmd, client, Discord) {
            let props = {
                "embedColor": "#B217EE", // Purple; Default is B2EE17 (Green)
                "title": "***Game Help***",
                "emoji": "<:V1LLA1N:848458548082114570>",
                "url": "https://discord.com/KKYdRbZcPT",
                "thumbnail": "https://cdn.discordapp.com/icons/788021898146742292/a_20e3a201ee809143ac5accdf97abe607.gif"
            }
            let footer = {
                "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
                "msg": "This bot was Created by Noongar1800#1800"
            }

            let info = JSON.parse(fs.readFileSync("GAMECOMMANDS.json", "utf8"))
            var profile_commands = Object.keys(info["Profile commands"]); // list of personal command names
            var fight_commands = Object.keys(info["Fight commands"]); // list of fight command names
            var economy_commands = Object.keys(info["Economy commands"]); // list of economy command names
            var gamble_commands = Object.keys(info["Gambling commands"]); // list of gambling command names

            // Profile Commands
            var pcommandsAndInfos = [];
            for (key in profile_commands) {
                pcommandsAndInfos.push(profile_commands[key]);
            }

            for (var i = 0; i < pcommandsAndInfos.length; i++) {
                pcommandsAndInfos[i] = "`" + pcommandsAndInfos[i] + "`";
            }

            // Fight Commands
            var fcommandsAndInfos = [];
            for (key in fight_commands) {
                fcommandsAndInfos.push(fight_commands[key]);
            }

            for (var i = 0; i < fcommandsAndInfos.length; i++) {
                fcommandsAndInfos[i] = "`" + fcommandsAndInfos[i] + "`";
            }

            // Economy Commands
            var ecommandsAndInfos = [];
            for (key in economy_commands) {
                ecommandsAndInfos.push(economy_commands[key]);
            }

            for (var i = 0; i < ecommandsAndInfos.length; i++) {
                ecommandsAndInfos[i] = "`" + ecommandsAndInfos[i] + "`";
            }

            // Gamble Commans
            var gcommandsAndInfos = [];
            for (key in gamble_commands) {
                gcommandsAndInfos.push(gamble_commands[key]);
            }

            for (var i = 0; i < gcommandsAndInfos.length; i++) {
                gcommandsAndInfos[i] = "`" + gcommandsAndInfos[i] + "`";
            }

            const newEmbed = new MessageEmbed()
                .setColor(props["embedColor"])
                .setTitle(props["emoji"] + " " + props["title"])
                .setURL(props["url"])
                .setDescription('**For more info: `.help [command/item]`**\n**_Add `.` before any command_**')
                    .addField('**PROFILE COMMANDS**', `${pcommandsAndInfos.join(' , ')}`, false)
                    .addField('**ECONOMY COMMANDS**', `${ecommandsAndInfos.join(' , ')}`, false)
                    .addField('**FIGHT COMMANDS**', `${fcommandsAndInfos.join(' , ')}`, false)
                    .addField('**GAMBLE COMMANDS**', `${gcommandsAndInfos.join(' , ')}`, false)
                    .setThumbnail(props["thumbnail"])
                    .setFooter(footer["msg"], footer["image"])
                    .setTimestamp();

                    // Access info for each command name and the aliases
                    message.channel.send("I have sent some Minions to your dm's.");
                    message.channel.send("https://tenor.com/view/minions-despicable-me-cheer-happy-yay-gif-3850878");
                    message.author.send(newEmbed);
                }
        }