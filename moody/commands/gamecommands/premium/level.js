const GameCommand = require('../../../classes/gamecommand.class');
const VillainsEmbed = require('../../../classes/vembed.class');

const fs = require('fs');

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
            title: {
                text: "Level"
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

        const target = await this.Levels.fetch(mentionedMember.id, 1);
        if (!target) return message.channel.send("This member doesn't have a Level.😢");

        const XPBoostData = await this.XPBoostModel.findOne({
            userID: mentionedMember.id
        });

        let emojis = JSON.parse(fs.readFileSync("game/dbs/emojis.json", "utf8"));

        props.description = `This is ${mentionedMember}'s Level`
        props.fields = props.fields = [
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
            name: `${emojis.xpboost}${XPBoostData.xpboost}%`,
            value: "XPBoost",
            inline: false
        }
    ]
        props.thumbnail = mentionedMember.displayAvatarURL({
            dynamic: true
        })

        let embed = new VillainsEmbed(props)
        await message.channel.send(embed);
    }
}