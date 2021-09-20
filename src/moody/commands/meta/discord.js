//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const fs = require('fs');
let GLOBALS = null
try {
    GLOBALS = JSON.parse(fs.readFileSync("./src/PROFILE.json", "utf8"))
} catch(err) {
    console.log("Discord Invite: PROFILE manifest not found!")
    process.exit(1)
}

module.exports = class DiscordInviteCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "discord",
            group: "meta",
            memberName: "discord",
            description: "Discord Invite"
        }
        let props = {
            caption: {
                text: "Community Discord"
            }
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async action(message) {
        let GLOBALS = JSON.parse(fs.readFileSync("./src/PROFILE.json", "utf8"))
        const defaults = JSON.parse(fs.readFileSync("./src/dbs/defaults.json", "utf8"))
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

    async test(message) {
        let dummy = null
        dummy = new DiscordInviteCommand()
        dummy.run(client, message, [], null, "")
    }
}
