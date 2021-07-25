/*

Command for Shop transactions

BaseCommand
 VillainsCommand
  GameCommand
   ShopCommand

*/

const GameCommand = require('./gamecommand.class');

const fs = require('fs')

module.exports = class ShopCommand extends GameCommand {
    constructor(comprops = {}) {
        super({
            name: comprops.name,
            aliases: comprops.aliases,
            category: 'game',
            description: comprops.description,
            extensions: comprops.extensions,
            flags: {
                user: "required",
                target: "invalid",
                bot: "invalid"
            }
        })
    }

    async action(client, message) {
        const loaded = this.inputData.loaded

        if (!(this.error)) {
            const inventoryData = await this.db_query(loaded.id, "inventory")
            const profileData = await this.db_query(loaded.id, "profile")

            if (!inventoryData) {
                this.error = true
                this.props.description = this.errors.game.mongoDB.noInventory.join("\n")
                return
            }
            if (!profileData) {
                this.error = true
                this.props.description = this.errors.game.mongoDB.noProfile.join("\n")
                return
            }

            if (!(this.error)) {
                let STOCKDATA = JSON.parse(fs.readFileSync("game/dbs/items.json", "utf8"))

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
                        inventorySorts.flat[itemData.emoji] = 0
                        // inventorySorts.conversions.emojiToKey[itemData.emoji] = itemName
                        inventorySorts.conversions.emojiToCat[itemData.emoji] = cat
                        // inventorySorts.conversions.keyToEmoji[itemName] = itemData.emoji
                        // inventorySorts.conversions.keyToCat[itemName] = cat
                    }
                }

                let gold = profileData.gold //Players gold

                let re = /^([a-z ]*)([\d]*)$/
                let selected_item = ""
                let quantity = -1
                if (this?.inputData?.args && this.inputData.args[0] && this.inputData.args[0].trim().length > 0) {
                    let matches = this.inputData.args.join(" ").toLowerCase().match(re)
                    if (matches) {
                        selected_item = matches[1].trim().replace(/\s/g, '')
                        quantity = ((!isNaN(matches[2])) && (matches[2] != "")) ? parseInt(matches[2]) : 1
                    } else if (this.inputData.args[0].toLowerCase() in emojiItems) {
                        selected_item = emojiItems[this.inputData.args[0].toLowerCase()]
                        re = /([\d]*)/
                        let tmp = this.inputData.args
                        tmp.shift()
                        matches = tmp.join(" ").toLowerCase().match(re)
                        quantity = ((!isNaN(matches[1])) && (matches[1] != "")) ? parseInt(matches[1]) : 1
                    }
                }

                if (!(this?.props?.title)) {
                    this.props.title = {}
                }

                if (selected_item == "") {
                    this.error = true
                    this.props.description = "No item name given."
                    return
                }
                if (quantity == -1) {
                    this.error = true
                    this.props.description = `Invalid quantity. '${quantity}' given.`
                    return
                }

                let [cat, items] = [null, null]
                let item = null
                for ([cat, items] of Object.entries(STOCKDATA)) {
                    if (selected_item in items) {
                        item = items[selected_item]
                        item.name = selected_item
                        if (!("stylized" in item)) {
                            item.stylized = item.name.charAt(0).toUpperCase() + item.name.slice(1)
                        }
                        break
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

                if (item) {
                    if (["Buy"].includes(this.props.caption.text)) {
                        // Buy
                        let cost = parseInt(item.value) * parseInt(quantity)
                        if (gold < cost) return message.channel.send('You cannot afford to buy this item')
                        await this.db_transform(loaded.id, "gold", -cost)

                        let selected_items = new Array(quantity).fill(item.emoji);
                        await this.db_transform(loaded.id, "$push", { items: selected_items })

                        this.props.description = `<@${loaded.id}> just bought `
                        this.props.description += `${quantity} `
                        this.props.description += `${item.emoji}`
                        this.props.description += (item?.stylized ? item.stylized : (selected_item.charAt(0).toUpperCase() + selected_item.slice(1)))
                        this.props.description += "!"
                    } else if (["Use"].includes(this.props.caption.text)) {
                        // Use
                        this.props.fields = []
                        let haveEnough = inventorySorts.flat[item.emoji] >= quantity
                        if (haveEnough) {
                            this.props.description = []
                            if (item.name == "bananas") {
                                // Bananas
                                let q = quantity

                                // Pull All
                                let pull = {}
                                pull[inventorySorts.conversions.emojiToCat[item.emoji]] = item.emoji
                                await this.db_transform(loaded.id, "$pull", pull)

                                // Put back minus q
                                let push = {}
                                push[inventorySorts.conversions.emojiToCat[item.emoji]] = new Array(inventorySorts.flat[item.emoji] - q).fill(item.emoji)
                                await this.db_transform(loaded.id, "$push", push)

                                this.props.description = [
                                    `<@${loaded.id}> just used ${q} ${item.emoji}${item.stylized}.`,
                                    "Their minions are now happily satisfied."
                                ]

                                let [probMin, probMax] = [0, 100]
                                let number = Math.round(Math.random() * (probMax - probMin)) + probMin
                                let minions = Math.round(profileData.minions / 4)

                                let success = 4
                                let fail = 99
                                let special = 100

                                if (number <= success) {
                                    await this.db_transform(loaded.id, "xpboost", 25)
                                    this.props.description.push("You have fed your minions and they are now by your side, gained:")
                                    this.props.fields.push({
                                        name: `${this.emojis.xpboost}25%`,
                                        value: "XPBoost"
                                    })
                                } else if (number <= fail) {
                                    // do nothing
                                } else if (number <= special) {
                                    await this.db_transform(loaded.id, "minions", minions)
                                    this.props.description.push(`Wait, what is this?!? Your minions have just multiplied. You just gained ${this.emojis.minions}${minions} Minions!`)
                                    this.props.fields.push({
                                        name: `${this.emojis.minions}${minions}`,
                                        value: "Minions"
                                    })
                                }
                            } else if (item.name == "lifepotion") {
                                // Life Potion
                                let q = quantity

                                // Pull All
                                let pull = {}
                                pull[inventorySorts.conversions.emojiToCat[item.emoji]] = item.emoji
                                await this.db_transform(loaded.id, "$pull", pull)

                                // Put back minus q
                                let push = {}
                                push[inventorySorts.conversions.emojiToCat[item.emoji]] = new Array(inventorySorts.flat[item.emoji] - q).fill(item.emoji)
                                await this.db_transform(loaded.id, "$push", push)

                                // Restore Health
                                await this.db_transform(loaded.id, "$set:health", 100)
                                this.props.description = [
                                    `<@${loaded.id}> just used ${q} ${item.emoji}${item.stylized}.`,
                                    "Their health has been restored."
                                ]
                            } else {
                                this.props.description = [
                                    `${item.stylized} not yet implemented.`
                                ]
                            }
                            this.props.description = this.props.description.join("\n")
                        } else {
                            this.error = true
                            this.props.description = [
                                `Yes, you have no ${item.emoji}${item.stylized}.`,
                                `'${inventorySorts.flat[item.emoji]}' in inventory.`,
                                `'${quantity}' requested to use.`
                            ].join("\n")
                            return
                        }
                    }
                }

                if ((!this.props.description) || (this.props.description == "")) {
                    this.error = true
                    this.props.description = `Item doesn't exist. '${selected_item}' given.`
                    return
                }
            }
        }
    }
}
