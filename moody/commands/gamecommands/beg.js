const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class BegCommand extends GameCommand {
    constructor() {
        super({
            name: 'beg',
            category: 'game',
            description: 'beg for gold',
            extensions: [ "levels", "profile" ]
        });
    }

    async run(client, message, args) {
        let props = {
            caption: {
                text: "Beg"
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
            // Gold Reward: 1 - 50
            let [minReward, maxReward] = [1, 50]
            const randomNumber = Math.floor(Math.random() * (maxReward - minReward)) + minReward;

            // XP Reward: 15 - 50
            let [minXP, maxXP] = [15, 50]
            const randomXP = Math.floor(Math.random() * (maxXP - minXP)) + minXP;

            let inc = {
                gold: randomNumber
            }
            await this.profileModel.findOneAndUpdate({
                userID: loaded.id,
            }, {
                $inc: inc,
            });

            const hasLeveledUP = await this.Levels.appendXp(loaded.id, 1, randomXP);

            if (hasLeveledUP) {

                const levelData = await this.Levels.fetch(loaded.id, 1);
                let gainedmoney = 1000
                let gainedminions = 1
                let inc = {
                    gold: gainedmoney,
                    minions: gainedminions
                }
                await this.profileModel.findOneAndUpdate({
                    userID: loaded.id,
                }, {
                    $inc: inc,
                });

                let msg = [
                    `You just Advanced to Level ${levelData.level.toLocaleString()}!`,
                    `You have gained: ${this.emojis.gold}${gainedmoney.toLocaleString()}, ${this.emojis.minions}${gainedminions.toLocaleString()}`
                ].join(" · ")

                props.footer.msg = msg
            }

            props.description = `*${message.author} begs and receives...*`
            props.fields = [
                {
                    name: `${this.emojis.gold}${randomNumber.toLocaleString()}`,
                    value: "Gold",
                    inline: true
                },
                {
                    name: `${this.emojis.xp}${randomXP.toLocaleString()}`,
                    value: "XP",
                    inline: true
                }
            ]
        }

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
}
