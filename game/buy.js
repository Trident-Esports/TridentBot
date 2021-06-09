const inventoryModel = require('../models/inventorySchema');
const profileModel = require('../models/profileSchema');

module.exports = {
    name: "buy",
    description: "Buy an item from the store",

    async execute(message, args, profileData) {

        var user = message.author
        const inventoryData = await inventoryModel.findOne({
            userID: user.id
        });

        if (!inventoryData) return message.channel.send("This user doesn't exist");
        if (!user.id) return message.channel.send("There was an arror finding your discord id");

        var gold = profileData.gold //Players gold

        var bought_item = args.slice(0).join(" ").toLowerCase() //Name of the item
        var amount_item = Math.round(args[1]) //For multiple items

        if (isNaN(amount_item)) return message.channel.send('Please specify a real amount of the item you would like to buy')

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
            if (gold < items["cost"]) return message.channel.send('You cannot afford to buy this item')
            await profileModel.findOneAndUpdate({
                userID: user.id
            }, {
                $inc: {
                    gold: item["cost"] //Find a way to make the cost take away for amount of items not just one
                }
            });
            await inventoryModel.findOneAndUpdate({
                userID: user.id
            }, {
                $push: {
                    items: item["icon"] //Find a way to push the amount of items players buy not just one
                }
            });
            message.channel.send(`${user} just bought 1 ${item.icon}` + bought_item.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) + "!")
        }

        console.log(inventoryData.items);
    }
};