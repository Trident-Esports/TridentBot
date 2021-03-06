//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const fs = require('fs');
let GLOBALS = null
try {
    if (fs.existsSync("./src/PROFILE.json")) {
        GLOBALS = JSON.parse(fs.readFileSync("./src/PROFILE.json", "utf8"))
    } else {
        console.log("🟡Discord Invite: PROFILE manifest not found! Ignoring command!")
    }
} catch(err) {
    console.log("🔴Discord Invite: PROFILE manifest not found!")
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
        let GLOBALS = null
        const defaults = JSON.parse(fs.readFileSync("./src/dbs/defaults.json", "utf8"))
        if (fs.existsSync("./src/PROFILE.json")) {
            GLOBALS = JSON.parse(fs.readFileSync("./src/PROFILE.json", "utf8"))
        } else {
            console.log("🟡Discord Invite: PROFILE manifest not found! Ignoring command!")
            return
        }
        GLOBALS = (
            GLOBALS?.profile &&
            GLOBALS?.profiles &&
            GLOBALS.profile in GLOBALS.profiles
        ) ?
            GLOBALS.profiles[GLOBALS.profile]:
            defaults
        let url = ""

        if (!GLOBALS) {
            this.error = true
            this.props.description = "Failed to get server profile information."
            return
        }

        if(GLOBALS?.discord?.invites?.home?.code) {
            url += `https://discord.gg/${GLOBALS.discord.invites.home.code}`
            this.props.description = url
            this.props.description = `***[Join our Discord!](${url} '${url}')***`
            // message.channel.send({ content: url })
        } else {
            this.error = true
            this.props.description = "No invite code found in profile."
            return
        }
    }

    async test(client, message) {
        let dummy = null
        dummy = new DiscordInviteCommand()
        dummy.run(client, message, [], null, "")
    }
}
