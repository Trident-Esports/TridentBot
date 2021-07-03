const VillainsCommand = require('../classes/vcommand.class');
const VillainsEmbed = require('../classes/vembed.class');

const fs = require('fs');
let defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))

module.exports = class BotDiscordInviteCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "botdiscord",
            category: "meta",
            description: "Bot Discord Invite"
        }
        super(comprops)
    }

    async action(client, message) {
        this.props.title = { text: "Join VillainsBot's Discord!" }

        let url = ""
        if(defaults?.discord?.invites?.bot?.code) {
            url += "https://discord.gg/"
            url += defaults.discord.invites.bot.code
            this.props.title.url = url
            this.props.description = url
        } else {
            this.error = true
            this.props.title.text = "Error"
            this.props.description = "No invite code found in defaults."
        }
    }
}
