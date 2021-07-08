const VillainsCommand = require('../../classes/vcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

// Suggestions/Survey
//FIXME: Make inheritable?
module.exports = class SurveyCommand extends VillainsCommand {
    constructor() {
        super({
            name: "survey",
            category: "meta",
            description: "Survey"
        })
    }

    async run(client, message, args) {
        let props = {
            title: { text: "Survey" }
        }
        let emoji = {
            "yes": "✅",
            "no": "❌"
        }
        let channelName = "survey"
        const channel = message.guild.channels.cache.find(c => c.name === channelName);
        if(!channel) {
            props.description = "Survey channel doesn't exist!"
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
