const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');

module.exports = class BuyCommand extends GameCommand {
    constructor() {
        super({
            name: 'buy',
            category: 'game',
            description: 'Buy an Item from the Store',
        });
    }

    async run(client, message, args) {

        let STOCKDATA = JSON.parse(fs.readFileSync("game/dbs/items.json", "utf8"))

        let props = {
            title: {
                text: "Buy"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        var user = message.author

        const inventoryData = await this.inventoryModel.findOne({
            userID: user.id
        });
        const profileData = await this.profileModel.findOne({
            userID: message.author.id
        });

        if (!inventoryData) return message.channel.send("This user doesn't exist");
        if (!user.id) return message.channel.send("There was an arror finding your discord id");

        var gold = profileData.gold //Players gold

        let re = /^([a-z ]*)([\d]*)$/
        let matches = args.join(" ").toLowerCase().match(re)
        let bought_item = matches[1].trim().replace(/\s/g, '')
        let quantity = !isNaN(matches[2]) ? parseInt(matches[2]) : 1

        for (let [cat, items] of Object.entries(STOCKDATA)) {
            if (bought_item in items) {
                let item = items[bought_item]
                let cost = parseInt(item.value) * parseInt(quantity)
                if (gold < cost) return message.channel.send('You cannot afford to buy this item')
                await this.profileModel.findOneAndUpdate({
                    userID: user.id
                }, {
                    $inc: {
                        gold: -cost
                    }
                });

                let bought_items = new Array(quantity).fill(item.emoji);
                await this.inventoryModel.findOneAndUpdate({
                    userID: user.id
                }, {
                    $push: {
                        items: bought_items
                    }
                });

                props.description = `${user} just bought ${quantity} ${item.emoji}` + bought_item.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) + "!"
            }
        }

        let embed = new VillainsEmbed(props)
        await message.channel.send(embed);
    }
}