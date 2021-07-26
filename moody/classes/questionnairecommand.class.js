/*

Command for getting reaction votes for a question/suggestion/survey

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
    #emoji;       // Private: Emojis to use
    #channelName; // Private: Channel name to send message to
    constructor(comprops = {}) {
        // Create a parent object
        super(
            {...comprops}
        )

        this.emoji = comprops?.emoji ? comprops.emoji : [ "👍", "👎" ];
        this.channelName = comprops?.channelName ? comprops.channelName : "suggestions"
    }

    get emoji() {
        return this.#emoji;
    }
    set emoji(emoji) {
        this.#emoji = emoji
    }

    get channelName() {
        return this.#channelName;
    }
    set channelName(channelName) {
        this.#channelName = channelName
    }

    async getChannel(message, channelType) {
        // Get botdev-defined list of channelIDs/channelNames
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

        // Bail if no topic sent
        // Need a topic to build Questionnaire for
        if (this.inputData.args.length <= 0 || this.inputData.args[0].trim() == "") {
            this.error = true
            this.props.description = "No topic sent!"
            return
        } else {
            this.props.description = this.inputData.args.join(" ")
        }

        // Get channel object to send message to
        this.channel = await this.getChannel(message, this.channelName)

        // Bail if we couldn't get a channel object
        if (!this.channel) {
            this.error = true
            this.props.description = this.props.caption.text + " channel doesn't exist!"
            return
        }

        this.action(client, message)
    }

    async action(client, message) {
        this.null = true
        //TODO: Add a .then() to VillainsCommand's run()
        await this.send(message, new VillainsEmbed(this.props)).then(async (msg) => {
            for (let emoji of this.emoji) {
                await msg.react(emoji)
            }
        })
    }
}
