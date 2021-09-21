//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class PingCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "ping",
            group: "diag",
            memberName: "ping",
            description: "This is a ping command"
        }
        let props = {
            title: { text: "Pong!" },
            image: "https://thumbs.gfycat.com/VariableNervousAfricancivet-small.gif"
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async test(client, message) {
        this.run(message, [])
    }
}
