//@ts-check

const TicketCommand = require('../../classes/command/ticketcommand.class');

module.exports = class QueensTicketCommand extends TicketCommand {
    constructor(client) {
        let comprops = {
            name: "qbticket",
            group: "meta",
            memberName: "qbticket",
            description: "Queen's Babies Ticket",
            guildOnly: true
        }
        super(
            client,
            {...comprops},
            {
                parentID: "gals"
            }
        )
    }
}
