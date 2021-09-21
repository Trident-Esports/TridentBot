//@ts-check

const ShopCommand = require('../../classes/command/shopcommand.class');

module.exports = class UseCommand extends ShopCommand {
    constructor(client) {
        super(
            client,
            {
                name: 'use',
                aliases: [ 'u' ],
                group: 'game',
                memberName: 'use',
                description: 'Use your Inventory',
                guildOnly: true,
                args: [
                    {
                        key: "item",
                        prompt: "What do you want to buy?",
                        type: "string"
                    }
                ]
            },
            {
                extensions: ["levels", "profile", "inventory", "xpboost", "health"]
            }
        );
    }
};
