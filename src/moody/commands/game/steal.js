//@ts-check

const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class StealCommand extends ATMCommand {
    constructor(client) {
        let comprops = {
            name: 'steal',
            group: 'game',
            memberName: 'steal',
            description: 'Steal Gold from a user',
            guildOnly: true
        }
        super(
            client,
            {...comprops},
            {
                flags: {
                    user: "invalid",
                    target: "required",
                    bot: "invalid"
                }
            }
        )
    }
}
