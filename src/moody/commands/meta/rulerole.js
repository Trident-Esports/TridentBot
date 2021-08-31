const VillainsCommand = require('../../classes/command/vcommand.class')
const VillainsEmbed = require('../../classes/embed/vembed.class')

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
        super(
            {...comprops},
            {...props}
        )
        this.channelName = "rules"
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

        // We'll handle sending it
        // SELFHANDLE: .then()
        this.null = true
        await this.send(message, new VillainsEmbed({...this.props})).then(async (msg) => {
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
