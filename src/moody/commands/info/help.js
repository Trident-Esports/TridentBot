//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class HelpCommand extends HelpListingCommand {
    constructor() {
        super(
            {
                name: "help",
                aliases: [ 'h' ],
                category: "information",
                description: "Bot Help",
                helpslug: "help"
            }
        )
    }
}
