const GameCommand = require('./gamecommand.class');
const VillainsEmbed = require('./vembed.class');

const fs = require('fs');
let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))
module.exports = class ATMCommand extends GameCommand {
    constructor(comprops = {}) {
        super({
            name: comprops.name,
            aliases: comprops.aliases,
            category: 'game',
            description: comprops.description,
            extensions: ["profile"]
        });
    }

    async run(client, message, args) {
        let props = {
            caption: {
                text: this.name.charAt(0).toUpperCase() + this.name.slice(1)
            },
            title: {},
            players: {
                user: {},
                target: {}
            }
        }

        const user = message.author
        const target = message.mentions.members.first()
        const loaded = user

        props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }

        if (loaded?.bot && loaded.bot) {
            props.title.text = "Error"
            props.description = this.errors.cantActionBot.join("\n")
        }

        if (["Refund", "Steal"].indexOf(props.caption.text) > -1) {
            let APPROVED_ROLES = ROLES["admin"]

            if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) ) {
                props.title.text = "Error"
                props.description = "Sorry, only admins can run this command. 😔"
            }
        }

        var amount = (args && args[0]) ? args[0].toLowerCase() : -1

        if (isNaN(amount) || (parseInt(amount) <= 0)) {
            props.title.text = "Error"
            props.description = `Amount must be a positive whole number, "all" or "half". '${amount}' given.`
        }

        if (props.title.text != "Error") {
            const profileData = await this.profileModel.findOne({
                userID: loaded.id
            })

            if (!profileData) {
                props.title.text = "Error"
                props.description = "User not found."
            }

            let targetData = null
            let needTarget = ["Give", "Refund", "Steal"].indexOf(props.caption.text) > -1
            if (needTarget) {
                if (target) {
                    if ((["Give", "Steal"].indexOf(props.caption.text) > -1) && (user.id === target.id)) {
                        props.title.text = "Error"
                        props.description = `You can't ${props.caption.text} Gold to/from yourself!`
                    }
                    if (target?.user?.bot && target.user.bot) {
                        props.title.text = "Error"
                        props.description = this.errors.cantActionBot.join("\n")
                    }

                    if (props.title.text != "Error") {
                        props.players.target = {
                            name: target.username,
                            avatar: target.user.displayAvatarURL({ format: "png", dynamic: true })
                        }
                        targetData = await this.profileModel.findOne({
                            userID: target.id
                        })

                        if (!targetData) {
                            props.title.text = "Error"
                            props.description = "Target not found."
                        }
                    }
                } else {
                    props.title.text = "Error"
                    props.description = `You need to mention a player to ${props.caption.text} Gold.`
                }
            }

            if (props.title.text != "Error") {
                let reserve = 0
                switch (props.caption.text) {
                    case "Deposit":
                    case "Give":
                        reserve = profileData.gold
                        break
                    case "Withdraw":
                        reserve = profileData.bank
                        break
                    default:
                        reserve = 0
                        break
                }
                if (amount == 'all') {
                    amount = parseInt(reserve)
                } else if (amount == 'half') {
                    amount = parseInt(reserve / 2)
                } else {
                    amount = parseInt(amount)
                }
                if (["Refund", "Steal"].indexOf(props.caption.text) == -1) {
                    if (parseInt(amount) > parseInt(reserve)) {
                        props.title.text = "Error"
                        props.description = `You only have ${this.emojis.gold}${reserve}. '${amount}' given.`
                    }
                }

                if (props.title.text != "Error") {
                    let inc = { gold: 0 }
                    let targetInc = { gold: 0 }
                    let [verb, direction, container] = ["", "", ""]
                    switch (props.caption.text) {
                        case "Deposit":
                            // User to User
                            inc = { gold: -amount, bank: amount };
                            [verb, direction, container] = ["Deposited", "into", "their Bank"];
                            break;
                        case "Give":
                            // User to Target
                            inc = { gold: -amount };
                            targetInc = { gold: amount };
                            [verb, direction, container] = ["Given", "to", `<@${target.id}>'s Wallet`];
                            break;
                        case "Withdraw":
                            // User to User
                            inc = { gold: amount, bank: -amount };
                            [verb, direction, container] = ["Withdrawn", "into", "their Wallet"];
                            break;
                        case "Refund":
                            // Ether to Target
                            targetInc = { gold: amount };
                            [verb, direction, container] = ["Refunded", "into", `<@${target.id}>'s Wallet`];
                            break;
                        case "Steal":
                            // Target to User
                            inc = { gold: amount };
                            targetInc = { gold: -amount };
                            [verb, direction, container] = ["Stole", "from", `<@${target.id}>'s Wallet`];
                            break;
                        default:
                            break;
                    }
                    if (inc.gold !== 0) {
                        await this.profileModel.findOneAndUpdate({
                                userID: user.id
                            }, {
                                $inc: inc
                            }
                        );
                    }
                    if (target && targetInc.gold !== 0) {
                        await this.profileModel.findOneAndUpdate({
                                userID: target.id
                            }, {
                                $inc: targetInc
                            }
                        );
                    }

                    props.description = []

                    props.description.push(`**<@${user.id}> has ${verb} ${this.emojis.gold}${amount.toLocaleString("en-AU")} Gold ${direction} ${container}!**`)
                    props.description.push("_Check your balance using `.balance`_")

                    props.description = props.description.join("\n")
                }
            }
        }

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
}
