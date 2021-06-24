const { BaseCommand } = require('a-djs-handler');
const VillainsEmbed = require('../classes/vembed.class');

const fs = require('fs');
let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))

module.exports = class DiscordInviteCommand extends BaseCommand {
    constructor() {
        super({
            name: "discord",
            category: "meta",
            description: "Discord Invite"
        })
    }

    async run(client, message, args) {
        let props = {
            title: { text: "Join our Discord!" }
        }
        let url = ""
        if(GLOBALS?.discord?.invites?.home?.code) {
            url += "https://discord.gg/"
            url += GLOBALS.discord.invites.home.code
            props.title.url = url
            props.description = url
        } else {
            props.title.text = "Error"
            props.description = "No invite code found in profile."
        }
        let embed = new VillainsEmbed(props)
        await message.channel.send({embed: embed, content: url})
    }
}
