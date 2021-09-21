//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class');

module.exports = class GameHelpCommand extends HelpListingCommand {
    constructor(client) {
        let comprops = {
            name: 'gamehelp',
            aliases: ['gh'],
            group: 'game',
            memberName: 'gamehelp',
            description: 'Game Help',
            guildOnly: true,
            args: [
                {
                    key: "searchTerm",
                    prompt: "Section/Term",
                    type: "string"
                },
                {
                    key: "searchTerm",
                    prompt: "Term",
                    type: "string"
                }
            ]
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
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new GameHelpCommand(client)
            dummy.props.footer.msg = args.join(" | ")
            await dummy.run(message, args)
        }
    }
}
