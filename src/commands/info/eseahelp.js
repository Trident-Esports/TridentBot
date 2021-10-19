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

    async test(message, cmd) {
        let dummy = null
        dummy = new EseaHelpCommand()
        await dummy.run(message, [], cmd)
    }
}
