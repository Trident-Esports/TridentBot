const {
    MessageEmbed
} = require('discord.js');
const fs = require('fs');
const inventoryModel = require('../models/inventorySchema');

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: "inventory",
    aliases: ['inv', 'i'],
    description: "View the players inventory",

    async execute(message,args) {

        let stripe = defaults["stripe"]

        let props = {}
        
        switch (stripe) {
            default:
                stripe = "RANDOM";
                break;
        }
    
        // Hack in my stuff to differentiate
        if (DEV) {
            stripe = GLOBALS["stripe"]
            defaults.footer = GLOBALS.footer
        }
    
        props["stripe"] = stripe

        let mentionedMember = null;
        if (args.length) {
            mentionedMember = message.mentions.members.first().user;
        } else {
            mentionedMember = message.author;
        }

        if (!mentionedMember) return message.channel.send("That user does not exist");
        const inventoryData = await inventoryModel.findOne({
            userID: mentionedMember.id
        });

        var tempItems = [];
        var placedItems = [];

        for (var x = 0; x < inventoryData.items.length; x++) {
            tempItems.push(inventoryData.items[x]);
        }

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
            if (x != placedItems.length - 1) {
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
            if (x != placedConsumables.length - 1) {
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
            if (x != placedPowers.length - 1) {
                newPowers += `\n`;
            }
        }

        if (newPowers === ``)
            newPowers = 'Nothing'

        console.log(newItems, newConsumables, newPowers);

        let msg = `***${mentionedMember}'s Inventory***`

        const embed = new MessageEmbed()
            .setColor(props.stripe)
            .setDescription(msg)
            .addField('***Items***', newItems, true)
            .addField('***Consumables***', newConsumables, true)
            .addField('***Powers***', newPowers, true)
            .setFooter(defaults.footer.msg, defaults.footer.image)
            .setTimestamp();

        message.channel.send(embed);
    }
}