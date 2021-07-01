const VillainsCommand = require('../classes/vcommand.class');
const VillainsEmbed = require('../classes/vembed.class');

module.exports = class PingCommand extends VillainsCommand {
    constructor() {
        super({
            name: "ping",
            category: "diagnostic",
            description: "This is a ping command"
        })
    }

    async run(client, message, args) {
        let props = {
            title: { text: "Pong!" },
            image: "https://media.tenor.com/images/1ddabd76ee02cff6e98e7b012243ce6a/tenor.gif"
        }
        let embed = new VillainsEmbed(props)
        await super.send(message, embed)
    }
}
