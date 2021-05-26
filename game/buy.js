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

        let items = {
            "life potion": {
                "cost": 200,
                "icon": "🧪"
            },
            "bananas": {
                "cost": 500,
                "icon": "🍌"
            },
            "power potion": {
                "cost": 2000,
                "icon": "💉"
            },
            "car": {
                "cost": 2000000,
                "icon": "🚗"
            }
        }

        if (bought_item in items) {
            let item = items[bought_item]
            if (gold < item["gold"]) return message.channel.send('You cannot afford to buy this item')
            await profileModel.findByIdAndUpdate(
                {
                    userID: user.id
                },
                {
                    $inc: {
                        gold: item["gold"] * -1
                    }
                }
            );
            await inventoryModel.findOneAndUpdate(
                {
                    userID: user.id
                },
                {
                    $push: {
                        items: item["icon"]
                    }
                }
            );
            message.channel.send(`${user} just bought 1 ${item.icon}` + bought_item.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) + "!")
        }

        console.log(inventoryData.items);
    }
};
