//@ts-check

const VillainsEmbed = require('../../classes/embed/vembed.class')
const ModCommand = require('../../classes/command/modcommand.class');
const db = require('../../../models/warns')

module.exports = class WarnsCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "warns",
            aliases: [],
            category: "admin",
            description: "Shows all user warns in server"
        }
        super(comprops)
    }

    async action(client, message) {

        const user = this.inputData.loaded

        if (!user) {
            this.error = true
            this.props.description = this.errors.cantActionSelf
        }

        if (!(this.error)) {
            db.findOne({
                guildID: message.guild.id,
                user: user.id
            }, async (err, data) => {
                if (err) throw err;
                let props = { }
                if (data) {
                    props.description = []
                    props.description.push(`***<@${user.id}>'s warns***`)
                    for (let [i, warn] of Object.entries(data.content)) {
                        props.description.push(
                            `\`${i + 1}\` | Moderator: <@${message.guild.members.cache.get(warn.moderator).user.id}>`,
                            `Reason: ${warn.reason}`
                        )
                    }
                    props.color = "#00A3FF"
                } else {
                    props.error = true
                    props.description = this.errors.noProfile
                }
                let embed = new VillainsEmbed(props)
                // message.channel.send({ embeds: [embed] }) // discord.js v13
                message.channel.send(embed)
            })
            this.null = true
        }
    }
}
