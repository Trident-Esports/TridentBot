//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class BonkCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "bonk",
            category: "fun",
            description: "Bonk!",
            flags: {
                user: "invalid",
                target: "required",
                bot: "invalid"
            }
        }
        super(
            {...comprops}
        )
    }

    async action(client, message) {
        const loaded = this.inputData.loaded

        this.props.description = `<@${message.author.id}> just bonked <@${loaded.id}>🔨`
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
            dummy = new BonkCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(client, message, args, null, "")
        }
    }
}
