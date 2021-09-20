//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class ModHelpCommand extends HelpListingCommand {
    constructor() {
        super(
            {
                name: "mod",
                category: "information",
                description: "Mod Help",
                flags: {
                    user: "unapplicable"
                },
                helpslug: "dbs/mod"
            }
        )
    }

    async test(client, message) {
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
            dummy.run(client, message, args, null, "")
        }
    }
}
