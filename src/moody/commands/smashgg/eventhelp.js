//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class EventHelpCommand extends HelpListingCommand {
    constructor(client) {
        super(
            client,
            {
                name: "eventhelp",
                aliases: [ 'evh' ],
                group: "info",
                memberName: "eventhelp",
                description: "Bot Event Help"
            },
            {
                helpslug: "dbs/eventhelp"
            }
        )
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          "help"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new EventHelpCommand(client)
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
