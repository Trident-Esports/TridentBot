const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'bot staff',
    aliases: ['bs'],
    permissions: [],
    description: "Checks the user's cooldowns",
    async execute(message, client, Discord) {

        let props = {
            "embedColor": "#ffaf00",  // Color of line along left of embed
            "members": {
              "DaddyMike": "http://twitch.tv/miketrethewey",
              "Noongar": "http://twitch.tv/noongar1800",
              "PrimeWarGamer": "http://example.com"
            }
        }
        let thumbnail = "https://cdn.discordapp.com/icons/788021898146742292/a_cc4d6460f0b5cc5f77d65aa198609843.gif"
        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        var newEmbed = new MessageEmbed()
            .setColor(props["embedColor"])
            .setTitle('***Bot Staff Roster***')
            .setThumbnail(thumbnail)
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        let persons = props["members"];
        let personSTR = "";
        for(let person in persons) {
            personSTR += "[" + person + "](" + persons[person] + ")";
            personSTR += "\n";
        }
        newEmbed.addField("Staff",personSTR,false);

        message.channel.send(newEmbed);
    }
}
