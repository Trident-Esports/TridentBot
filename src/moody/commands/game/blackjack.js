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

    async action(client, message) {
        this.props.description = [
            "`Coming Soon!`"
        ].join("\n")
    }

    async test(client, message) {
        let dummy = null
        dummy = new BlackjackCommand(client)
        dummy.run(message, [])
    }
}
