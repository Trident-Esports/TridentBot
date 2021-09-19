//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class HelpCommand extends HelpListingCommand {
    constructor() {
        super(
            {
                name: "help",
                aliases: [ 'h' ],
                category: "information",
                description: "Bot Help",
                helpslug: "dbs/help"
            }
        )
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          "invite",
          "giveaway"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ added ])
            dummy = new HelpCommand()
            dummy.props.footer.msg = args.join('|')
            dummy.run(client, message, args, null, "")
        }
    }
}
