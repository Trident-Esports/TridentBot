const ShopCommand = require('../../classes/command/shopcommand.class');

module.exports = class BuyCommand extends ShopCommand {
    constructor() {
        let comprops = {
            name: 'buy',
            category: 'game',
            description: 'Buy an Item from the Store',
            extensions: [ "inventory", "profile" ]
        }
        super(comprops)
    }
}
