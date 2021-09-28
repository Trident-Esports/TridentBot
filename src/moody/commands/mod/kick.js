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
            ],
            args: [
                {
                    key: "target",
                    prompt: "Who to Kick?",
                    type: "member|user"
                },
                {
                    key: "reason",
                    prompt: "Reasone to Kick?",
                    type: "string"
                }
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

    async action(message, args) {
        const loaded = args.target
        let member = loaded

        if(!(loaded)) {
            this.error = true
            this.props.description = `Couldn't find user. '${loaded}' given.`
            return
        }

        if (!(loaded?.id)) {
            member = await message.guild.members.cache.filter(
                (m) =>
                    m.user.id                     === loaded ||
                    m.user.username.toLowerCase() === loaded.toLowerCase() ||
                    false
            ).first()
            if(!member) {
                this.error = true
                this.props.description = `Couldn't convert ${loaded} (ID:${loaded.id}) to a Member object.`
                return
            }
            member = member?.user ? member.user : member
        }

        if(! this.DEV) {
            // Do the thing
            let reason = args.reason
            member.kick({ reason: reason })
            this.props.description = `<@${member.id}> has been kicked from the server`
            if(args?.reason) {
                this.props.description += "\n"
                this.props.description += `Reason: [${args?.reason}]`
            }
            this.props.image = "https://i.pinimg.com/originals/71/71/6c/71716cc590ce7970ac82e8457d787147.gif"
        } else {
            // Describe the thing
            this.props.description = `<@${member.id}> *would be* **kicked** if this wasn't in DEV Mode. (Reason: '${args?.reason ? args.reason : ''}')`
        }
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          { target: message.author.username },
          { target: message.author.id },
          { target: client.user.username },
          { target: "Wanrae" }
        ]

        for(let added of varArgs) {
            let args = added
            dummy = new KickCommand(client)
            dummy.props.footer.msg = typeof args === "object" && typeof args.join === "function" ? args.join(" | ") : '```' + JSON.stringify(args) + '```'
            await dummy.run(message, args)
        }
    }
}
