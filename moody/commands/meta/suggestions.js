const VillainsCommand = require('../../classes/vcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let DEV = GLOBALS.DEV;

// Suggestions/Survey
//FIXME: Make inheritable?
module.exports = class SuggestionsCommand extends VillainsCommand {
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
            "yes": "👍",
            "no": "👎"
        }
        let channelName = DEV ? "suggestions" : "❓suggestions❓"
        const channel = message.guild.channels.cache.find(c => c.name === channelName);
        if(!channel) {
            props.description = "Suggestions channel doesn't exist!"
        } else {
            props.author = {
                name: message.author.tag,
                avatar: message.author.displayAvatarURL({ dynamic: true })
            }
            props.description = args.join(" ")
        }
        let embed = new VillainsEmbed(props)
        if(!channel) {
            await super.send(message, embed)
        } else {
            channel.send(embed)
                .then((msg) => {
                    msg.react(emoji.yes)
                    msg.react(emoji.no)
                })
        }
    }
}
