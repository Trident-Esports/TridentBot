const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');


module.exports = class ShopCommand extends GameCommand {
    constructor() {
        super({
            name: 'shop',
            aliases: ["store"],
            category: 'game',
            description: 'View the store',
            extensions: ["profile", "levels", "health"]
        });
    }

    async run(client, message) {

        let props = {
            title: {
                text: "ItemShop"
            },
            description: "This is the ItemShop",
            thumbnail: "",
            footer: {
                msg: ""
            }
        }

        let itemData = JSON.parse(fs.readFileSync("game/dbs/items.json", "utf8"))

        for (let [items, itemsAttr] of Object.entries(itemData)) {
            let value = itemsAttr
            for (let [item, itemAttr] of Object.entries(value)) {
                let names = [];

                if (itemAttr?.stylized) {
                    names.push(itemAttr.stylized)
                } else {
                    names.push(item.charAt(0).toUpperCase() + item.slice(1))
                }

                let items = [];
                items.push(itemAttr.emoji);

                let values = [];
                values.push(itemAttr.value);

                let descriptions = [];
                descriptions.push(itemAttr.description);

                props.fields = [{
                    name: items + " " + names + "   " + "💰" + values.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    value: "`" + descriptions + "`",
                    inline: false
                }]
            }
        }
        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
} //FIX ME: Only shows the last item in the shop
