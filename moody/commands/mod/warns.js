const VillainsEmbed = require('../../classes/vembed.class')
const ModCommand = require('../../classes/modcommand.class');
const db = require('../../../models/warns')

module.exports = class WarnsCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "warns",
            aliases: [],
            category: "admin",
            description: "Shows all user warns in server"
        }
        super(
            {...comprops}
        )
    }

    async action(client, message) {

        const user = this.inputData.loaded

        if (!user) {
            this.error = true
            this.props.description = this.errors.cantActionSelf
            return
        }

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
                return
            }
            message.channel.send(new VillainsEmbed({...props}))
        })
        // We'll handle sending it
        // SELFHANDLE: Inline Callback
        this.null = true
    }
}
