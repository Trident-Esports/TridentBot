//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class BonkCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "bonk",
            group: "fun",
            memberName: "bonk",
            description: "Bonk!",
            flags: {
                user: "invalid",
                target: "required",
                bot: "invalid"
            }
        }
        super(
            client,
            {...comprops}
        )
    }

    async action(message, args) {
        const loaded = this.inputData.loaded

        this.props.description = `<@${message.author.id}> just bonked <@${loaded.id}>🔨`
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
