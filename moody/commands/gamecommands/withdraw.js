const ATMCommand = require('../../classes/atmcommand.class');

module.exports = class WithdrawCommand extends ATMCommand {
    constructor() {
        super({
            name: 'withdraw',
            aliases: ['wd','with'],
            description: 'Withdraw gold from your bank'
        });
    }
};
