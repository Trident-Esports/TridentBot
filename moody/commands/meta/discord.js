const VillainsCommand = require('../../classes/vcommand.class');

const fs = require('fs');
let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))

module.exports = class DiscordInviteCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "discord",
            category: "meta",
            description: "Discord Invite"
        }
        let props = {
            caption: {
                text: "Community Discord"
            }
        }
        super(comprops, props)
    }

    async action(client, message) {
        let url = ""
        if(GLOBALS?.discord?.invites?.home?.code) {
            url += "https://discord.gg/"
            url += GLOBALS.discord.invites.home.code
            this.props.description = url
            this.props.description = `***[Join our Discord!](${url})***`
        } else {
            this.error = true
            this.props.title.text = "Error"
            this.props.description = "No invite code found in profile."
        }
    }
}
