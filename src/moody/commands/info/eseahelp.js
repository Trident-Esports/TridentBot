//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class EseaHelpCommand extends HelpListingCommand {
    constructor() {
        super(
            {
                name: "eseahelp",
                category: "information",
                description: "ESEA Help",
                helpslug: "dbs/eseahelp"
            }
        )
    }

    async test(client, message) {
        let dummy = null
        dummy = new EseaHelpCommand()
        dummy.run(client, message, [], null, "")
    }
}
