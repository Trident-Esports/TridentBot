//@ts-check

const HelpListingCommand = require('../../classes/command/helplistingcommand.class')

module.exports = class BotHelpCommand extends HelpListingCommand {
    constructor(client) {
        super(
            client,
            {
                name: "bothelp",
                group: "info",
                aliases: [ "h", "bh" ],
                memberName: "bothelp",
                description: "Bot Help",
                guildOnly: true
            },
            {
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
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new BotHelpCommand(client)
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
