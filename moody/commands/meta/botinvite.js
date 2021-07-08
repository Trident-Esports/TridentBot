const VillainsCommand = require('../../classes/vcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');
let defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))

module.exports = class BotInviteCommand extends VillainsCommand {
    //FIXME: Not setting URL
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
        super(comprops, props)
    }

    async action(client, message) {
        let url = ""
        if(
          defaults?.bot?.clientID &&
          defaults?.bot?.scope &&
          defaults?.bot?.permissions
        ) {
            url += "https://discord.com/oauth2/authorize"
            url += "?client_id=" + defaults.bot.clientID
            url += "&scope=" + defaults.bot.scope
            url += "&permissions=" + defaults.bot.permissions
            this.props.description = `***[Invite @VillainsBot to your Discord!](${url})***`
        } else {
            this.error = true
            this.props.title.text = "Error"
            this.props.description = "No invite link found in defaults."
        }
    }
}
