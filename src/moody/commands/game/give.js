//@ts-check

const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class GiveCommand extends ATMCommand {
    constructor(client) {
        let comprops = {
            name: 'give',
            group: 'game',
            memberName: 'give',
            description: 'Give Gold to another user',
            guildOnly: true
        }
        let props = {
            flags: {
                user: "invalid",
                target: "required",
                bot: "invalid"
            }
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }
}
