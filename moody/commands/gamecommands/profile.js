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
            title: {
                text: "Profile"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        let mentionedMember = null
        if (args.length) {
            mentionedMember = message.mentions.members.first().user
        } else {
            mentionedMember = message.author
        }

        if (!mentionedMember) {
            props.title.text = "Error"
            props.description = `That user does not exist. '${args.join(" ")}' given.`
        } else {
            props.thumbnail = mentionedMember.avatarURL({
                dynamic: true
            })

            const profileData = await this.profileModel.findOne({
                userID: mentionedMember.id
            })
            const healthData = await this.healthModel.findOne({
                userID: mentionedMember.id
            })
            const XPBoostData = await this.XPBoostModel.findOne({
                userID: mentionedMember.id
            })
            const target = await this.Levels.fetch(mentionedMember.id, 1)

            if (!profileData) {
                props.title.text = "Error"
                props.description = `That user does not have a profile. '${args.join(" ")}' given.`
            } else {
                let emojis = JSON.parse(fs.readFileSync("game/dbs/emojis.json", "utf8"));

                props.description = `This is ${mentionedMember}'s Profile`
                props.fields = [{
                        name: "Title",
                        value: "Beta Tester"
                    },
                    {
                        name: `${emojis.level}${target.level}`,
                        value: "Level",
                        inline: true
                    },
                    {
                        name: `${emojis.xp}${target.xp.toLocaleString()} / ${this.Levels.xpFor(target.level + 1).toLocaleString()}`,
                        value: "XP",
                        inline: true
                    },
                    {
                        name: `${emojis.life}${healthData.health}%`,
                        value: "Life",
                        inline: true
                    },
                    {
                        name: `${emojis.gold}${profileData.gold.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                        value: "Gold",
                        inline: true
                    },
                    {
                        name: `${emojis.bank}${profileData.bank.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                        value: "Bank",
                        inline: true
                    },
                    {
                        name: `${emojis.minions}${profileData.minions}`,
                        value: "Minions",
                        inline: true
                    },
                    {
                        name: `${emojis.xpboost}${XPBoostData.xpboost}%`,
                        value: "XPBoost",
                        inline: true
                    }
                ]
                props.thumbnail = mentionedMember.displayAvatarURL({
                    dynamic: true
                })
            }
        }

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
}
