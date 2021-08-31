//@ts-check

const TicketCommand = require('../../classes/command/ticketcommand.class');

module.exports = class GenericTicketCommand extends TicketCommand {
    constructor() {
        let comprops = {
            name: "ticket",
            category: "meta",
            description: "Generic Ticket",
            parentID: "generic"
        }
        super(
            {...comprops}
        )
    }
}
