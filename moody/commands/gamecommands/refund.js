const ATMCommand = require('../../classes/atmcommand.class');

module.exports = class RefundCommand extends ATMCommand {
    constructor() {
        super({
            name: 'refund',
            description: 'Refund gold to a user'
        });
    }
};
