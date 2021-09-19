//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class ModHelpCommand extends HelpListingCommand {
    constructor() {
        super(
            {
                name: "mod",
                category: "information",
                description: "Mod Help",
                flags: {
                    user: "unapplicable"
                },
                helpslug: "mod"
            }
        )
    }
}
