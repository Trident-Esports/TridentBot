const ShopCommand = require('../../classes/shopcommand.class');

module.exports = class UseCommand extends ShopCommand {
    constructor() {
        super({
            name: 'use',
            description: 'Use your items',
            extensions: ["levels", "profile", "inventory", "xpboost", "health"]
        });
    }
};
