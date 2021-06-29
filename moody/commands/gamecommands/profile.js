const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs')

module.exports = class ProfileCommand extends GameCommand {
    constructor() {
        super({
            name: 'profile',
            aliases: ["pr", "acc"],
            category: 'game',
            description: 'Check the User\'s Profile',
            extensions: [ "profile", "health", "xpboost", "levels" ]
        });
    }

    async run(client, message, args) {
        let props = {
            caption: {
                text: "Profile"
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
        const target = message.mentions.members.first()
        const loaded = target ? target.user : user
        props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
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

            const profileData = await this.profileModel.findOne({
                userID: loaded.id
            })
            const healthData = await this.healthModel.findOne({
                userID: loaded.id
            })
            const XPBoostData = await this.XPBoostModel.findOne({
                userID: loaded.id
            })
            const levelData = await this.Levels.fetch(loaded.id, 1)

            props.description = `This is <@${loaded.id}>'s Profile`
            props.fields = [
                {
                    name: "Title",
                    value: "Beta Tester"
                },
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
                    name: `${this.emojis.life}${healthData.health}%`,
                    value: "Life",
                    inline: true
                },
                {
                    name: `${this.emojis.gold}${profileData.gold.toLocaleString("en-AU")}`,
                    value: "Gold",
                    inline: true
                },
                {
                    name: `${this.emojis.bank}${profileData.bank.toLocaleString("en-AU")}`,
                    value: "Bank",
                    inline: true
                },
                {
                    name: `${this.emojis.minions}${profileData.minions}`,
                    value: "Minions",
                    inline: true
                },
                {
                    name: `${this.emojis.xpboost}${XPBoostData.xpboost}%`,
                    value: "XPBoost",
                    inline: true
                }
            ]
        }

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
}
