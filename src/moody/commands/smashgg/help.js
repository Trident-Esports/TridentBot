//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class EventHelpCommand extends HelpListingCommand {
    constructor() {
        super(
            {
                name: "eventhelp",
                aliases: [ 'evh' ],
                category: "information",
                description: "Bot Event Help",
                helpslug: "dbs/eventhelp"
            }
        )
    }
}
