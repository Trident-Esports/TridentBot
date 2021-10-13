//@ts-check

const TicketCommand = require('../../classes/command/ticketcommand.class');

module.exports = class QueensTicketCommand extends TicketCommand {
    constructor() {
        let comprops = {
            name: "qbticket",
            category: "meta",
            description: "Queen's Babies Ticket",
            parentID: "gals"
        }
        super(
            {...comprops}
        )
    }
}
