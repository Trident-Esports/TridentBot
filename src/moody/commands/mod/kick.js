//@ts-check

const ModCommand = require('../../classes/command/modcommand.class');

module.exports = class KickCommand extends ModCommand {
    constructor(client) {
        let comprops = {
            name: "kick",
            group: "admin",
            memberName: "kick",
            description: "Kick user",
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
            {...comprops},
            {
                flags: {
                    bot: "optional"
                }
            }
        )
    }

    async action(client, message) {
        const member = message.guild.members.cache.get(this.inputData.loaded.id)

        if (!member) {
            this.error = true
            this.props.description = `Couldn't convert ${this.inputData.loaded} (ID:${this.inputData.loaded.id}) to a Member object.`
            return
        }

        if(! this.DEV) {
            // Do the thing
            let reason = this.inputData.args.join(" ")
            member.kick({ reason: reason })
            this.props.description = `<@${member.id}> has been kicked from the server`
            if(this.inputData.args.join(" ") != "") {
                this.props.description += "\n"
                this.props.description += `Reason: [${reason}]`
            }
            this.props.image = "https://i.pinimg.com/originals/71/71/6c/71716cc590ce7970ac82e8457d787147.gif"
        } else {
            // Describe the thing
            this.props.description = `<@${member.id}> *would be* **kicked** if this wasn't in DEV Mode`
        }
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          message.author.username,
          message.author.id,
          client.user.username,
          "Wanrae"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new KickCommand(client)
            dummy.props.footer.msg = args.join(" | ")
            await dummy.run(message, args)
        }
    }
}
