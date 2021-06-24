const { BaseCommand } = require('a-djs-handler');
const VillainsEmbed = require('../classes/vembed.class');

const fs = require('fs');
let defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))

module.exports = class BotInviteCommand extends BaseCommand {
    constructor() {
        super({
            name: "botinvite",
            category: "meta",
            description: "Bot Invite"
        })
    }

    async run(client, message, args) {
        let props = {
            title: { text: "Invite @VillainsBot to your Discord!" }
        }
        let url = ""
        if(
          defaults?.bot?.clientID &&
          defaults?.bot?.scope &&
          defaults?.bot?.permissions
        ) {
            url += "https://discord.com/oauth2/authorize"
            url += "?client_id=" + defaults.bot.clientID
            url += "&scope=" + defaults.bot.scope
            url += "&permissions=" + defaults.bot.permissions
            props.title.url = url
        } else {
            props.title.text = "Error"
            props.description = "No invite link found in defaults."
        }
        let embed = new VillainsEmbed(props)
        await message.channel.send(embed)
    }
}
