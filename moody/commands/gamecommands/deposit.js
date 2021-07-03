const ATMCommand = require('../../classes/atmcommand.class');

module.exports = class DepositCommand extends ATMCommand {
    constructor() {
        let comprops = {
            name: 'deposit',
            aliases: ['dep'],
            description: 'Deposit gold into your bank',
            flags: {
                user: "default",
                target: "invalid",
                bot: "invalid"
            }
        }
        super(comprops)
    }
}
