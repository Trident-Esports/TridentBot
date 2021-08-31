//@ts-check

const VillainsEvent = require('../../classes/event/vevent.class')
const fs = require('fs')

module.exports = class MessageReactionRemoveEvent extends VillainsEvent {
    constructor() {
        super('messageReactionRemove')
        this.channelName = "rules"
    }

    async run(handler, reaction, user) {
        if (reaction.message.partial) await reaction.message.fetch()
        if (reaction.partial) await reaction.fetch()
        if (user.bot) return
        if (!reaction.message.guild) return

        let RULES_ROLE = JSON.parse(fs.readFileSync("./dbs/" + reaction.message.guild.id + "/roles.json","utf8"))["rules"]
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
