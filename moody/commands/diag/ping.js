const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class PingCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "ping",
            category: "diagnostic",
            description: "This is a ping command"
        }
        let props = {
            title: { text: "Pong!" },
            image: "https://thumbs.gfycat.com/VariableNervousAfricancivet-small.gif"
        }
        super(comprops, props)
    }
}
