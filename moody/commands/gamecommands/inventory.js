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
            title: {
                text: "Inventory"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        let mentionedMember = null;
        if (args.length) {
            mentionedMember = message.mentions.members.first().user;
        } else {
            mentionedMember = message.author;
        }

        if (!mentionedMember) return message.channel.send("That user does not exist");
        const inventoryData = await this.inventoryModel.findOne({
            userID: mentionedMember.id
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

        props.description = `${mentionedMember}'s Inventory`
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

        props.thumbnail = mentionedMember.avatarURL({
            dynamic: true
        })

        let embed = new VillainsEmbed(props)
        this.send(message, embed);
    }
}