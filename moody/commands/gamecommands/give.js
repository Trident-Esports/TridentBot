const ATMCommand = require('../../classes/atmcommand.class');

module.exports = class GiveCommand extends ATMCommand {
    constructor() {
        super({
            name: 'give',
            description: 'Give gold to another user'
        });
    }
};
