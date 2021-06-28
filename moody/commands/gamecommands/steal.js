const BotDevCommand = require('../../classes/botdevcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class StealCommand extends BotDevCommand {
    constructor() {
        super({
            name: 'steal',
            category: 'game',
            description: 'steals a players coins',
            extensions: ["levels", "profile"]
        });
    }

    async run(client, message, args) {
        let props = {
            title: {
                text: "Steal"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        // let APPROVED_USERIDS = [
        //     "263968998645956608", // Mike
        //     "532192409757679618", // Noongar
        //     "692180465242603591" // PrimeWarGamer
        // ]

        // if (APPROVED_USERIDS.indexOf(message.member.id + "") == -1) {
        //     return message.reply(
        //         `Sorry only ` +
        //         `**MikeTrethewey**,` +
        //         `**Noongar1800** or ` +
        //         `**PrimeWarGamer**` +
        //         ` can run this command 😔`
        //     )
        // }

        if (!args.length) {
            return message.reply("You need to mention a player to steal their coins");
        }

        const amount = args[1];
        const target = message.mentions.users.first();

        if (!target) {
            return message.reply("That user does not exist")
        }

        if (amount % 1 != 0 || amount <= 0) {
            return message.reply("Steal amount must be a whole number")
        }


        const targetData = await this.profileModel.findOne({
            userID: target.id
        });

        if (!targetData) {
            return message.reply(`This user doesn't exist in the db`)
        }

        await this.profileModel.findOneAndUpdate({
            userID: target.id,
        }, {
            $inc: {
                gold: -amount,
            },
        });

        props.description = `${target} has mysteriously lost ${amount} Gold!`

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
};