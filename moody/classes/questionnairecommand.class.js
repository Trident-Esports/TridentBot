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

    async getChannel(message, channelType) {
        let channelIDs = JSON.parse(fs.readFileSync("./dbs/channels.json","utf8"))
        let channelID = 0
        let channel = null

        // Get channel IDs for this guild
        if (Object.keys(channelIDs).includes(message.guild.id)) {
            // If the channel type exists
            if (Object.keys(channelIDs[message.guild.id]).includes(channelType)) {
                // Get the ID
                channelID = channelIDs[message.guild.id][channelType]
            }
        }

        // If the ID is not a number, search for a named channel
        if (isNaN(channelID)) {
            channel = message.guild.channels.cache.find(c => c.name === channelID);
        } else {
            // Else, search for a numbered channel
            channel = message.guild.channels.cache.find(c => c.id === channelID);
        }

        return channel
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
            this.channel = await this.getChannel(message, this.channelName)

            if (!this.channel) {
                this.error = true
                this.props.description = this.props.caption.text + " channel doesn't exist!"
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
