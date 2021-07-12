const ModCommand = require('../../classes/modcommand.class');
const db = require('../../../models/warns')

//FIXME: Like Unmute
module.exports = class MuteCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "warn",
            aliases: [],
            category: "admin",
            description: "Warns user"
        }
        super(comprops)
    }

    async action(client, message) {

        const user = this.inputData.loaded

        if (!user) {
            this.error = true
            this.props.description = this.errors.cantActionSelf
        }

        const reason = this.inputData.args.join(" ")

        if (this.DEV) {
            this.props.description += `!! DEV !! - Warned ${user} for ${reason}`
        } else {
            this.props.description = `Warned ${user} for ${reason}`
            this.props.color = 'RED'
        }

        if (!reason) {
            this.error = true
            this.props.description = this.errors.noReason
        }

        db.findOne({
            guildID: message.guild.id,
            user: user.id
        }, async (err, data) => {
            if (err) throw err;
            if (this.DEV) {
                msg = "!! DEV !! - Warned for " + reason
            } else {
                if (!data) {
                    data = new db({
                        guildID: message.guild.id,
                        user: user.id,
                        content: [{
                            moderator: message.author.id,
                            reason: reason
                        }]
                    })
                } else {
                    const obj = {
                        moderator: message.author.id,
                        reason: reason
                    }
                    if (!obj.reason) {
                        data = false
                    } else {
                        data.content.push(obj)
                    }
                }
                data.save()
            }
        });
    }
}