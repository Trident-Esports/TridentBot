const VillainsEmbed = require('../../classes/vembed.class')
const ModCommand = require('../../classes/modcommand.class');
const db = require('../../../models/warns')

module.exports = class ClearWarnsCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "removewarns",
            aliases: [
                "clearwarns",
                "clrwarns"
            ],
            category: "admin",
            description: "Clears all user warns in server"
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
            let props = { caption: { text: "Clear Warns" } }
            if (data) {
                await db.findOneAndDelete({
                    guildID: message.guild.id,
                    user: user.id
                })
                props.description = `Cleared <@${user.id}>'s warns`
            } else {
                props.error = true
                props.description = `<@${user.id}> has no warns!`
            }
            let embed = new VillainsEmbed(props)
            message.channel.send(embed)
        })
        // We'll handle sending it
        // SELFHANDLE: Inline Callback
        this.null = true
    }
}
