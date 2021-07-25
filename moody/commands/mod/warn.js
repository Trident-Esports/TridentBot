const ModCommand = require('../../classes/modcommand.class');
const db = require('../../../models/warns')

module.exports = class WarnCommand extends ModCommand {
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
            return
        }

        const reason = this.inputData.args.join(" ")

        if (this.DEV) {
            this.props.description = `!! DEV !! - Warning <@${user.id}> for ${reason}`
        } else {
            this.props.description = `Warning <@${user.id}> for ${reason}`
            this.props.color = 'RED'
        }

        if (!reason) {
            this.error = true
            this.props.description = this.errors.noReason
            return
        }

        if(!(this.error)) {
            db.findOne({
                guildID: message.guild.id,
                user: user.id
            }, async (err, data) => {
                if (err) throw err;

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
            });
        }
    }
}
