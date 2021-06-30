const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');


module.exports = class StoreCommand extends GameCommand {
    constructor() {
        super({
            name: 'store',
            aliases: ["shop"],
            category: 'game',
            description: 'View the store',
            extensions: ["profile", "levels", "health"]
        });
    }

    async run(client, message) {

        let props = {
            caption: {
                text: "Shop"
            },
            title: {},
            description: "",
            footer: {
                msg: ""
            },
            players: {
                user: {},
                target: {}
            }
        }

        const user = message.author
        props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }

        let itemData = JSON.parse(fs.readFileSync("game/dbs/items.json", "utf8"))

        props.fields = []

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

                props.fields.push(
                    {
                        name: items + " " + names + "   " + "💰" + values.toLocaleString("en-AU"),
                        value: "`" + descriptions + "`",
                        inline: false
                    }
                )
            }
        }
        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
}
