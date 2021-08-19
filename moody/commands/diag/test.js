//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

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
