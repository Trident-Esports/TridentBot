//@ts-check

const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class StealCommand extends ATMCommand {
    constructor(client) {
        let comprops = {
            name: 'steal',
            group: 'game',
            memberName: 'steal',
            description: 'Steal Gold from a user',
            guildOnly: true,
            args: [
                {
                    key: "amount",
                    prompt: "How much do you want to steal?",
                    type: "integer"
                },
                {
                    key: "target",
                    prompt: "Who do you want to steal it from?",
                    type: "member|user"
                }
            ]
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
