//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const fs = require('fs');

module.exports = class BotInviteCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "botinvite",
            group: "meta",
            memberName: "botinvite",
            description: "Bot Invite",
            guildOnly: true
        }
        let props = {
            caption: {
                text: "Bot Invite"
            }
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async action(client, message) {
        let url = ""
        let defaults = JSON.parse(fs.readFileSync("./src/dbs/defaults.json", "utf8"))

        if (!defaults) {
            this.error = true
            this.props.description = "Failed to get bot defaults information."
            return
        }

        if(
          client?.user?.id &&
          defaults?.bot?.scope &&
          defaults?.bot?.permissions
        ) {
            url += "https://discord.com/oauth2/authorize"
            url += "?client_id=" + client.user.id
            url += "&scope=" + defaults.bot.scope
            url += "&permissions=" + defaults.bot.permissions
            this.props.description = `***[Invite @TridentBot to your Discord!](${url} '${url}')***`
        } else {
            this.error = true
            this.props.description = "No invite link found in defaults."
            return
        }
    }

    async test(client, message) {
        let dummy = null
        dummy = new BotInviteCommand(client)
        dummy.run(message, [])
    }
}
