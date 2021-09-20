//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class ModHelpCommand extends HelpListingCommand {
    constructor(client) {
        super(
            client,
            {
                name: "mod",
                group: "info",
                memberName: "mod",
                description: "Mod Help"
            },
            {
                flags: {
                    user: "unapplicable"
                },
                helpslug: "dbs/mod"
            }
        )
    }

    async test(message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          "purge",
          "warn"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new ModHelpCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
