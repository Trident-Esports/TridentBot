//@ts-check

const VillainsEvent = require('../../classes/event/vevent.class')
const fs = require('fs')

module.exports = class MessageReactionRemoveEvent extends VillainsEvent {
    constructor() {
        super('messageReactionRemove')
        this.channelName = "rules"
    }

    async run(client, reaction, user) {
        if (reaction.message.partial) await reaction.message.fetch()
        if (reaction.partial) await reaction.fetch()
        if (user.bot) return
        if (!reaction.message.guild) return

        if (!(fs.existsSync("./src/dbs/" + reaction.message.guild.id))) {
            console.log("Message Reaction Remove: Guild ID Profiles:",reaction.message.guild.id,"not found!")
            return
        }

        let RULES_EMOJI = "✅"
        let RULES_CHANNEL = await this.getChannel(reaction.message, "rules")

        if (!(RULES_CHANNEL)) {
            console.log("Message Reaction Remove: Guild ID Rules Channel:",reaction.message.guild.id,"not found!")
            return
        }

        if (reaction.message.channel.id == RULES_CHANNEL.id) {
            if (reaction.emoji.name === RULES_EMOJI) {
                let RULES_ROLE = JSON.parse(fs.readFileSync("./src/dbs/" + reaction.message.guild.id + "/roles.json","utf8"))["rules"]

                if (!(RULES_ROLE)) {
                    console.log("Message Reaction Remove: Guild ID Roles:",reaction.message.guild.id,"not found!")
                    return
                }

                RULES_ROLE = reaction.message.guild.roles.cache.find(role => role.name === RULES_ROLE)
                if (!(RULES_ROLE)) {
                    console.log("Message Reaction Remove: Guild Rules Role:",reaction.message.guild.id,"not found!")
                    return
                }

                let member = null
                try {
                    member = await reaction.message.guild.members.cache.get(user.id)
                } catch (err) {
                    console.log(`Message Reaction Remove: User: '${user.username}#${user.discriminator}' [ID:${user.id}] not found!`)
                    console.log(err)
                    return
                }
                try {
                    member.roles.remove(RULES_ROLE)
                } catch (err) {
                    console.log(`Message Reaction Remove: Failed to remove Role from User: '${user.username}#${user.discriminator}' [ID:${user.id}!`)
                    console.log(err)
                    return
                }
            } else {
                console.log("Message Reaction Remove: Guild ID Rules Channel:",reaction.emoji.name,"!=",RULES_EMOJI)
            }
        }
    }
}
