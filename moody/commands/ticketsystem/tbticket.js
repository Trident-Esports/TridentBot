const TicketCommand = require('../../classes/ticketcommand.class');

// Ticket
module.exports = class TheBoysTicketCommand extends TicketCommand {
    constructor() {
        let comprops = {
            name: "tbticket",
            category: "meta",
            description: "The Boys' Ticket",
            parentID: "guys"
        }
        super(
            {...comprops}
        )
    }
}
