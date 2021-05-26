const Discord = require('discord.js');

const inventoryModel = require('../models/inventorySchema');

const profileModel = require('../models/profileSchema');

module.exports = {
    name: "buy",
    description: "Buy an item from the store",

    async execute(message, args, cmd, client, discord, profileData) {

        var user = message.author
        const inventoryData = await inventoryModel.findOne({ userID: user.id });

        if (!inventoryData) return message.channel.send("This user doesn't exist");
        if (!user.id) return message.channel.send("There was an arror finding your discord id");

        var gold = profileData.gold

        var bought_item = args.slice(0).join(" ").toLowerCase()

        if (bought_item === 'life potion') {
            if (gold < 200) return message.channel.send('You cannot afford to buy this item')
            await profileModel.findOneAndUpdate(
                {
                    userID: user.id,
                },
                {
                    $inc: {
                        gold: -200,
                    },
                });
            await inventoryModel.findOneAndUpdate(
                {
                    userID: user.id,
                },
                {
                    $push: {
                        consumables: '🧪',
                    },
                });
            message.channel.send(`${user} just bought 1 🧪 Life Potion!`)
        }
        if (bought_item === 'power potion') {
            if (gold < 2000) return message.channel.send('You cannot afford to buy this item')
            await profileModel.findOneAndUpdate(
                {
                    userID: user.id,
                },
                {
                    $inc: {
                        gold: -2000,
                    },
                });
            await inventoryModel.findOneAndUpdate(
                {
                    userID: user.id,
                },
                {
                    $push: {
                        powers: '💉',
                    },
                });
            message.channel.send(`${user} just bought 1 💉 Power Potion!`)
        }
        if (bought_item === 'car') {
            if (gold < 2000000) return message.channel.send('You cannot afford to buy this item')
            await profileModel.findOneAndUpdate(
                {
                    userID: user.id,
                },
                {
                    $inc: {
                        gold: -2000000,
                    },
                });
            await inventoryModel.findOneAndUpdate(
                {
                    userID: user.id,
                },
                {
                    $push: {
                        items: '🚗',
                    },
                });
            message.channel.send(`${user} just bought 1 🚗 Car!`)
        }
        if (bought_item === 'bananas') {
            if (gold < 500) return message.channel.send('You cannot afford to buy this item')
            await profileModel.findOneAndUpdate(
                {
                    userID: user.id,
                },
                {
                    $inc: {
                        gold: -500,
                    },
                });
            await inventoryModel.findOneAndUpdate(
                {
                    userID: user.id,
                },
                {
                    $push: {
                        items: '🍌',
                    },
                });
            message.channel.send(`${user} just bought 1 🍌 Bananas!`)
        }

        console.log(inventoryData.items);
    }
};