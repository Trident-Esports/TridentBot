//@ts-check

const GameCommand = require('../../classes/command/gamecommand.class');

module.exports = class BlackjackCommand extends GameCommand {
    constructor(client) {
        super(
            client,
            {
                name: 'blackjack',
                group: 'game',
                aliases: ['bj'],
                memberName: 'blackjack',
                description: 'Play some BlackJack',
            }
        );
    }

    async action(message) {
        this.props.description = [
            "`Coming Soon!`"
        ].join("\n")
    }

    async test(message) {
        let dummy = null
        dummy = new BlackjackCommand()
        dummy.run(client, message, [], null, "")
    }
}
