const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class WithdrawCommand extends ATMCommand {
    constructor() {
        let comprops = {
            name: 'withdraw',
            aliases: ['wd','with'],
            description: 'Withdraw gold from your bank',
            flags: {
                user: "default",
                target: "invalid",
                bot: "invalid"
            }
        }
        super(comprops)
    }
}
