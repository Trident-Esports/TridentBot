const VillainsCommand = require('../../classes/vcommand.class');

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

    async action(client, message) {
        let url = `https://top.gg/bot/${client.user.id}/vote`
        this.props.description = `***[Vote for @VillainsBot on top.gg!](${url} '${url}')***`

        this.props.footer = {
            msg: "Prizes for Voting COMING SOON!"
        }
    }
}
