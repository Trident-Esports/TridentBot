const Discord = require('discord.js');

const inventoryModel = require('../models/inventorySchema')

module.exports = {
    name: "inventory",
    aliases: ['inv', 'i'],
    description: "View the players inventory",

    async execute(message, args, cmd, client) {

        var user = message.author || message.mentions.members.first();
        const inventoryData = await inventoryModel.findOne({ userID: user.id });

        var tempItems = [];
        var placedItems = [];

        for (var x = 0; x < inventoryData.items.length; x++) {
            tempItems.push(inventoryData.items[x]);
        }

        console.log(inventoryData.items);

        var placed = false;
        for (var x = 0; x < tempItems.length; x++) {
            placed = false;
            for (var y = 0; y < placedItems.length; y++) {
                if (tempItems[x] == placedItems[y][0]) {
                    placedItems[y][1]++;
                    placed = true;
                }
            }
            if (!placed) {
                placedItems.push([tempItems[x], 1]);
            }
        }

        var newItems = ``;

        for (var x = 0; x < placedItems.length; x++) {
            newItems += `${placedItems[x][0]} x ${placedItems[x][1]}`;
            if (x != placedItems.length-1) {
                newItems += `\n`;
            }
        }

        if (newItems === ``)
        newItems = 'Nothing'

        var tempConsumables = [];
        var placedConsumables = [];

        for (var x = 0; x < inventoryData.consumables.length; x++) {
            tempConsumables.push(inventoryData.consumables[x]);
        }

        console.log(inventoryData.consumables);

        var placed = false;
        for (var x = 0; x < tempConsumables.length; x++) {
            placed = false;
            for (var y = 0; y < placedConsumables.length; y++) {
                if (tempConsumables[x] == placedConsumables[y][0]) {
                    placedConsumables[y][1]++;
                    placed = true;
                }
            }
            if (!placed) {
                placedConsumables.push([tempConsumables[x], 1]);
            }
        }

        var newConsumables = ``;

        for (var x = 0; x < placedConsumables.length; x++) {
            newConsumables += `${placedConsumables[x][0]} x ${placedConsumables[x][1]}`;
            if (x != placedConsumables.length-1) {
                newConsumables += `\n`;
            }
        }

        if (newConsumables === ``)
        newConsumables = 'Nothing'

        var tempPowers = [];
        var placedPowers = [];

        for (var x = 0; x < inventoryData.powers.length; x++) {
            tempPowers.push(inventoryData.powers[x]);
        }

        console.log(inventoryData.powers);

        var placed = false;
        for (var x = 0; x < tempPowers.length; x++) {
            placed = false;
            for (var y = 0; y < placedPowers.length; y++) {
                if (tempPowers[x] == placedPowers[y][0]) {
                    placedPowers[y][1]++;
                    placed = true;
                }
            }
            if (!placed) {
                placedPowers.push([tempPowers[x], 1]);
            }
        }

        var newPowers = ``;

        for (var x = 0; x < placedPowers.length; x++) {
            newPowers += `${placedPowers[x][0]} x ${placedPowers[x][1]}`;
            if (x != placedPowers.length-1) {
                newPowers += `\n`;
            }
        }

        if (newPowers === ``)
        newPowers = 'Nothing'

        console.log(newItems, newConsumables, newPowers);

        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`***${message.author}'s Inventory***`)
            .addField('***Items***', newItems, true)
            .addField('***Consumables***', newConsumables, true)
            .addField('***Powers***', newPowers, true)
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        message.channel.send(embed);
    }
}
