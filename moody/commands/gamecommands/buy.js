const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');

module.exports = class BuyCommand extends GameCommand {
    constructor() {
        super({
            name: 'buy',
            category: 'game',
            description: 'Buy an Item from the Store',
            extensions: [ "inventory", "profile" ]
        });
    }

    async run(client, message, args) {

        let STOCKDATA = JSON.parse(fs.readFileSync("game/dbs/items.json", "utf8"))
        let emojiItems = {}
        for (let [cat, items] of Object.entries(STOCKDATA)) {
            for (let [itemName, itemData] of Object.entries(items)) {
                emojiItems[itemData.emoji] = itemName
            }
        }

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

        if (!inventoryData) {
            props.title.text = "Error"
            props.description = "This user doesn't exist."
        }
        if (!user.id) {
            props.title.text = "Error"
            props.description = "There was an error finding your Discord ID."
        }

        var gold = profileData.gold //Players gold

        let re = /^([a-z ]*)([\d]*)$/
        let matches = args.join(" ").toLowerCase().match(re)
        let bought_item = ""
        let quantity = -1
        if (matches) {
            bought_item = matches[1].trim().replace(/\s/g, '')
            quantity = ((!isNaN(matches[2])) && (matches[2] != "")) ? parseInt(matches[2]) : 1
        } else if (args[0] in emojiItems) {
            bought_item = emojiItems[args[0]]
            re = /([\d]*)/
            matches = args.join(" ").toLowerCase().match(re)
            quantity = ((!isNaN(matches[2])) && (matches[2] != "")) ? parseInt(matches[2]) : 1
        }

        if (bought_item == "") {
            props.title.text = "Error"
            props.description = "No item name given."
        }

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

                props.description = `${user} just bought `
                props.description += `${quantity} `
                props.description += `${item.emoji}`
                props.description += (item?.stylized ? item.stylized : (bought_item.slice(0,1).toUpperCase() + bought_item.slice(1)))
                props.description += "!"
            }
        }

        if (props.description == "") {
            props.title.text = "Error"
            props.description = `Item doesn't exist. ${bought_item} given.`
        }

        let embed = new VillainsEmbed(props)
        await message.channel.send(embed);
    }
}