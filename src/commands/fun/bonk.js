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

    async action(message, args, cmd) {
        const loaded = this.inputData.loaded

        this.props.description = `<@${message.author.id}> just bonked <@${loaded.id}>🔨`
    }

    async test(message, cmd) {
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
            dummy = new BonkCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args, cmd)
        }
    }
}
