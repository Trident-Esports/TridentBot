//@ts-check

const TicketCommand = require('../../classes/command/ticketcommand.class');

module.exports = class GenericTicketCommand extends TicketCommand {
    constructor(client) {
        let comprops = {
            name: "ticket",
            group: "meta",
            memberName: "ticket",
            description: "Generic Ticket",
            guildOnly: true
        }
        super(
            client,
            {...comprops},
            {
                parentID: "generic"
            }
        )
    }
}
