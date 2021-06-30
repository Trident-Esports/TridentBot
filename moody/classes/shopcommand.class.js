const GameCommand = require('./gamecommand.class');
const VillainsEmbed = require('./vembed.class');

const fs = require('fs')

module.exports = class ShopCommand extends GameCommand {
    constructor(comprops = {}) {
        super({
            name: comprops.name,
            aliases: comprops.aliases,
            category: 'game',
            description: comprops.description,
            extensions: comprops.extensions
        });
    }

    async run(client, message, args) {
        let props = {
            caption: {
                text: this.name.charAt(0).toUpperCase() + this.name.slice(1)
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
        const loaded = user

        props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }

        if (loaded?.bot && loaded.bot) {
            props.title.text = "Error"
            props.description = this.errors.cantActionBot.join("\n")
        }

        if (props.title.text != "Error") {
            const inventoryData = await this.inventoryModel.findOne({
                userID: loaded.id
            });
            const profileData = await this.profileModel.findOne({
                userID: loaded.id
            });

            if (!inventoryData) {
                props.title.text = "Error"
                props.description = "This user doesn't exist."
            }
            if (!profileData) {
                props.title.text = "Error"
                props.description = "There was an error finding your Discord ID."
            }

            if (props.title.text != "Error") {
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
                        // inventorySorts.conversions.emojiToKey[itemData.emoji] = itemName
                        inventorySorts.conversions.emojiToCat[itemData.emoji] = cat
                        // inventorySorts.conversions.keyToEmoji[itemName] = itemData.emoji
                        // inventorySorts.conversions.keyToCat[itemName] = cat
                    }
                }

                var gold = profileData.gold //Players gold

                let re = /^([a-z ]*)([\d]*)$/
                let matches = args.join(" ").toLowerCase().match(re)
                let selected_item = ""
                let quantity = -1
                if (matches) {
                    selected_item = matches[1].trim().replace(/\s/g, '')
                    quantity = ((!isNaN(matches[2])) && (matches[2] != "")) ? parseInt(matches[2]) : 1
                } else if (args[0] in emojiItems) {
                    selected_item = emojiItems[args[0]]
                    re = /([\d]*)/
                    matches = args.join(" ").toLowerCase().match(re)
                    quantity = ((!isNaN(matches[2])) && (matches[2] != "")) ? parseInt(matches[2]) : 1
                }

                if (selected_item == "") {
                    props.title.text = "Error"
                    props.description = "No item name given."
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
                    if (["Buy"].indexOf(props.caption.text) > -1) {
                        // Buy
                        let cost = parseInt(item.value) * parseInt(quantity)
                        if (gold < cost) return message.channel.send('You cannot afford to buy this item')
                        await this.profileModel.findOneAndUpdate({
                            userID: loaded.id
                        }, {
                            $inc: {
                                gold: -cost
                            }
                        });

                        let selected_items = new Array(quantity).fill(item.emoji);
                        await this.inventoryModel.findOneAndUpdate({
                            userID: loaded.id
                        }, {
                            $push: {
                                items: selected_items
                            }
                        });

                        props.description = `<@${loaded.id}> just bought `
                        props.description += `${quantity} `
                        props.description += `${item.emoji}`
                        props.description += (item?.stylized ? item.stylized : (selected_item.charAt(0).toUpperCase() + selected_item.slice(1)))
                        props.description += "!"
                    } else if (["Use"].indexOf(props.caption.text) > -1) {
                        // Use
                        props.fields = []
                        let search = {}
                        search[cat] = [item.emoji]
                        let haveItem = await this.inventoryModel.findOne({
                            userID: loaded.id
                        }, search)
                        if (haveItem) {
                            props.description = []
                            if (item.name == "bananas") {
                                // Bananas
                                let q = parseInt(args[2])

                                if (!isNaN(q)) {
                                    props.title.text = "Error"
                                    props.description = `This amount of Items is not available.(${q}) given.`
                                }

                                // Pull All
                                let pull = {}
                                pull[inventorySorts.conversions.emojiToCat[item.emoji]] = item.emoji
                                await this.inventoryModel.findOneAndUpdate({
                                    userID: loaded.id
                                }, {
                                    $pull: pull
                                })

                                // Put back minus q
                                let push = {}
                                push[inventorySorts.conversions.emojiToCat[item.emoji]] = new Array(inventorySorts.flat[item.emoji] - q).fill(item.emoji)
                                await this.inventoryModel.findOneAndUpdate({
                                    userID: loaded.id
                                }, {
                                    $push: push
                                })

                                props.description = [
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
                                    await this.XPBoostModel.findOneAndUpdate({
                                        userID: loaded.id
                                    }, {
                                        $inc: {
                                            xpboost: 25
                                        }
                                    })
                                    props.description.push("You have fed your minions and they are now by your side, gaining 25% XP Boost!")
                                    props.fields.push({
                                        name: `${this.emojis.xpboost}25%`,
                                        value: "XPBoost"
                                    })
                                } else if (number <= fail) {
                                    // do nothing
                                } else if (number <= special) {
                                    await this.profileModel.findOneAndUpdate({
                                        userID: loaded.id
                                    }, {
                                        $inc: {
                                            minions: minions
                                        }
                                    })
                                    props.description.push(`Wait, what is this?!? Your minions have just multiplied. You just gained ${this.emojis.minions}${minions} Minions!`)
                                    props.fields.push({
                                        name: `${this.emojis.minions}${minions}`,
                                        value: "Minions"
                                    })
                                }
                            } else if (item.name == "lifepotion") {
                                // Life Potion
                                let q = parseInt(args[3])

                                if (!isNaN(q)) {
                                    props.title.text = "Error"
                                    props.description = `This amount of Items is not available.(${q}) given.`
                                }

                                // Pull All
                                let pull = {}
                                pull[inventorySorts.conversions.emojiToCat[item.emoji]] = item.emoji
                                await this.inventoryModel.findOneAndUpdate({
                                    userID: loaded.id
                                }, {
                                    $pull: pull
                                })

                                // Put back minus q
                                let push = {}
                                push[inventorySorts.conversions.emojiToCat[item.emoji]] = new Array(inventorySorts.flat[item.emoji] - q).fill(item.emoji)
                                await this.inventoryModel.findOneAndUpdate({
                                    userID: loaded.id
                                }, {
                                    $push: push
                                })

                                // Restore Health
                                await this.healthModel.findOneAndUpdate({
                                    userID: loaded.id,
                                }, {
                                    $set: {
                                        health: 100,
                                    },
                                })
                                props.description = [
                                    `<@${loaded.id}> just used ${q} ${item.emoji}${item.stylized}.`,
                                    "Their health has been restored."
                                ]
                            } else {
                                props.description = [
                                    `${item.stylized} not yet implemented.`
                                ]
                            }
                            props.description = props.description.join("\n")
                        } else {
                            props.title.text = "Error"
                            props.description = `Yes, you have no ${item.emoji}${item.stylized}.`
                        }
                    }
                }

                if (props.description == "") {
                    props.title.text = "Error"
                    props.description = `Item doesn't exist. '${selected_item}' given.`
                }
            }
        }

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
}
