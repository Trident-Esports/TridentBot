const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class GiveCommand extends ATMCommand {
    constructor() {
        let comprops = {
            name: 'give',
            description: 'Give gold to another user',
            flags: {
                user: "invalid",
                target: "required",
                bot: "invalid"
            }
        }
        super(comprops)
    }
}
