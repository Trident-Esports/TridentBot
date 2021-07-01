const ATMCommand = require('../../classes/atmcommand.class');

module.exports = class DepositCommand extends ATMCommand {
    constructor() {
        super({
            name: 'deposit',
            aliases: ['dep'],
            description: 'Deposit gold into your bank'
        });
    }
};
