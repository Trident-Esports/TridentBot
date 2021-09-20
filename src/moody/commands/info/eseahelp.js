//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class EseaHelpCommand extends HelpListingCommand {
    constructor(client) {
        super(
            client,
            {
                name: "eseahelp",
                group: "info",
                memberName: "eseahelp",
                description: "ESEA Help"
            },
            {
                helpslug: "dbs/eseahelp"
            }
        )
    }

    async test(message) {
        let dummy = null
        dummy = new EseaHelpCommand()
        dummy.run(client, message, [], null, "")
    }
}
