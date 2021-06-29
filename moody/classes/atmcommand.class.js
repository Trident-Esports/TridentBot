const GameCommand = require('./gamecommand.class');
const VillainsEmbed = require('./vembed.class');

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
        const loaded = user

        props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }

        if (loaded?.bot && loaded.bot) {
            props.title.text = "Error"
            props.description = this.errors.cantActionBot.join("\n")
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

            if (props.title.text != "Error") {
                let reserve = ((props.title.text == "Deposit") ? profileData.gold : profileData.bank)
                if (amount == 'all') {
                    amount = parseInt(reserve)
                } else if (amount == 'half') {
                    amount = parseInt(reserve / 2)
                } else {
                    amount = parseInt(amount)
                }
                if (parseInt(amount) > parseInt(reserve)) {
                    props.title.text = "Error"
                    props.description = `You only have ${this.emojis.gold}${reserve}. '${amount}' given.`
                }

                if (props.title.text != "Error") {
                    let inc = ((props.title.text == "Deposit") ? { gold: -amount, bank: amount } : { gold: amount, bank: -amount })
                    await this.profileModel.findOneAndUpdate({
                            userID: message.author.id
                        }, {
                            $inc: inc,
                        }
                    );

                    props.description = []

                    let [verb, direction] = ((props.title.text == "Deposit") ? [ "Deposited", "into" ] : [ "Withdrawn", "from" ])
                    props.description.push(`**${message.author} has ${verb} ${this.emojis.gold}${amount.toLocaleString("en-AU")} Gold ${direction} their Bank!**`)
                    props.description.push("_Check your balance using `.balance`_")

                    props.description = props.description.join("\n")
                }
            }
        }

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
}
