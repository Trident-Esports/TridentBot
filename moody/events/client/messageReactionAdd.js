const { BaseEvent } = require('a-djs-handler')
const fs = require('fs')

module.exports = class MessageReactionAddEvent extends BaseEvent {
    constructor() {
        super('messageReactionAdd')
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
                let RULES_CHANNEL = JSON.parse(fs.readFileSync("./dbs/channels.json"))[reaction.message.guild.id]["rules"]

                if (RULES_CHANNEL) {
                    if (reaction.message.channel.id == RULES_CHANNEL) {
                        if (reaction.emoji.name === RULES_EMOJI) {
                            await reaction.message.guild.members.cache.get(user.id).roles.add(RULES_ROLE)
                        }
                    }
                }
            }
        }
    }
}
