//@ts-check

const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class RefundCommand extends ATMCommand {
    constructor(client) {
        super(
            client,
            {
                name: 'refund',
                group: 'game',
                memberName: 'refund',
                description: 'Refund Gold to a user',
                guildOnly: true,
                ownerOnly: true,
            args: [
                {
                    key: "amount",
                    prompt: "How much do you want to refund?",
                    type: "integer"
                },
                {
                    key: "target",
                    prompt: "Who do you want to refund it to?",
                    type: "member|user"
                }
            ]
            }
        );
    }
};
