const VillainsCommand = require('../classes/vcommand.class');
const VillainsEmbed = require('../classes/vembed.class');

const fs = require('fs');
let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))

module.exports = class DiscordInviteCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "discord",
            category: "meta",
            description: "Discord Invite"
        }
        super(comprops)
    }

    async action(client, message) {
        this.props.title = { text: "Join our Discord!" }
        let url = ""
        if(GLOBALS?.discord?.invites?.home?.code) {
            url += "https://discord.gg/"
            url += GLOBALS.discord.invites.home.code
            this.props.title.url = url
            this.props.description = url
        } else {
            this.error = true
            this.props.title.text = "Error"
            this.props.description = "No invite code found in profile."
        }
    }
}
