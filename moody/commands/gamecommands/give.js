const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class GiveCommand extends GameCommand {
    constructor() {
        super({
            name: 'give',
            category: 'game',
            description: 'gives another player gold',
            extensions: ["profile"]
        });
    }

    async run(client, message, args) {
        let props = {
            title: {
                text: "Give"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        if (!args.length) {
            return message.channel.send("You need to mention a player to give them coins");
        }

        var amount = args[1].toLowerCase() || args[1]

        const profileData = await this.profileModel.findOne({
            userID: message.author.id
        })

        if (amount == 'all') {
            amount = profileData.gold
        }
        if (amount == 'half') {
            amount = profileData.gold / 2
        }

        if (amount > profileData.gold) {
            return message.reply('You seem to be short on gold there!')
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply("That user does not exist")
        }

        if (amount % 1 != 0 || amount <= 0) {
            return message.reply("Deposit amount must be a whole number")
        }

        const targetData = await this.profileModel.findOne({
            userID: target.id
        });

        if (!targetData) {
            return message.reply(`This user doensn't exist in the database`)
        }

        await this.profileModel.findOneAndUpdate({
            userID: target.id,
        }, {
            $inc: {
                gold: amount,
            },
        });

        await this.profileModel.findOneAndUpdate({
            userID: message.author.id,
        }, {
            $inc: {
                gold: -amount,
            },
        });

        props.description = `${message.author} just gave ${target} ${amount} coins!`

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
};