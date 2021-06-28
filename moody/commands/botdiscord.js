const VillainsCommand = require('../classes/vcommand.class');
const VillainsEmbed = require('../classes/vembed.class');

const fs = require('fs');
let defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))

module.exports = class BotDiscordInviteCommand extends VillainsCommand {
    constructor() {
        super({
            name: "botdiscord",
            category: "meta",
            description: "Bot Discord Invite"
        })
    }

    async run(client, message, args) {
        let props = {
            title: { text: "Join VillainsBot's Discord!" }
        }
        let url = ""
        if(defaults?.discord?.invites?.bot?.code) {
            url += "https://discord.gg/"
            url += defaults.discord.invites.bot.code
            props.title.url = url
            props.description = url
        } else {
            props.title.text = "Error"
            props.description = "No invite code found in defaults."
        }
        let embed = new VillainsEmbed(props)
        await super.send(message, {embed: embed, content: url})
    }
}
