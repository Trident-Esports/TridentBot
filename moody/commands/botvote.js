const VillainsCommand = require('../classes/vcommand.class');
const VillainsEmbed = require('../classes/vembed.class');


module.exports = class BotVoteCommand extends VillainsCommand {
    constructor() {
        super({
            name: "botvote",
            category: "meta",
            description: "Bot Vote"
        })
    }

    async run(client, message, args) {
        let props = {
            title: { text: "Vote for @VillainsBot on Top.gg!" }
        }
        let url = ""
        url += "https://top.gg/bot/"
        url += "828317713256415252"
        url += "/vote"
        props.title.url = url

        let embed = new VillainsEmbed(props)
        await super.send(message, embed)
    }
}
