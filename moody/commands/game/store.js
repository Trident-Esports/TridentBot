const GameCommand = require('../../classes/gamecommand.class');

const fs = require('fs');


module.exports = class StoreCommand extends GameCommand {
    constructor() {
        let comprops = {
            name: 'store',
            aliases: ["shop"],
            category: 'game',
            description: 'View the store',
            extensions: ["profile", "levels", "health"]
        }
        super(comprops)
    }

    async action(client, message) {
        let itemData = JSON.parse(fs.readFileSync("game/dbs/items.json", "utf8"))

        this.props.fields = []

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

                this.props.fields.push(
                    {
                        name: items + " " + names + "   " + "💰" + values.toLocaleString("en-AU"),
                        value: "`" + descriptions + "`",
                        inline: false
                    }
                )
            }
        }
    }
}
