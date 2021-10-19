//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class BotVoteCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "botvote",
            category: "meta",
            description: "Bot Vote"
        }
        let props = {
            caption: {
                text: "Bot Vote"
            }
        }
        super(
            {...comprops},
            {...props}
        )
    }

    async action(message, args, cmd) {
        let client = message.client
        let url = `https://top.gg/bot/${client.user.id}/vote`
        this.props.description = `***[Vote for @TridentBot on top.gg!](${url} '${url}')***`

        this.props.footer = {
            msg: "Prizes for Voting COMING SOON!"
        }
    }

    async test(message, cmd) {
        let dummy = null
        dummy = new BotVoteCommand()
        await dummy.run(message, [], cmd)
    }
}
