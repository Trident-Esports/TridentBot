/*

Command for Money management

BaseCommand
 VillainsCommand
  GameCommand
   ATMCommand
    Deposit
    Give
    Refund
    Rob (NYI)
    Steal
    Withdraw

*/

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


        /*

        Start Setup

        */
        // Use target flags conditionally based on used command
        let flags = { user: "default", target: "invalid", bot: "invalid" }
        switch (props.caption.text) {
            case "Give":
            case "Refund":
            case "Steal":
                flags.target = "required";
                break;
            default:
                flags = { user: "default", target: "invalid", bot: "invalid" };
                break;
        }

        const foundHandles = await this.getArgs(message, args, flags)

        const user = foundHandles.user
        const loaded = foundHandles.loaded
        props.players = foundHandles.players
        props.title = foundHandles?.title ? foundHandles.title : props.title
        props.description = foundHandles?.description ? foundHandles.description : props.description
        /*

        End Setup

        */

        // Refund & Steal are Admin-only
        if (["Refund", "Steal"].indexOf(props.caption.text) > -1) {
            let APPROVED_ROLES = ROLES["admin"]

            if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) ) {
                props.title.text = "Error"
                props.description = this.errors.adminOnly
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
                props.description = this.errors.game.mongoDB.noProfile
            }

            let targetData = null
            let needTarget = ["Give", "Refund", "Steal"].indexOf(props.caption.text) > -1
            if (needTarget) {
                if (loaded) {
                    if ((["Give", "Steal"].indexOf(props.caption.text) > -1) && (user.id === loaded.id)) {
                        props.title.text = "Error"
                        props.description = `You can't ${props.caption.text} Gold to/from yourself!`
                    }

                    if (props.title.text != "Error") {
                        targetData = await this.profileModel.findOne({
                            userID: loaded.id
                        })

                        if (!targetData) {
                            props.title.text = "Error"
                            props.description = this.errors.game.mongoDB.noProfile
                        }
                    }
                } else {
                    props.title.text = "Error"
                    props.description = `You need to specify a player to ${props.caption.text} Gold.`
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
                            [verb, direction, container] = ["Given", "to", `<@${loaded.id}>'s Wallet`];
                            break;
                        case "Withdraw":
                            // User to User
                            inc = { gold: amount, bank: -amount };
                            [verb, direction, container] = ["Withdrawn", "into", "their Wallet"];
                            break;
                        case "Refund":
                            // Ether to Target
                            targetInc = { gold: amount };
                            [verb, direction, container] = ["Refunded", "into", `<@${loaded.id}>'s Wallet`];
                            break;
                        case "Steal":
                            // Target to User
                            inc = { gold: amount };
                            targetInc = { gold: -amount };
                            [verb, direction, container] = ["Stole", "from", `<@${loaded.id}>'s Wallet`];
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
                    if (loaded && targetInc.gold !== 0) {
                        await this.profileModel.findOneAndUpdate({
                                userID: loaded.id
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
