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
            title: {
                text: this.name.charAt(0).toUpperCase() + this.name.slice(1)
            }
        }

        var amount = (args && args[0]) ? args[0].toLowerCase() : -1

        const profileData = await this.profileModel.findOne({
            userID: message.author.id
        })

        let reserve = ((props.title.text == "Deposit") ? profileData.gold : profileData.bank)
        if (amount == 'all') {
            amount = parseInt(reserve)
        } else if (amount == 'half') {
            amount = parseInt(reserve / 2)
        } else {
            amount = parseInt(amount)
        }

        if (isNaN(amount) || (parseInt(amount) <= 0)) {
            props.title.text = "Error"
            props.description = `Amount must be a positive whole number, "all" or "half". '${amount}' given.`
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
            props.description.push(`**${message.author} has ${verb} ${this.emojis.gold}${amount.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold ${direction} their Bank!**`)
            props.description.push("_Check your balance using `.balance`_")

            props.description = props.description.join("\n")
        }

        props.thumbnail = message.author.displayAvatarURL({
            dynamic: true,
            format: 'png'
        })

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
}
