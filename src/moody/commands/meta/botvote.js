//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class BotVoteCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "botvote",
            group: "meta",
            memberName: "botvote",
            description: "Bot Vote"
        }
        let props = {
            caption: {
                text: "Bot Vote"
            }
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async action(message) {
        let url = `https://top.gg/bot/${client.user.id}/vote`
        this.props.description = `***[Vote for @TridentBot on top.gg!](${url} '${url}')***`

        this.props.footer = {
            msg: "Prizes for Voting COMING SOON!"
        }
    }

    async test(message) {
        let dummy = null
        dummy = new BotVoteCommand()
        dummy.run(client, message, [], null, "")
    }
}
