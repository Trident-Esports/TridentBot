const Discord = require('discord.js');

module.exports = {
    name: "shop",
    aliases: ['store'],
    description: "View the store",

    async execute(message, args, cmd, client) {

        const itemname = ['🚗*Car*', '💉*Power Potion*', '🍌*Bananas*', '🧪*Life Potion*'];
        const item_value = [2000000, 2000, 500, 200];
        const item_description = ['🚗: `TOOT TOOT! Here in my garage with my new...Lamborghini`', '💉: `Gives you a small chance of gaining an xp boost for 30 minutes`', '🍌: `Feed your minions`', '🧪: `Use to restore your health`']

        var iName = ``;
        var iVal = ``;
        var iDesc = ``;

        for (var x = 0; x < itemname.length; x++) {
            iName += `${ itemname[x] }`;
            iVal += `${ item_value[x] }`;
            iDesc += `${ item_description[x] }`;
            if (!(x == itemname.length-1)) {
                iName += `\n`;
                iVal += `\n💰`;
                iDesc += `\n`;
            }
        }

        let props = {
            "title": "***ItemShop***"
        }
        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(props["title"])
            .setDescription('This is the ItemShop')
            .addField('***Item***', `${iName}`, true)
            .addField('***Price***', `💰${iVal.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, true)
            .addField('***Description***', `${iDesc}`, false)
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        message.channel.send(embed);
    }
}
