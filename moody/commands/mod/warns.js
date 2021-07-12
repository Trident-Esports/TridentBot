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
        super(comprops)
    }

    async action(client, message) {

        const user = this.inputData.loaded

        if (!user) {
            this.error = true
            this.props.description = this.errors.cantActionSelf
        }

        db.findOne({
            guildID: message.guild.id,
            user: user.id
        }, async (err, data) => {
            if (err) throw err;
            if (data) {
                this.props.title.text = `${user.tag}'s warns`
                this.props.description = data.content.map((w, i) => `\`${i + 1}\` | Moderator : ${message.guild.members.cache.get(w.moderator).user.tag}\nReason : ${w.reason}`)
                this.props.color = "#00A3FF"
            } else {
                this.error = true
                this.props.description = this.errors.noProfile
            }
            console.log(data)
        })
    }
}//FIZME: Can't figure out the mapping for the warns. Shows nothing.
