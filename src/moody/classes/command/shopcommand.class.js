// @ts-check

const { CommandInfo } = require('discord.js-commando');
const GameCommand = require('./gamecommand.class');

const fs = require('fs')

/**
 * @class
 * @classdesc Build a Shop Command for Villains Minigame
 * @this {ShopCommand}
 * @extends {GameCommand}
 * @public
 */
module.exports = class ShopCommand extends GameCommand {
    /**
     * Constructor
     * @param {CommandInfo} comprops - List of command properties from child class
     */
    constructor(client, comprops, props) {
        // Create a parent object
        // All ShopCommands are 'game' category
        // All ShopCommands default to user required and all other targets are invalid
        super(
            client,
            {
                ...comprops,
                args: [
                    {
                        key: "quantity",
                        prompt: "Quantity",
                        type: "integer",
                        min: 1
                    },
                    {
                        key: "item",
                        prompt: "Item?",
                        type: "string"
                    }
                ]
            },
            {
                ...props,
                flags: {
                    user: "required",
                    target: "invalid",
                    bot: "invalid"
                }
            }
        )
    }

    async action(message, args) {
        // Get loaded target
        const loaded = message.author

        // Get target's inventory data
        const inventoryData = await this.db_query(loaded.id, "inventory")
        // Get target's profile data
        const profileData = await this.db_query(loaded.id, "profile")

        // Bail if we failed to get inventory data
        if (!inventoryData) {
            this.error = true
            // @ts-ignore
            this.props.description = this.errors.game.mongoDB.noInventory.join("\n")
            return
        }
        // Bail if we failed to get profile data
        if (!profileData) {
            this.error = true
            // @ts-ignore
            this.props.description = this.errors.game.mongoDB.noProfile.join("\n")
            return
        }

        // Get shop stock information
        let STOCKDATA = JSON.parse(fs.readFileSync("./src/game/dbs/items.json", "utf8"))

        // Bail if we fail to get shop item stock information
        if (!STOCKDATA) {
            this.error = true
            this.props.description = "Failed to get shop item stock information."
            return
        }

        // Sort inventory data
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

        // Get searchable info regarding shop stock information
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

        // Figure out what and how much is being asked for
        let selected_item = args?.item ? args.item.toLowerCase() : false
        let quantity = args?.quantity ? args.quantity : 1

        // Sanity check for title
        if (!(this?.props?.title)) {
            this.props.title = {}
        }

        if (selected_item) {
            selected_item = selected_item.replace(/[:\s]/g,"")
            switch(selected_item) {
                case "banana":
                    selected_item = "bananas";
                    break;
            }
            if (Object.keys(emojiItems).includes(selected_item)) {
                selected_item = emojiItems[selected_item]
            }
        }

        console.log(`Searching StockItems for '${selected_item}'`)

        // Get item object
        let [cat, items] = ["", []]
        let foundItem = {}
        for ([cat, items] of Object.entries(STOCKDATA)) {
            if (selected_item in items) {
                foundItem = items[selected_item]
                foundItem.name = selected_item
                if (!("stylized" in foundItem)) {
                    foundItem.stylized = foundItem.name.charAt(0).toUpperCase() + foundItem.name.slice(1)
                }
                break
            }
        }

        // Get copy of target's inventory
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

        // If we've got an item object
        if (foundItem?.emoji) {
            console.log(`We determined a specified Shop Item! '${foundItem.emoji}' given!`)
            if (["Buy"].includes(this.props.caption.text)) {
                console.log("We're gonna Buy!")
                // Buy
                let cost = parseInt(foundItem.value) * quantity

                console.log(`We're gonna buy ${quantity}${foundItem.emoji} for ${this.emojis.gold}${cost}!`)

                // Bail if we can't afford it
                if (gold < cost) {
                    this.error = true
                    this.props.description = "You cannot afford to buy this item."
                    return
                }

                // Deduct cost
                await this.db_transform(loaded.id, "gold", -cost)

                // Push what we bought
                let selected_items = new Array(quantity).fill(foundItem.emoji);
                await this.db_transform(loaded.id, "$push", { items: selected_items })

                this.props.description = `<@${loaded.id}> just bought `
                this.props.description += `${quantity} `
                this.props.description += `${foundItem.emoji}`
                this.props.description += (foundItem?.stylized ? foundItem.stylized : (selected_item.charAt(0).toUpperCase() + selected_item.slice(1)))
                this.props.description += "!"
            } else if (["Use"].includes(this.props.caption.text)) {
                console.log("We're gonna Use!")
                // Use
                this.props.fields = []
                let haveEnough = inventorySorts.flat[foundItem.emoji] >= quantity
                if (haveEnough) {
                    this.props.description = []
                    if (foundItem.name == "bananas") {
                        // Bananas
                        let q = quantity

                        // Pull All
                        let pull = {}
                        pull[inventorySorts.conversions.emojiToCat[foundItem.emoji]] = foundItem.emoji
                        await this.db_transform(loaded.id, "$pull", pull)

                        // Put back minus q
                        let push = {}
                        push[inventorySorts.conversions.emojiToCat[foundItem.emoji]] = new Array(inventorySorts.flat[foundItem.emoji] - q).fill(foundItem.emoji)
                        await this.db_transform(loaded.id, "$push", push)

                        this.props.description = [
                            `<@${loaded.id}> just used ${q} ${foundItem.emoji}${foundItem.stylized}.`,
                            "Their minions are now happily satisfied."
                        ]

                        let [probMin, probMax] = [0, 100]
                        let number = Math.round(Math.random() * (probMax - probMin)) + probMin
                        let minions = Math.round(profileData.minions / 4)

                        let success = 4
                        let fail = 99
                        let special = 100

                        if (number <= success) {
                            // Bonus: XP Boost
                            await this.db_transform(loaded.id, "xpboost", 25)
                            this.props.description.push("You have fed your minions and they are now by your side, gained:")
                            this.props.fields.push({
                                name: `${this.emojis.xpboost}25%`,
                                value: "XPBoost"
                            })
                        } else if (number <= fail) {
                            // do nothing
                        } else if (number <= special) {
                            // Bonus: Minions Multiply
                            await this.db_transform(loaded.id, "minions", minions)
                            this.props.description.push(`Wait, what is this?!? Your minions have just multiplied. You just gained ${this.emojis.minions}${minions} Minions!`)
                            this.props.fields.push({
                                name: `${this.emojis.minions}${minions}`,
                                value: "Minions"
                            })
                        }
                    } else if (foundItem.name == "lifepotion") {
                        // Life Potion
                        let q = quantity

                        // Pull All
                        let pull = {}
                        pull[inventorySorts.conversions.emojiToCat[foundItem.emoji]] = foundItem.emoji
                        await this.db_transform(loaded.id, "$pull", pull)

                        // Put back minus q
                        let push = {}
                        push[inventorySorts.conversions.emojiToCat[foundItem.emoji]] = new Array(inventorySorts.flat[foundItem.emoji] - q).fill(foundItem.emoji)
                        await this.db_transform(loaded.id, "$push", push)

                        // Restore Health
                        await this.db_transform(loaded.id, "$set:health", 100)
                        this.props.description = [
                            `<@${loaded.id}> just used ${q} ${foundItem.emoji}${foundItem.stylized}.`,
                            "Their health has been restored."
                        ]
                    } else {
                        // Bail if we don't have a defn for what the item does
                        //FIXME: Implement NYI items
                        this.error = true
                        this.props.description = [
                            `${foundItem.stylized} not yet implemented.`
                        ].join("\n")
                        return
                    }
                    this.props.description = this.props.description.join("\n")
                } else {
                    // Bail if we don't have enough of requested item
                    this.error = true
                    this.props.description = [
                        `Yes, you have no ${foundItem.emoji}${foundItem.stylized}.`,
                        `'${inventorySorts.flat[foundItem.emoji]}' in inventory.`,
                        `'${quantity}' requested to use.`
                    ].join("\n")
                    return
                }
            } else if (["Drop"].includes(this.props.caption.text)) {
                console.log("We're gonna Drop!")
                // Drop
                this.props.fields = []
                let haveEnough = inventorySorts.flat[foundItem.emoji] >= quantity
                console.log(`We have ${inventorySorts.flat[foundItem.emoji]} to drop ${quantity}!`)
                if (haveEnough) {
                    this.props.description = []

                    let q = quantity

                    // Pull All
                    let pull = {}
                    pull[inventorySorts.conversions.emojiToCat[foundItem.emoji]] = foundItem.emoji
                    await this.db_transform(loaded.id, "$pull", pull)

                    // Put back minus q
                    let push = {}
                    push[inventorySorts.conversions.emojiToCat[foundItem.emoji]] = new Array(inventorySorts.flat[foundItem.emoji] - q).fill(foundItem.emoji)
                    await this.db_transform(loaded.id, "$push", push)

                    this.props.description = [
                        `<@${loaded.id}> just dropped ${q} ${foundItem.emoji}${foundItem.stylized}.`
                    ]
                } else {
                    // Bail if we don't have enough of requested item
                    this.error = true
                    this.props.description = [
                        `Yes, you have no ${foundItem.emoji}${foundItem.stylized}.`,
                        `'${inventorySorts.flat[foundItem.emoji]}' in inventory.`,
                        `'${quantity}' requested to drop.`
                    ].join("\n")
                    return
                }
            } else {
                console.log("I dunno what we're gonna do!")
            }
        }

        // Bail if we get here since we couldn't figure out what user wanted to happen
        if ((!this.props.description) || (this.props.description == "")) {
            this.error = true
            this.props.description = `Item doesn't exist. '${selected_item}' given.`
            return
        }
    }
}
