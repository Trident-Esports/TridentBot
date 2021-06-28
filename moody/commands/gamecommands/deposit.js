const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

// Combine with Withdraw via ATMCommand

module.exports = class DepositCommand extends GameCommand {
    constructor() {
        super({
            name: 'deposit',
            aliases: ['dep'],
            category: 'game',
            description: 'Deposit coins into your bank',
            extensions: ["profile"]
        });
    }

    async run(client, message, args) {
        let props = {
            title: {
                text: "Deposit"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        var amount = args && args[0] ? args[0].toLowerCase() : -1

        const profileData = await this.profileModel.findOne({
            userID: message.author.id
        })

        if (amount == 'all') {
            amount = profileData.gold
        }
        if (amount == 'half') {
            amount = parseInt(profileData.gold / 2)
        }

        if (isNaN(amount) || amount <= 0) {
            props.title.text = "Error"
            props.description = `Deposit amount must be a positive whole number, "all" or "half". '${amount}' given.`
        }

        if (amount > profileData.gold) {
            props.title.text = "Error"
            props.description = `You only have ${this.emojis.gold}${profileData.gold}. '${amount}' given.`
        }

        await this.profileModel.findOneAndUpdate({
                userID: message.author.id
            }, {
                $inc: {
                    gold: -amount,
                    bank: amount,
                },

            }

        );

        if (props.title.text != "Error") {
            props.description = [
                `**${message.author} has Deposited ${this.emojis.gold}${amount.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold into their Bank!**`,
                `_Check your balance using .balance_`
            ].join("\n")
        }

        props.thumbnail = message.author.displayAvatarURL({
            dynamic: true,
            format: 'png'
        })

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
};
