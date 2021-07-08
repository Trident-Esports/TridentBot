const VillainsCommand = require('../../classes/vcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class BotVoteCommand extends VillainsCommand {
    //FIXME: Not setting URL
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
        super(comprops, props)
    }

    async action(client, message) {
        let url = ""
        url += "https://top.gg/bot/"
        url += "828317713256415252"
        url += "/vote"
        this.props.description = `***[Vote for @VillainsBot on top.gg!](${url})***`

        this.props.footer = {
            msg: "Prizes for Voting COMING SOON!"
        } //FIXME: does not add a footer
    }
}
