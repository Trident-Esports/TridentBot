//@ts-check

const TicketCommand = require('../../classes/command/ticketcommand.class');

module.exports = class TheBoysTicketCommand extends TicketCommand {
    constructor() {
        let comprops = {
            name: "tbticket",
            category: "meta",
            description: "The Boys' Ticket",
            parentID: "828154951834271765"
        }
        super(comprops)
    }
}
