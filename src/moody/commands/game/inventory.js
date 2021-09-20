//@ts-check

const GameCommand = require('../../classes/command/gamecommand.class');
const fs = require('fs');

module.exports = class InventoryCommand extends GameCommand {
    constructor(client) {
        let comprops = {
            name: 'inventory',
            aliases: ['i', 'inv'],
            group: 'game',
            memberName: 'inventory',
            description: 'Check a user\'s Inventory'
        }
        let props = {
            extensions: ["inventory"]
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async action(message) {
        const loaded = this.inputData.loaded

        if (!(this.error)) {
            const inventoryData = await this.db_query(loaded.id, "inventory")

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
            // console.log(inventory)

            let STOCKDATA = JSON.parse(fs.readFileSync("./src/game/dbs/items.json", "utf8"))

            let inventorySorts = {
                fromDB: {},
                toDB: {},
                flat: {},
                conversions: {
                    // emojiToKey: {},
                    emojiToCat: {}//,
                    // keyToEmoji: {},
                    // keyToCat: {}
                }
            }

            let emojiItems = {}
            for (let [cat, items] of Object.entries(STOCKDATA)) {
                for (let [itemName, itemData] of Object.entries(items)) {
                    emojiItems[itemData.emoji] = itemName
                    // inventorySorts.conversions.emojiToKey[itemData.emoji] = itemName
                    inventorySorts.conversions.emojiToCat[itemData.emoji] = cat
                    // inventorySorts.conversions.keyToEmoji[itemName] = itemData.emoji
                    // inventorySorts.conversions.keyToCat[itemName] = cat
                }
            }
            for (let cat of ["items","consumables","powers"]) {
                if (!(cat in inventorySorts.fromDB)) {
                    inventorySorts.fromDB[cat] = {}
                }
                for(let item of inventoryData[cat]) {
                    let properCat = inventorySorts.conversions.emojiToCat[item]
                    if (!(item in inventorySorts.fromDB[cat])) {
                        inventorySorts.fromDB[cat][item] = 0
                    }
                    if (!(properCat in inventorySorts.toDB)) {
                        inventorySorts.toDB[properCat] = {}
                    }
                    if (!(item in inventorySorts.toDB[properCat])) {
                        inventorySorts.toDB[properCat][item] = 0
                    }
                    if (!(item in inventorySorts.flat)) {
                        inventorySorts.flat[item] = 0
                    }
                    inventorySorts.fromDB[cat][item] += 1
                    inventorySorts.toDB[properCat][item] += 1
                    inventorySorts.flat[item] += 1
                }
            }
            // console.log(inventorySorts)

            // Nuke DB
            for (let [cat, items] of Object.entries(inventorySorts.fromDB)) {
                for (let [emojiItem, q] of Object.entries(items)) {
                    let pull = {}
                    pull[cat] = emojiItem
                    // console.log("$pull:",pull)
                    await this.db_transform(loaded.id, "$pull", pull)
                }
            }
            // Push back to DB
            for (let [cat, items] of Object.entries(inventorySorts.toDB)) {
                for (let [emojiItem, q] of Object.entries(items)) {
                    let push = {}
                    push[cat] = new Array(inventorySorts.flat[emojiItem]).fill(emojiItem)
                    // console.log("$push:",push)
                    await this.db_transform(loaded.id, "$push", push)
                }
            }

            this.props.description = `<@${loaded.id}>'s Inventory`
            this.props.fields = []

            for (let [cat, items] of Object.entries(inventorySorts.toDB)) {
                let value = Object.entries(items).length == 0 ? "Nothing" : ""
                for (let [item, q] of Object.entries(items)) {
                    value += item + '`x' + (q + "").padStart(3) + "`\n"
                }
                this.props.fields.push({
                    name: cat.charAt(0).toUpperCase() + cat.slice(1),
                    value: value,
                    inline: true
                })
            }
        }
    }

    async test(message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          message.author.username,
          message.author.id,
          client.user.username,
          "Wanrae"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new InventoryCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
