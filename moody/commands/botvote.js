const VillainsCommand = require('../classes/vcommand.class');
const VillainsEmbed = require('../classes/vembed.class');


module.exports = class BotVoteCommand extends VillainsCommand {
    //FIXME: Not setting URL
    constructor() {
        let comprops = {
            name: "botvote",
            category: "meta",
            description: "Bot Vote"
        }
        super(comprops)
    }

    async action(client, message) {
        this.props.title = { text: "Vote for @VillainsBot on Top.gg!" }
        let url = ""
        url += "https://top.gg/bot/"
        url += "828317713256415252"
        url += "/vote"
        this.props.title.url = url
    }
}
