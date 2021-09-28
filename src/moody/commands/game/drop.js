//@ts-check

const ShopCommand = require('../../classes/command/shopcommand.class');

module.exports = class DropCommand extends ShopCommand {
    constructor(client) {
        super(
            client,
            {
                name: 'drop',
                group: 'game',
                memberName: 'drop',
                description: 'Drop a piece of Inventory',
                guildOnly: true
            },
            {
                extensions: ["levels", "profile", "inventory", "xpboost", "health"]
            }
        );
    }
};
