//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class');

module.exports = class GameHelpCommand extends HelpListingCommand {
    constructor(client) {
        let comprops = {
            name: 'gamehelp',
            aliases: ['gh'],
            group: 'game',
            memberName: 'gamehelp',
            description: 'Game Help'
        }
        let props = {
            helpslug: 'game/dbs/help',
            caption: {
                text: "Game Help"
            }
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async test(message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          "personal",
          "balance",
          "fight",
          "give"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new GameHelpCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
