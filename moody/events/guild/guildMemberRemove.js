const { BaseEvent } = require('a-djs-handler')
const fs = require('fs')

// Member Join
module.exports = class GuildMemberRemoveEvent extends BaseEvent {
    constructor() {
        super('guildMemberRemove')
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

    async run(handler, member) {
        const channel = await this.getChannel(member, "welcome")

        let consolePad = 20
        console.log("---")
        console.log("<<-MEMBER LEAVE---")
        console.log(
            "Guild:".padEnd(consolePad),
            `${member.guild.name} (ID:${member.guild.id})`
        )
        console.log(
            "Member:".padEnd(consolePad),
            `${member.user.username}#${member.user.discriminator} (ID:${member.user.id})`
        )
        console.log(
            "Leave Channel:".padEnd(consolePad),
            (
              channel
              ?
                `Yes (ID:${channel.id})` :
                "No"
            )
        )

        if (channel) {
            try {
                let rules = [
                    `<@${member.id}> has just become a **Hero**.`
                ]
                await channel.send(rules.join("\n"))
            } catch (err) {
                throw (err);
            }
        }
    }
}
