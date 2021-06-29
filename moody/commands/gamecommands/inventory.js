const { prop } = require('cheerio/lib/api/attributes');
const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class InventoryCommand extends GameCommand {
    constructor() {
        super({
            name: 'inventory',
            aliases: ['i', 'inv'],
            category: 'game',
            description: 'Check a users Inventory',
            extensions: ["inventory"]
        });
    }

    async run(client, message, args) {
        let props = {
            caption: {
                text: "Inventory"
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
        const target = message.mentions.members.first()
        const loaded = target ? target.user : user
        props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }

        if (loaded?.bot && loaded.bot) {
            props.title.text = "Error"
            props.description = this.errors.cantActionBot.join("\n")
        }

        if (props.title.text != "Error") {
            if (target) {
                props.players.target = {
                    name: target.username,
                    avatar: target.user.displayAvatarURL({ format: "png", dynamic: true })
                }
            }

            const inventoryData = await this.inventoryModel.findOne({
                userID: loaded.id
            });

            let inventory = {}
            for (let cat of ["items","consumables","powers"]) {
                if (!(cat in inventory)) {
                    inventory[cat] = {}
                }
                for(let item of inventoryData[cat]) {
                    if (!(item in inventory[cat])) {
                        inventory[cat][item] = 0
                    }
                    inventory[cat][item] += 1
                }
            }

            props.description = `<@${loaded.id}>'s Inventory`
            props.fields = []

            for (let [cat, items] of Object.entries(inventory)) {
                let value = Object.entries(items).length == 0 ? "Nothing" : ""
                for (let [item, q] of Object.entries(items)) {
                    value += item + '`x' + (q + "").padStart(3) + "`\n"
                }
                props.fields.push({
                    name: cat.charAt(0).toUpperCase() + cat.slice(1),
                    value: value,
                    inline: true
                })
            }
        }

        let embed = new VillainsEmbed(props)
        this.send(message, embed);
    }
}
