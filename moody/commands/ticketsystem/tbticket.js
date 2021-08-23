const TicketCommand = require('../../classes/ticketcommand.class');

// Ticket
module.exports = class TheBoysTicketCommand extends TicketCommand {
    constructor() {
        let comprops = {
            name: "tbticket",
            category: "meta",
            description: "The Boys' Ticket",
            parentID: "828154951834271765"
        }
        super(
            {...comprops}
        )
    }
}
