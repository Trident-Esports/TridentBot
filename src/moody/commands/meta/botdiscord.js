//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const fs = require('fs');

module.exports = class BotDiscordInviteCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "botdiscord",
            category: "meta",
            description: "Bot Discord Invite"
        }
        let props = {
            caption: {
                text: "Bot Discord"
            }
        }
        super(comprops, props)
    }

    async action(client, message) {
        let defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))

        let url = ""
        if(defaults?.discord?.invites?.bot?.code) {
            url += "https://discord.gg/"
            url += defaults.discord.invites.bot.code
            this.props.description = `***[Join VillainsBot's Discord!](${url} '${url}')***`
            // message.channel.send({ content: url })
        } else {
            this.error = true
            this.props.description = "No invite code found in defaults."
        }
    }
}