const ATMCommand = require('../../classes/atmcommand.class');

module.exports = class StealCommand extends ATMCommand {
    constructor() {
        let comprops = {
            name: 'steal',
            description: 'Steal gold from a user',
            flags: {
                user: "invalid",
                target: "required",
                bot: "invalid"
            }
        }
        super(
            {...comprops}
        )
    }
}
