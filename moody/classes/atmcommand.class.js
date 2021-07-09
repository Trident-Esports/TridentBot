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

const fs = require('fs');
let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))
module.exports = class ATMCommand extends GameCommand {
    constructor(comprops = {}) {
        super({
            name: comprops.name,
            aliases: comprops.aliases,
            category: 'game',
            description: comprops.description,
            extensions: ["profile"]
        })

        // Disable sources for ATMCommand and children
        for (let source of ["search"]) {
            if (!(this.flags)) {
                this.flags = {}
            }
            this.flags[source] = "invalid"
        }

        // Use target flags conditionally based on used command
        switch (this.props.caption.text) {
            case "Refund":
                this.flags.user = "invalid";
                this.flags.search = "invalid";
            case "Give":
            case "Steal":
                this.flags.target = "required";
                this.flags.search = "invalid";
                break;
        }
    }

    async db_query(userID, model) {
        switch(model) {
            case "profile":
                model = "profileModel";
                break;
        }
        return await this[model].findOne(
            { userID: userID }
        )
    }

    async db_transform(userID, type, amount) {
        let amounts = {}
        if (typeof type === "object") {
            amounts = type
        } else {
            switch(type) {
                case "wallet":
                    type = "gold";
                    break;
            }
            amounts[type] = amount
        }

        for (let [thisType, thisAmount] of Object.entries(amounts)) {
            let model = ""
            switch(thisType) {
                case "gold":
                case "bank":
                    model = "profileModel";
                    break;
            }
            if (model != "") {
                let inc = {}
                inc[thisType] = thisAmount
                await this[model].findOneAndUpdate(
                    { userID: userID },
                    { $inc: inc }
                )
            }
        }
    }

    async action(client, message) {
        const loaded = this.inputData.loaded

        if(!(this?.props?.title?.text)) {
            if(!(this?.props?.title)) {
                this.props.title = { text: ""}
            }
            this.props.title.text = ""
        }

        // Refund & Steal are Admin-only
        if (["Refund", "Steal"].indexOf(this.props.caption.text) > -1) {
            let APPROVED_ROLES = ROLES["admin"]

            if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) ) {
                this.error = true
                this.props.description = this.errors.adminOnly.join("\n")
            }
        }

        var amount = (this.inputData.args && this.inputData.args[0]) ? this.inputData.args[0].replace(",","").replace(".","").toLowerCase() : -1

        if ((isNaN(amount) && (["all","half"].indexOf(amount) == -1)) || (parseInt(amount) <= 0)) {
            this.error = true
            this.props.description = `Amount must be a positive whole number, "all" or "half". '${amount}' given.`
        }

        if (!(this.error)) {
            const profileData = await this.db_query(this.inputData.user.id, "profile")

            if (!profileData) {
                this.error = true
                this.props.description = this.errors.game.mongoDB.noProfile.join("\n")
            }

            if (!(this.error)) {
                let targetData = null
                let needTarget = ["Give", "Refund", "Steal"].indexOf(this.props.caption.text) > -1
                if (needTarget) {
                    if (loaded) {
                        if ((["Give", "Steal"].indexOf(this.props.caption.text) > -1) && (this.inputData.user.id === loaded.id)) {
                            this.error = true
                            this.props.description = `You can't ${this.props.caption.text} Gold to/from yourself!`
                        }

                        if (!(this.error)) {
                            targetData = await this.db_query(loaded.id, "profile")

                            if (!targetData) {
                                this.error = true
                                this.props.description = this.errors.game.mongoDB.noProfile.join("\n")
                            }
                        }
                    } else {
                        this.error = true
                        this.props.description = `You need to specify a player to ${props.caption.text} Gold.`
                    }
                }

                if (!(this.error)) {
                    let reserve = 0
                    switch (this.props.caption.text) {
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
                    if (["Deposit","Give","Withdraw"].indexOf(this.props.caption.text) >= -1) {
                        if (parseInt(amount) > parseInt(reserve)) {
                            this.error = true
                            this.props.description = `You only have ${this.emojis.gold}${parseInt(reserve).toLocaleString("en-AU")}. '${amount.toLocaleString("en-AU")}' given.`
                        }
                    }

                    if (!(this.error)) {
                        let inc = { gold: 0 }
                        let targetInc = { gold: 0 }
                        let [verb, direction, container] = ["", "", ""]
                        switch (this.props.caption.text) {
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
                            await this.db_transform(this.inputData.user.id, inc)
                        }
                        if (loaded && targetInc.gold !== 0) {
                            await this.db_transform(loaded.id, targetInc)
                        }

                        this.props.description = []

                        this.props.description.push(`**<@${this.inputData.user.id}> has ${verb} ${this.emojis.gold}${amount.toLocaleString("en-AU")} Gold ${direction} ${container}!**`)
                        this.props.description.push("_Check your balance using `.balance`_")

                        this.props.description = this.props.description.join("\n")
                    }
                }
            }
        }
    }
}
