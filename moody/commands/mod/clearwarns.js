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
        super(comprops)
    }

    async action(client, message) {

        const user = this.inputData.loaded

        if (!user) {
            this.error = true
            this.props.description = this.errors.cantActionSelf
        }

        if (this.DEV) {
            this.props.description += `!! DEV !! - Cleared ${user}'s warns`
        } else {
            this.props.description += `Cleared ${user}'s warns`
        }
        db.findOne({
            guildID: message.guild.id,
            user: user.id
        }, async (err, data) => {
            if (err) throw err;
            if (data) {
                await db.findOneAndDelete({
                    guildID: message.guild.id,
                    user: user.id
                })
            }
        })
    }
}//FIXME: NO DEV to stop warn clears. Also nothing to say if there is no data. Doesn't break though
