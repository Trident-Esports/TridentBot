const fs = require('fs');
const inventoryModel = require('../models/inventorySchema');
const profileModel = require('../models/profileSchema');

module.exports = {
    name: "buy",
    description: "Buy an item from the store",

    async execute(message, args, profileData) {

        let STOCKDATA = JSON.parse(fs.readFileSync("game/dbs/items.json", "utf8"))

        var user = message.author
        const inventoryData = await inventoryModel.findOne({
            userID: user.id
        });

        if (!inventoryData) return message.channel.send("This user doesn't exist");
        if (!user.id) return message.channel.send("There was an arror finding your discord id");

        var gold = profileData.gold //Players gold

        let re = /^([a-z ]*)([\d]*)$/
        let matches = args.join(" ").toLowerCase().match(re)
        let bought_item = matches[1].trim().replace(/\s/g, '')
        let quantity = !isNaN(matches[2]) ? parseInt(matches[2]) : 1

        for(let [cat,items] of Object.entries(STOCKDATA)) {
            if(bought_item in items) {
                let item = items[bought_item]
                let cost = parseInt(item.value) * parseInt(quantity)
                if (gold < cost) return message.channel.send('You cannot afford to buy this item')
                await profileModel.findOneAndUpdate({
                    userID: user.id
                }, {
                    $inc: {
                        gold: -cost  //Find a way to make the cost take away for amount of items not just one
                    }
                });
                let bought_items = new Array(quantity).fill(item.emoji);
                await inventoryModel.findOneAndUpdate({
                    userID: user.id
                }, {
                    $push: {
                        items: bought_items //Find a way to push the amount of items players buy not just one
                    }
                });
                message.channel.send(`${user} just bought ${quantity} ${item.emoji}` + bought_item.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) + "!")
            }
        }

        console.log(inventoryData.items);
    }
};
