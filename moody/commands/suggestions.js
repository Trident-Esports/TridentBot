const { BaseCommand } = require('a-djs-handler');
const VillainsEmbed = require('../classes/vembed.class');

const fs = require('fs');

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = class SuggestionsCommand extends BaseCommand {
    constructor() {
        super({
            name: "suggestions",
            aliases: [ "suggest", "suggestion" ],
            category: "meta",
            description: "Suggestions"
        })
    }

    async run(client, message, args) {
        let props = {
            title: { text: "Suggestions" }
        }
        let emoji = {
            "thumbsup": "👍",
            "thumbsdown": "👎"
        }
        let channelName = DEV ? "suggestions" : "❓suggestions❓"
        const channel = message.guild.channels.cache.find(c => c.name === channelName);
        if(!channel) {
            props.description = "Suggestions channel doesn't exist!"
        } else {
            props.author = {
                text: message.author.tag,
                avatar: message.author.displayAvatarURL({ dynamic: true })
            }
            props.description = args.join(" ")
        }
        let embed = new VillainsEmbed(props)
        if(!channel) {
            await message.channel.send(embed)
        } else {
            channel.send(embed)
                .then((msg) => {
                    msg.react(emoji.thumbsup)
                    msg.react(emoji.thumbsdown)
                    message.delete()
                })
        }
    }
}
