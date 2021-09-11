//@ts-check

const VillainsEvent = require('../../classes/event/vevent.class')
const fs = require('fs')

module.exports = class MessageReactionAddEvent extends VillainsEvent {
    constructor() {
        super('messageReactionAdd')
        this.channelName = "rules"
    }

    async run(handler, reaction, user) {
        if (reaction.message.partial) await reaction.message.fetch()
        if (reaction.partial) await reaction.fetch()
        if (user.bot) return
        if (!reaction.message.guild) return

        if (!(fs.existsSync("./src/dbs/" + reaction.message.guild.id))) {
            console.log("Message Reaction Add: Guild ID Profiles:",reaction.message.guild.id,"not found!")
            return
        }

        let RULES_ROLE = JSON.parse(fs.readFileSync("./src/dbs/" + reaction.message.guild.id + "/roles.json","utf8"))["rules"]

        if (!(RULES_ROLE)) {
            console.log("Message Reaction Add: Guild ID Roles:",reaction.message.guild.id,"not found!")
            return
        }

        RULES_ROLE = reaction.message.guild.roles.cache.find(role => role.name === RULES_ROLE)
        if (!(RULES_ROLE)) {
            console.log("Message Reaction Add: Guild Rules Role:",reaction.message.guild.id,"not found!")
            return
        }

        let RULES_EMOJI = "✅"
        let RULES_CHANNEL = await this.getChannel(reaction.message, "rules")

        if (!(RULES_CHANNEL)) {
            console.log("Message Reaction Add: Guild ID Rules Channel:",reaction.message.guild.id,"not found!")
            return
        }

        if (reaction.message.channel.id == RULES_CHANNEL.id) {
            if (reaction.emoji.name === RULES_EMOJI) {
                await reaction.message.guild.members.cache.get(user.id).roles.add(RULES_ROLE)
            } else {
                console.log("Message Reaction Add: Guild ID Rules Channel:",reaction.emoji.name,"!=",RULES_EMOJI)
            }
        }
    }
}
