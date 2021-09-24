//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class BonkCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "bonk",
            group: "fun",
            memberName: "bonk",
            description: "Bonk!",
            guildOnly: true,
            args: [
                {
                    key: "target",
                    prompt: "User to Bonk?",
                    type: "member|user"
                }
            ]
        }
        super(
            client,
            {...comprops},
            {
                flags: {
                    user: "invalid",
                    target: "required",
                    bot: "invalid"
                }
            }
        )
    }

    async action(message, args) {
        const target = args.target
        this.props.description = `<@${message.author.id}> just bonked <@${target.id}>🔨`
    }

    async test(message, args) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          message.author.username,
          message.author.id,
          message.client.user.username,
          "Wanrae"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new BonkCommand(message.client)
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
