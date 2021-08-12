const TicketCommand = require('../../classes/ticketcommand.class');

// Ticket
module.exports = class GenericTicketCommand extends TicketCommand {
    constructor() {
        let comprops = {
            name: "ticket",
            category: "meta",
            description: "Generic Ticket",
            parentID: "828158895024766986"
        }
        super(
            {...comprops}
        )
    }
}
