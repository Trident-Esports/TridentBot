const ShopCommand = require('../../classes/shopcommand.class');

module.exports = class BuyCommand extends ShopCommand {
    constructor() {
        super({
            name: 'buy',
            category: 'game',
            description: 'Buy an Item from the Store',
            extensions: [ "inventory", "profile" ]
        });
    }
}
