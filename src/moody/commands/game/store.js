//@ts-check

const GameCommand = require('../../classes/command/gamecommand.class');
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
        super(
            {...comprops}
        )
    }

    async action(client, message) {
        let STOCKDATA = JSON.parse(fs.readFileSync("./src/game/dbs/items.json", "utf8"))

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
                        name: `${items} ${names}   ${this.emojis.gold}${values.toLocaleString()}`,
                        value: `\`${descriptions}\``,
                        inline: false
                    }
                )
            }
        }
    }

    async test(client, message) {
        let dummy = null
        dummy = new StoreCommand()
        dummy.run(client, message, [], null, "")
    }
}
