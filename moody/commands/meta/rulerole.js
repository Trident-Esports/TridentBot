const VillainsCommand = require('../../classes/vcommand.class')
const VillainsEmbed = require('../../classes/vembed.class')
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
    }

    async action(client, message) {
        let RULES_EMOJI = "✅"
        let RULES_CHANNEL = JSON.parse(fs.readFileSync("./dbs/channels.json"))[message.guild.id]["rules"]
        RULES_CHANNEL = message.guild.channels.cache.find(channel => channel.name === RULES_CHANNEL)
        this.channel = RULES_CHANNEL

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
