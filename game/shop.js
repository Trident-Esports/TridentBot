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

        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('***ItemShop***')
            .setDescription('This is the ItemShop')
            .addField('***Item***', `${iName}`, true)
            .addField('***Price***', `💰${iVal.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, true)
            .addField('***Description***', `${iDesc}`, false)
            .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
            .setTimestamp();

        message.channel.send(embed);
    }
}