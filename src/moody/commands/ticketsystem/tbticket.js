//@ts-check

const TicketCommand = require('../../classes/command/ticketcommand.class');

module.exports = class TheBoysTicketCommand extends TicketCommand {
    constructor(client) {
        let comprops = {
            name: "tbticket",
            group: "meta",
            memberName: "tbticket",
            description: "The Boys' Ticket",
            guildOnly: true
        }
        super(
            client,
            {...comprops},
            {
                parentID: "guys"
            }
        )
    }
}
