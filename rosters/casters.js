// const { MessageEmbed } = require("discord.js");

// module.exports = {
//     name: 'caster roster',
//     aliases: ['cr'],
//     permissions: [],
//     description: "Checks the user's cooldowns",
//     async execute(message, client, Discord) {

//         var newEmbed = new MessageEmbed()
//             .setColor('#23dd17')
//             .setTitle('***Caster Roster***')
//             .setURL('https://discord.com/channels/788021898146742292/788558005917450251/815180874739089418')
//             .setDescription('All Content Creator profile\'s can be found here __Link.to.website.team.page/here__')
//             .addField('Manager', `[TBA](https://www.twitch.tv/)`, false)
//             .addField('Caster', `[Smokeyy](https://www.twitch.tv/smokeyy03)\n[ScubaSteve](https://www.twitch.tv/scubasteve835)`, false)
//             .setThumbnail('https://d1fdloi71mui9q.cloudfront.net/al4c957kR4eQffCsIv3o_N5PQkEjiGc43pxbU')
//             .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
//             .setTimestamp();

//         message.channel.send(newEmbed);
//     }
// }
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'caster roster',
    aliases: ['cr'],
    permissions: [],
    description: "Checks the user's cooldowns",
    async execute(message, client, Discord) {

        let props = {
            "embedColor": "#B2EE17",  // Color of line along left of embed
            "managers": {
              "TBA": "http://twitch.tv"
            },
            "casters": {
              "Smokeyy": "http://twitch.tv/smokeyy03",
              "ScubaSteve": "http://twitch.tv/scubasteve835"
            }
        }
        let url = {
          "guild": "788021898146742292",
          "channel": "788558005917450251",
          "message": "815180874739089418"
        };
        let thumbnail = "https://cdn.discordapp.com/icons/788021898146742292/a_cc4d6460f0b5cc5f77d65aa198609843.gif"
        let footer = {
            "image": "https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        var newEmbed = new MessageEmbed()
            .setColor(props["embedColor"])
            .setTitle('***Caster Roster***')
            .setURL(`https://discord.com/channels/${url.guild}/${url.channel}/${url.message}`)
            .setDescription('All Content Creator profile\'s can be found here __Link.to.website.team.page/here__')
            .setThumbnail(thumbnail)
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        let persons = props["managers"];
        let personSTR = "";
        for(let person in persons) {
            personSTR += "[" + person + "](" + persons[person] + ")";
            personSTR += "\n";
        }
        newEmbed.addField("Manager",personSTR,false);

        persons = props["casters"];
        personSTR = "";
        for(let person in persons) {
            personSTR += "[" + person + "](" + persons[person] + ")";
            personSTR += "\n";
        }
        newEmbed.addField("Caster",personSTR,false);

        message.channel.send(newEmbed);
    }
}