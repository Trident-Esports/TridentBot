//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class HelpCommand extends HelpListingCommand {
    constructor(client) {
        super(
            client,
            {
                name: "bothelp",
                group: "info",
                memberName: "help",
                description: "Bot Help"
            },
            {
                helpslug: "dbs/help"
            }
        )
    }

    async test(message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          "invite",
          "giveaway"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new HelpCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
