// @ts-check

const { CommandInfo } = require('discord.js-commando');
const GameCommand = require('./gamecommand.class');

const fs = require('fs');

/**
 * @class
 * @classdesc Build a Command for ATM-like transactions to/from players
 * @this {ATMCommand}
 * @extends {GameCommand}
 * @public
 */
module.exports = class ATMCommand extends GameCommand {
    /**
     * Constructor
     * @param {CommandInfo} comprops - List of command properties from child class
     */
    constructor(client, comprops, props = {}) {
        super(
            client,
            {
                ...comprops,
                args: [
                    {
                        key: "target",
                        prompt: "Target?",
                        type: "member|user"
                    },
                    {
                        key: "amount",
                        prompt: "Amount?",
                        type: "string"
                    }
                ]
            },
            {
                ...props,
                extensions: [ "profile" ],
            }
        )

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
                this.flags.search = "invalid";
            case "Give":
            case "Steal":
                this.flags.target = "required";
                this.flags.search = "invalid";
                break;
        }
    }

    async action(message, args) {
        // Get loaded target
        const loaded = args?.target ? args.target : message.author

        // Sanity check for title text
        if(!(this?.props?.title?.text)) {
            if(!(this?.props?.title)) {
                this.props.title = { text: ""}
            }
            this.props.title.text = ""
        }

        // Refund & Steal are Admin-only
        if (["Refund", "Steal"].includes(this.props.caption.text)) {
            // Get botdev-defined list of roles groupings

            let ROLES = JSON.parse(fs.readFileSync("./src/dbs/" + message.guild.id + "/roles.json", "utf8"))
            // Bail if we fail to get Roles information
            if (!ROLES) {
                this.error = true
                this.props.description = "Failed to get Roles information."
                return
            }

            let APPROVED_ROLES = ROLES["admin"]
            // Bail if we don't have intended Approved Roles data
            if (!APPROVED_ROLES) {
                this.error = true
                this.props.description = "Failed to get Approved Roles."
                return
            }

            // Bail if member doesn't have Approved Roles
            if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) ) {
                this.error = true
                // @ts-ignore
                this.props.description = this.errors.adminOnly.join("\n")
                return
            }
        }

        // Get transfer amount
        let amount = args?.amount && args.amount ? args.amount : -1

        // Bail if invalid amount
        // Amount needs to be positive number, "all" or "half"
        if (((typeof amount === "undefined") || (!amount) || (isNaN(amount)) && (!(["all","half"].includes(amount)))) || (parseInt(amount) <= 0)) {
            this.error = true
            this.props.description = `Amount must be a positive whole number, "all" or "half". '${amount}' given.`
            return
        }

        // Get user's profile data
        const profileData = await this.db_query(loaded.id, "profile")

        // Bail if can't get user data
        if (!profileData) {
            this.error = true
            // @ts-ignore
            this.props.description = this.errors.game.mongoDB.noProfile.join("\n")
            return
        }

        // Get target's profile data if needed
        let targetData = null
        // Give/Refund/Steal require a target
        let needTarget = ["Give", "Refund", "Steal"].includes(this.props.caption.text)
        if (needTarget) {
            if (loaded) {
                // Give/Steal can't target self
                // Bail if targetting self
                if ((["Give", "Steal"].includes(this.props.caption.text)) && (this.inputData.user.id === loaded.id)) {
                    this.error = true
                    this.props.description = `You can't ${this.props.caption.text} Gold to/from yourself!`
                    return
                }

                // Get target's profile data
                targetData = await this.db_query(loaded.id, "profile")
                // Bail if can't get target data
                if (!targetData) {
                    this.error = true
                    // @ts-ignore
                    this.props.description = this.errors.game.mongoDB.noProfile.join("\n")
                    return
                }
            } else {
                // Bail if no target sent
                this.error = true
                this.props.description = `You need to specify a player to ${this.props.caption.text} Gold.`
                return
            }
        }

        // Figure out source for gold
        let reserve = 0
        switch (this.props.caption.text) {
            case "Burn":
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

        // Calculate proper amount
        if (amount == 'all') {
            amount = reserve
        } else if (amount == 'half') {
            amount = Math.floor(reserve / 2)
        } else {
            amount = parseInt(amount)
        }
        // Burn/Deposit/Give/Withdraw: Can't transfer more than you've got
        // Bail if not enough gold
        if (["Burn","Deposit","Give","Withdraw"].includes(this.props.caption.text)) {
            if (parseInt(amount) > reserve) {
                this.error = true
                this.props.description = `You only have ${this.emojis.gold}${reserve.toLocaleString("en-AU")}. '${amount.toLocaleString("en-AU")}' given.`
                return
            }
        }

        // Figure out plus/minus and destination for gold
        let userInc = { gold: 0 }
        let targetInc = { gold: 0 }
        let [verb, direction, container] = ["", "", ""]
        switch (this.props.caption.text) {
            case "Burn":
                // User to Ether
                userInc = { gold: -amount };
                [verb, direction, container] = ["Burned", "from", "their Wallet"];
                break;
            case "Deposit":
                // User to User
                userInc = { gold: -amount, bank: amount };
                [verb, direction, container] = ["Deposited", "into", "their Bank"];
                break;
            case "Give":
                // User to Target
                userInc = { gold: -amount };
                targetInc = { gold: amount };
                [verb, direction, container] = ["Given", "to", `<@${loaded.id}>'s Wallet`];
                break;
            case "Withdraw":
                // User to User
                userInc = { gold: amount, bank: -amount };
                [verb, direction, container] = ["Withdrawn", "into", "their Wallet"];
                break;
            case "Refund":
                // Ether to Target
                targetInc = { gold: amount };
                [verb, direction, container] = ["Refunded", "into", `<@${loaded.id}>'s Wallet`];
                break;
            case "Steal":
                // Target to User
                userInc = { gold: amount };
                targetInc = { gold: -amount };
                [verb, direction, container] = ["Stole", "from", `<@${loaded.id}>'s Wallet`];
                break;
            default:
                break;
        }

        // If we're modding the user, do it
        if (userInc.gold !== 0) {
            await this.db_transform(this.inputData.user.id, userInc)
        }
        // If we're modding the target, do it
        if (loaded && targetInc.gold !== 0) {
            await this.db_transform(loaded.id, targetInc)
        }

        // Build the thing
        this.props.description = []

        this.props.description.push(`**<@${this.inputData.user.id}> has ${verb} ${this.emojis.gold}${amount.toLocaleString("en-AU")} Gold ${direction} ${container}!**`)
        this.props.description.push("_Check your balance using `.balance`_")

        this.props.description = this.props.description.join("\n")
    }
}
