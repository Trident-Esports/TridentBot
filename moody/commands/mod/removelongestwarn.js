const ModCommand = require('../../classes/modcommand.class');
const db = require('../../../models/warns');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class RemoveLongestWarnCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "removelongestwarn",
            aliases: [
                'rmvlongestwarn',
                'rmvlngstwrn'
            ],
            category: "admin",
            description: "Warns user"
        }
        super(comprops)
    }

    async action(client, message, args) {

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
            let props = {}
            if (data) {
                props.description = `Deleted <@${user.id}>'s last warn`
                data.content.splice(0, 1)
                data.save()
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
