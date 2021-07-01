const ATMCommand = require('../../classes/atmcommand.class');

module.exports = class StealCommand extends ATMCommand {
    constructor() {
        super({
            name: 'steal',
            description: 'Steal gold from a user'
        });
    }
};
