//@ts-check

const ModCommand = require('../../classes/command/modcommand.class');
const db = require('../../../models/warns')

module.exports = class WarnCommand extends ModCommand {
    constructor(client) {
        let comprops = {
            name: "warn",
            aliases: [],
            group: "admin",
            memberName: "warn",
            description: "Warns user",
            guildOnly: true,
            clientPermissions: [
                "KICK_MEMBERS"
            ],
            userPermissions: [
                "KICK_MEMBERS"
            ]

        }
        super(
            client,
            //@ts-ignore
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

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          `${message.author.username} bLeH`,
          `${message.author.id} bLeH`,
          `${client.user.username} bLeH`,
          "Wanrae bLeH"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new WarnCommand(client)
            dummy.props.footer.msg = args.join(" | ")
            await dummy.run(message, args)
        }
    }
}
