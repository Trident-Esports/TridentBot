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
                ownerOnly: true
            }
        );
    }
};
