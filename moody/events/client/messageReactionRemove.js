const { BaseEvent } = require('a-djs-handler')
const fs = require('fs')

module.exports = class MessageReactionRemoveEvent extends BaseEvent {
    constructor() {
        super('messageReactionRemove')
        this.channelName = "rules"
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

    async run(handler, reaction, user) {
        if (reaction.message.partial) await reaction.message.fetch()
        if (reaction.partial) await reaction.fetch()
        if (user.bot) return
        if (!reaction.message.guild) return

        let RULES_ROLE = JSON.parse(fs.readFileSync("./dbs/roles.json","utf8"))["rules"]
        if (RULES_ROLE) {
            RULES_ROLE = reaction.message.guild.roles.cache.find(role => role.name === RULES_ROLE)
            if (RULES_ROLE) {
                let RULES_EMOJI = "✅"
                let RULES_CHANNEL = await this.getChannel(reaction.message, "rules")

                if (RULES_CHANNEL) {
                    if (reaction.message.channel.id == RULES_CHANNEL) {
                        if (reaction.emoji.name === RULES_EMOJI) {
                            await reaction.message.guild.members.cache.get(user.id).roles.remove(RULES_ROLE)
                        }
                    }
                }
            }
        }
    }
}
