//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const fs = require('fs');

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
        let GLOBALS = JSON.parse(fs.readFileSync("./PROFILE.json", "utf8"))
        const defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))
        GLOBALS = (
            GLOBALS?.profile &&
            GLOBALS?.profiles &&
            GLOBALS.profile in GLOBALS.profiles
        ) ?
            GLOBALS.profiles[GLOBALS.profile]:
            defaults
        let url = ""
        if(GLOBALS?.discord?.invites?.home?.code) {
            url += "https://discord.gg/"
            url += GLOBALS.discord.invites.home.code
            this.props.description = url
            this.props.description = `***[Join our Discord!](${url} '${url}')***`
            // message.channel.send({ content: url })
        } else {
            this.error = true
            this.props.description = "No invite code found in profile."
        }
    }
}
