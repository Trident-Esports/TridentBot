/*

BaseCommand
 VillainsCommand
  QuestionnaireCommand

*/

const VillainsCommand = require('./vcommand.class');
const VillainsEmbed = require('./vembed.class');
const fs = require('fs');

module.exports = class QuestionnaireCommand extends VillainsCommand {
    /*

    constructor(comprops = {}, props = {})
    run()
     build()
      action()
     send()

    */
    #emoji; // Private: Emojis to use
    constructor(comprops = {}) {
        // Create a parent object
        super(comprops)

        this.emoji = comprops?.emoji ? comprops.emoji : [ "👍", "👎" ];
        this.channelName = comprops?.channelName ? comprops.channelName : "suggestions"
    }

    get emoji() {
        return this.#emoji;
    }
    set emoji(emoji) {
        this.#emoji = emoji
    }

    async build(client, message) {
        // Delete user-sent message
        message.delete()

        if (this.inputData.args.length <= 0 || this.inputData.args[0].trim() == "") {
            this.error = true
            this.props.description = "No topic sent!"
        } else {
            this.props.description = this.inputData.args.join(" ")
        }

        if (!(this.error)) {
            let channelIDs = JSON.parse(fs.readFileSync("./dbs/channels.json","utf8"))
            if (message.guild.id in Object.keys(channelIDs)) {
                if (this.channelName in Object.keys(channelIDs[message.guild.id])) {
                    this.channelName = channelIDs[message.guild.id][this.channelName]
                }
            }
            const channel = message.guild.channels.cache.find(c => c.name === this.channelName);

            if (!channel) {
                this.error = true
                this.props.description = this.props.caption.text + " channel doesn't exist!"
            } else {
                this.channel = channel
            }
        }

        if(!(this.error)) {
            this.action(client, message)
        }
    }

    async action(client, message) {
        let embed = new VillainsEmbed(this.props)

        if(!(this.error)) {
            this.null = true
            await this.send(message, embed).then(async (msg) => {
                for (let emoji of this.emoji) {
                    await msg.react(emoji)
                }
            })
        }
    }
}
