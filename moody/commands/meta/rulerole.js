const VillainsCommand = require('../../classes/command/vcommand.class')
const VillainsEmbed = require('../../classes/embed/vembed.class')
const fs = require('fs')

// Works with Events: messageReactionAdd & messageReactionRemove

module.exports = class RulesRoleCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "rulesrole",
            aliases: [ "rulerole", "rr" ],
            category: "meta",
            description: "Rules Role"
        }
        let props = {
            caption: {
                text: "Accepting Values"
            }
        }
        super(comprops, props)
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

    async action(client, message) {
        let RULES_EMOJI = "✅"
        this.channel = await this.getChannel(message, "rules")

        this.props.caption = { text: "Accepting Values" }

        this.props.description = [
            `Accepting the values will allow you to interact with the server.`,
            "",
            "By selecting the reaction below, you are agreeing to Villains Values and will be punished according to how severely the values are broken."
        ]

        this.null = true
        await this.send(message, new VillainsEmbed(this.props)).then(async (msg) => {
            await msg.react(RULES_EMOJI)
            try {
                if (!(message.deleted)) {
                    await message.delete()
                }
            } catch (e) {
                // do nothing
            }
        })
    }
}
