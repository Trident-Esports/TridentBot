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
        // Get shop stock information
        let STOCKDATA = JSON.parse(fs.readFileSync("game/dbs/items.json", "utf8"))

        // Bail if we fail to get shop stock information
        if(!STOCKDATA) {
            this.error = true
            this.description = "Couldn't get shop stock information."
            return
        }

        this.props.fields = []

        // Build the thing
        for (let [items, itemsAttr] of Object.entries(STOCKDATA)) {
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
                        name: items + " " + names + "   " + this.emojis.gold + values.toLocaleString("en-AU"),
                        value: "`" + descriptions + "`",
                        inline: false
                    }
                )
            }
        }
    }
}
