const VillainsCommand = require('../../classes/vcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class TestCommand extends VillainsCommand {
    constructor() {
        super({
            name: "test",
            category: "diagnostic",
            description: "This is a test command"
        })
    }

    async action(client, message) {
        if (this.inputData.loaded) {
            this.props.description = `<@${this.inputData.loaded.id}>`
        }
        console.log(this.inputData)
    }
}
