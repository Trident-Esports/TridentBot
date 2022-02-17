//@ts-check

const VillainsEvent = require('./vevent.class')
const AsciiTable = require('ascii-table')
const fs = require('fs')

module.exports = class MessageReactionEvent extends VillainsEvent {
    constructor(eventName) {
        super(eventName)
        this.channelName = "rules"
    }

    async run(client, reaction, user) {
        if (reaction.message.partial) await reaction.message.fetch()
        if (reaction.partial) await reaction.fetch()
        if (user.bot) return
        if (!reaction.message.guild) return

        if (!(fs.existsSync("./src/dbs/" + reaction.message.guild.id))) {
            let msg = "Message Reaction " + (this.name.includes("Add") ? "Add" : "Remove")
            const Table = new AsciiTable("", {})
                .addRow(
                    msg,
                    `Guild Profile for '${reaction.message.guild.name}' (ID:${reaction.message.guild.id}) not found!`
            )
            console.log(Table.toString())
            return
        }

        let RULES_EMOJI = "✅"
        let RULES_CHANNEL = await this.getChannel(reaction.message, "rules")

        if (!(RULES_CHANNEL)) {
          let msg = "Message Reaction " + (this.name.includes("Add") ? "Add" : "Remove")
          const Table = new AsciiTable("", {})
                .addRow(
                    msg,
                    `Guild ID Rules Channel for '${reaction.message.guild.name}' (ID:${reaction.message.guild.id}) not found!`
            )
            console.log(Table.toString())
            return
        }

        if (reaction.message.channel.id == RULES_CHANNEL.id) {
            if (reaction.emoji.name === RULES_EMOJI) {
                let RULES_ROLE = JSON.parse(fs.readFileSync(`./src/dbs/${reaction.message.guild.id}/roles.json`,"utf8"))["rules"]

                if (!(RULES_ROLE)) {
                    let msg = "Message Reaction " + (this.name.includes("Add") ? "Add" : "Remove")
                    const Table = new AsciiTable("", {})
                        .addRow(
                            msg,
                            `Guild ID Roles for '${reaction.message.guild.name}' (ID:${reaction.message.guild.id}) not found!`
                    )
                    console.log(Table.toString())
                    return
                }

                RULES_ROLE = await reaction.message.guild.roles.cache.find(role => role.name === RULES_ROLE)
                if (!(RULES_ROLE)) {
                    let msg = "Message Reaction " + (this.name.includes("Add") ? "Add" : "Remove")
                    const Table = new AsciiTable("", {})
                        .addRow(
                            msg,
                            `Guild Rules Role for '${reaction.message.guild.name}' (ID:${reaction.message.guild.id}) not found!`
                    )
                    console.log(Table.toString())
                    return
                }

                let member = null
                try {
                    member = await reaction.message.guild.members.find(user.id)
                } catch (err) {
                    let msg = "Message Reaction " + (this.name.includes("Add") ? "Add" : "Remove")
                    const Table = new AsciiTable("", {})
                        .addRow(
                            msg,
                            `User: '${user.username}#${user.discriminator}' (ID:${user.id}) not found!`
                    )
                    console.log(Table.toString())
                    console.log(err)
                    return
                }
                try {
                    if (this.name.includes("Add")) {
                        member.roles.add(RULES_ROLE)
                    } else if (this.name.includes("Remove")) {
                        member.roles.remove(RULES_ROLE)
                    }
                } catch (err) {
                    let msg = "Message Reaction " + (this.name.includes("Add") ? "Add" : "Remove")
                    const Table = new AsciiTable("", {})
                        .addRow(
                            msg,
                            `Failed to add Role to User: '${user.username}#${user.discriminator}' (ID:${user.id})!`
                    )
                    console.log(Table.toString())
                    console.log(err)
                    return
                }
            } else {
                let msg = "Message Reaction " + (this.name.includes("Add") ? "Add" : "Remove")
                const Table = new AsciiTable("", {})
                    .addRow(
                        msg,
                        `Guild ID Rules Channel: ${reaction.emoji.name}' != ${RULES_EMOJI}`
                )
                console.log(Table.toString())
            }
        } else if (
            reaction.message.channel.name.includes("test") &&
            user.tag &&
            (!(["◀️","▶️"].includes(reaction.emoji.name)))
        ) {
            let msg = "Message Reaction " + (this.name.includes("Add") ? "Add" : "Remove")
            if (this.name.includes("Add")) {
                msg = `🟢${msg}🟢`
            } else {
                msg = `🔴${msg}🔴`
            }
            const Table = new AsciiTable(
                    msg,
                    {}
                )
                .addRow(`Guild`, `${reaction.message.guild.name}`)
                .addRow(`Channel`, `#${reaction.message.channel.name}`)
                .addRow(`Message`, `${reaction.message.id}`)
                .addRow(`User`, user.tag)
                .addRow(`Emoji`, reaction.emoji)
            console.log(Table.toString())
        }
    }
}
