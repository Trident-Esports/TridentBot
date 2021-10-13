//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class EventHelpCommand extends HelpListingCommand {
    constructor() {
        super(
            {
                name: "eventhelp",
                aliases: [ 'evh' ],
                category: "information",
                description: "Bot Event Help",
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
            dummy = new EventHelpCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(client, message, args, null, "")
        }
    }
}
