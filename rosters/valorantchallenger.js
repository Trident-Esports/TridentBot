const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'valorant challenger roster',
    aliases: ['vcr'],
    permissions: [],
    description: "Checks the user's cooldowns",
    async execute(message, client, Discord) {

        let props = {
            "embedColor": "#B2EE17",  // Color of line along left of embed
            "managers": {
                "GuessMonster": "https://twitter.com/xShadowProphetx"
            },
            "coach": {
                "Crash": "https://twitter.com/"
            },
            "main": {
                "Myth": "https://twitter.com/OCEMyth",
                "OrangePearl": "https://twitter.com/",
                "Pocket": "https://twitter.com/Pocket_VAL",
                "SUAVE": "https://twitter.com/SUAVEOCE",
                "Marsh": "https://twitter.com/MarshJW_"
            },
            "sub": {
                "TBA": "https://twitter.com/"
            }
        }
        let url = {
            "guild": "788021898146742292",
            "channel": "788558005917450251",
            "message": "813235908031676436"
        };
        let thumbnail = "https://cdn.discordapp.com/icons/788021898146742292/a_cc4d6460f0b5cc5f77d65aa198609843.gif"
        let footer = {
            "image": "https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        var newEmbed = new MessageEmbed()
            .setColor(props["embedColor"])
            .setTitle('***Valorant Challenger Roster***')
            .setURL(`https://discord.com/channels/${url.guild}/${url.channel}/${url.message}`)
            .setDescription('All Player profile\'s can be found here __https://www.tyrantesports.com/team/tyrant-valorant/__')
            .setThumbnail(thumbnail)
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        let persons = props["managers"];
        let personSTR = "";
        for (let person in persons) {
            personSTR += "[" + person + "](" + persons[person] + ")";
            personSTR += "\n";
        }
        newEmbed.addField("Manager", personSTR, false);

        persons = props["coach"];
        personSTR = "";
        for (let person in persons) {
            personSTR += "[" + person + "](" + persons[person] + ")";
            personSTR += "\n";
        }
        newEmbed.addField("Coach", personSTR, false);

        persons = props["main"];
        personSTR = "";
        for (let person in persons) {
            personSTR += "[" + person + "](" + persons[person] + ")";
            personSTR += "\n";
        }
        newEmbed.addField("Main", personSTR, false);

        persons = props["sub"];
        personSTR = "";
        for (let person in persons) {
            personSTR += "[" + person + "](" + persons[person] + ")";
            personSTR += "\n";
        }
        newEmbed.addField("Sub", personSTR, false);

        message.channel.send(newEmbed);
    }
}