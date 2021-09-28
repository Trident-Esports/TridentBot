//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class TestCommand extends VillainsCommand {
    constructor(client) {
        super(
            client,
            {
                name: "test",
                group: "diag",
                memberName: "test",
                description: "This is a test command",
                hidden: true
            }
        )
    }

    async action() {
        if (this.inputData.loaded) {
            this.props.description = `<@${this.inputData.loaded.id}>`
        }
        console.log(this.inputData)
    }
}
