//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const { Args } = require('@sapphire/framework')

module.exports = class TestSuiteCommand extends VillainsCommand {
    constructor(context) {
        let comprops = {
            name: "testsuite",
            category: "diagnostic",
            description: "Tester"
        }
        super(
            context,
            {...comprops},
            {}
        )
    }

    async action(message, args) {
        this.null = true

        const commands = message.client.stores.get("commands")

        const cmd = args?.parser?.parserOutput?.ordered?.map(a => a.value)[0] || args[0]

        if (commands && commands.get(cmd)) {
            const command = commands.get(cmd)
            const inst = new command.constructor(message.client)
            inst.test(message, cmd)
        }
    }
}
