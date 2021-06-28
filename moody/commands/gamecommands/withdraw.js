const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');

module.exports = class WithdrawCommand extends GameCommand {
    constructor() {
        super({
            name: 'withdraw',
            aliases: ['wd','with'],
            category: 'game',
            description: 'Withdraw coins from your bank',
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

        let emojis = JSON.parse(fs.readFileSync("game/dbs/emojis.json", "utf8"));

        var amount = args[0].toLowerCase() || args[0]

        const profileData = await this.profileModel.findOne({
            userID: message.author.id
        })

        if (amount == 'all') {
            amount = profileData.bank
        }
        if (amount == 'half') {
            amount = profileData.bank / 2
        }

        if (amount % 1 != 0 || amount <= 0) {
            return message.reply(`Deposit amount must be a whole number (${amount} given)`);
        }

        if (amount > profileData.bank) {
            return message.reply(`You only have 💰 ${profileData.gold}`)
        }

        await this.profileModel.findOneAndUpdate({
                userID: message.author.id
            }, {
                $inc: {
                    gold: amount,
                    bank: -amount,
                },

            }

        );

        props.description = `**${message.author} Withdrew ${emojis.gold}${amount.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold into their Wallet!**
        
            _Check your balance using .Balance_`
        props.thumbnail = message.author.displayAvatarURL({
            dynamic: true,
            format: 'png'
        })

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
};
