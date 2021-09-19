//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class');

module.exports = class GameHelpCommand extends HelpListingCommand {
    constructor() {
        let comprops = {
            name: 'gamehelp',
            aliases: ['gh'],
            category: 'game',
            description: 'This is a help embed',
            helpslug: 'game/dbs/help'
        }
        let props = {
            caption: {
                text: "Game Help"
            }
        }
        super(comprops, props)
    }

    async test(client, message) {
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
            let args = baseArgs.concat([ added ])
            dummy = new GameHelpCommand()
            dummy.props.footer.msg = args.join('|')
            dummy.run(client, message, args, null, "")
        }
    }
}
