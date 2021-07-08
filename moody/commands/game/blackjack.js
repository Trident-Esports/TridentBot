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

    async action(client, message) {
        this.props.description = [
            "`Coming Soon!`"
        ].join("\n")
    }
}
