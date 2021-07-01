const GameCommand = require('../../classes/gamecommand.class');

module.exports = class BlackjackCommand extends GameCommand {
    constructor() {
        super({
            name: 'blackjack',
            category: 'game',
            aliases: ['bj'],
            description: 'Play some BlackJack',
        });
    }

    async run(client, message) {
        let msg = [
            "`Coming Soon!`"
        ]
        await message.channel.send(msg);
    }
}