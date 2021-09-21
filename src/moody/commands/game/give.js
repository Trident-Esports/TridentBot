//@ts-check

const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class GiveCommand extends ATMCommand {
    constructor(client) {
        let comprops = {
            name: 'give',
            group: 'game',
            memberName: 'give',
            description: 'Give Gold to another user',
            guildOnly: true,
            args: [
                {
                    key: "amount",
                    prompt: "How much do you want to give?",
                    type: "integer"
                },
                {
                    key: "target",
                    prompt: "Who do you want to give it to?",
                    type: "member|user"
                }
            ]
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
