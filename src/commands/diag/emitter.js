//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class EmitterCommand extends VillainsCommand {
    constructor(context) {
        let comprops = {
            name: "emitter",
            category: "diagnostic",
            description: "Emit an Event"
        }
        let props = {
        }
        super(
            context,
            {...comprops},
            {...props}
        )
    }

    async action(message, args) {
        const client = message. client
        const event = this.inputData.args[0]
        const member = await message.guild.members.fetch(message.author.id)

        switch(event) {
            case "guildMemberAdd":
            case "guildMemberRemove":
                await client.emit(event, member)
                break
            case "message":
            case "messageCreate":
                await client.emit(event, message)
                break
            case "messageReactionAdd":
            case "messageReactionRemove": {
                let emojis = [
                        "❤️",
                        "🧡",
                        "💛",
                        "💚",
                        "💙",
                        "💜"
                ]
                if (event.includes("Remove")) {
                    emojis = [ emojis[0] ]
                }
                for (let emoji of emojis) {
                    await message.react(emoji)
                }
                await client.emit(event, await message.reactions.cache.first(), member)
                break
            }
            default:
                await client.emit(event)
                break
        }

        this.null = true
    }
}
