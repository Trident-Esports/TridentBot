//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const fs = require('fs');

module.exports = class BotInviteCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "botinvite",
            category: "meta",
            description: "Bot Invite"
        }
        let props = {
            caption: {
                text: "Bot Invite"
            }
        }
        super(
            {...comprops},
            {...props}
        )
    }

    async action(client, message) {
        let defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))

        let url = ""
        let defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))

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
            this.props.description = `***[Invite @VillainsBot to your Discord!](${url} '${url}')***`
        } else {
            this.error = true
            this.props.description = "No invite link found in defaults."
            return
        }
    }
}
