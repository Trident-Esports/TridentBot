//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class EseaHelpCommand extends HelpListingCommand {
    constructor(client) {
        super(
            client,
            {
                name: "eseahelp",
                group: "info",
                memberName: "eseahelp",
                description: "ESEA Help"
            },
            {
                helpslug: "dbs/eseahelp"
            }
        )
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          "esea"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new EseaHelpCommand(client)
            dummy.props.footer.msg = args.join(" | ")
            await dummy.run(message, args)
        }
    }
}
