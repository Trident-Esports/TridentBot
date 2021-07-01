const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class DailyCommand extends GameCommand {
    constructor() {
        super({
            name: 'daily',
            category: 'game',
            description: 'Gain some Gold',
            extensions: [ "profile" ]
        });
    }

    async run(client, message, args) {
        let props = {
            caption: {
                text: "Daily"
            },
            title: {},
            description: "",
            footer: {
                msg: ""
            },
            players: {
                user: {},
                target: {}
            }
        }

        /*
        User:   Valid
        Target: Invalid
        Bot:    Invalid
        */
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

        if (props.title.text != "Error") {

            // Gold Reward: 30000 - 30000
            let [minReward, maxReward] = [30000, 30000]
            const randomNumber = Math.floor(Math.random() * (maxReward - minReward)) + minReward;

            let inc = {
                gold: randomNumber
            }
            await this.profileModel.findOneAndUpdate({
                userID: loaded.id,
            }, {
                $inc: inc,
            });

            props.description = `*<@${loaded.id}> has checked into the Lair for the Day and received...*`
            props.fields = [
                {
                    name: `${this.emojis.gold}${randomNumber.toLocaleString("en-AU")}`,
                    value: "Gold"
                }
            ]
        }

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
}
