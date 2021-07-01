const GameCommand = require('../../../classes/gamecommand.class');
const VillainsEmbed = require('../../../classes/vembed.class');

module.exports = class LevelCommand extends GameCommand {
    constructor() {
        super({
            name: 'level',
            aliases: ['lvl'],
            category: 'premium',
            description: 'Checks the Users Level',
            extensions: [ "levels", "xpboost" ]
        });
    }

    async run(client, message, args) {
        let props = {
            caption: {
                text: "Level"
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
        Target: Valid
        Bot:    Invalid
        */
        const user = message.author
        const target = message.mentions.members.first()
        const loaded = target ? target.user : user
        props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }

        const levelData = await this.Levels.fetch(loaded.id, 1);
        if (!levelData) {
            props.title.text = "Error"
            props.description = "This user doesn't have a Level.😢"
        }

        if (loaded?.bot && loaded.bot) {
            props.title.text = "Error"
            props.description = this.errors.cantActionBot.join("\n")
        }

        if (props.title.text != "Error") {
            if (target) {
                props.players.target = {
                    name: target.username,
                    avatar: target.user.displayAvatarURL({ format: "png", dynamic: true })
                }
            }
            const XPBoostData = await this.XPBoostModel.findOne({
                userID: loaded.id
            });

            props.description = `This is <@${loaded.id}>'s Level`
            props.fields = [
                {
                    name: `${this.emojis.level}${levelData.level}`,
                    value: "Level",
                    inline: true
                },
                {
                    name: `${this.emojis.xp}${levelData.xp.toLocaleString("en-AU")} / ${this.Levels.xpFor(levelData.level + 1).toLocaleString("en-AU")}`,
                    value: "XP",
                    inline: true
                },
                {
                    name: `${this.emojis.xpboost}${XPBoostData.xpboost}%`,
                    value: "XPBoost",
                    inline: false
                }
            ]
        }

        let embed = new VillainsEmbed(props)
        await message.channel.send(embed);
    }
}
