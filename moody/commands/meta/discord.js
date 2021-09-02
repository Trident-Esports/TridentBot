const VillainsCommand = require('../../classes/vcommand.class');

const fs = require('fs');
let GLOBALS = null
try {
    GLOBALS = JSON.parse(fs.readFileSync("./PROFILE.json", "utf8"))
} catch(err) {
    console.log("Discord Invite: PROFILE manifest not found!")
    process.exit(1)
}

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
        super(
            {...comprops},
            {...props}
        )
    }

    async action(client, message) {
        let url = ""
        let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))

        if (!GLOBALS) {
            this.error = true
            this.props.description = "Failed to get server profile information."
            return
        }

        if(GLOBALS?.discord?.invites?.home?.code) {
            url += `https://discord.gg/${GLOBALS.discord.invites.home.code}`
            this.props.description = url
            this.props.description = `***[Join our Discord!](${url} '${url}')***`
        } else {
            this.error = true
            this.props.description = "No invite code found in profile."
            return
        }
    }
}