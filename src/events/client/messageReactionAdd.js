//@ts-check

const VillainsEvent = require('../../classes/event/vevent.class')
const AsciiTable = require('ascii-table')
const fs = require('fs')

module.exports = class MessageReactionAddEvent extends VillainsEvent {
    // messageReactionAdd
    constructor(context) {
        super(context)
        this.channelName = "rules"
    }

    async run(client, reaction, user) {
        if (reaction.message.partial) await reaction.message.fetch()
        if (reaction.partial) await reaction.fetch()
        if (user.bot) return
        if (!reaction.message.guild) return

        if (!(fs.existsSync("./src/dbs/" + reaction.message.guild.id))) {
            const Table = new AsciiTable("", {})
                .addRow(
                    `Message Reaction Add`,
                    `Guild Profile for '${reaction.message.guild.name}' (ID:${reaction.message.guild.id}) not found!`
            )
            console.log(Table.toString())
            return
        }

        let RULES_EMOJI = "✅"
        let RULES_CHANNEL = await this.getChannel(reaction.message, "rules")

        if (!(RULES_CHANNEL)) {
            const Table = new AsciiTable("", {})
                .addRow(
                    `Message Reaction Add`,
                    `Guild ID Rules Channel for '${reaction.message.guild.name}' (ID:${reaction.message.guild.id}) not found!`
            )
            console.log(Table.toString())
            return
        }

        if (reaction.message.channel.id == RULES_CHANNEL.id) {
            if (reaction.emoji.name === RULES_EMOJI) {
                let RULES_ROLE = JSON.parse(fs.readFileSync(`./src/dbs/${reaction.message.guild.id}/roles.json`,"utf8"))["rules"]

                if (!(RULES_ROLE)) {
                    const Table = new AsciiTable("", {})
                        .addRow(
                            `Message Reaction Add`,
                            `Guild ID Roles for '${reaction.message.guild.name}' (ID:${reaction.message.guild.id}) not found!`
                    )
                    console.log(Table.toString())
                    return
                }

                RULES_ROLE = await reaction.message.guild.roles.cache.find(role => role.name === RULES_ROLE)
                if (!(RULES_ROLE)) {
                    const Table = new AsciiTable("", {})
                        .addRow(
                            `Message Reaction Add`,
                            `Guild Rules Role for '${reaction.message.guild.name}' (ID:${reaction.message.guild.id}) not found!`
                    )
                    console.log(Table.toString())
                    return
                }

                let member = null
                try {
                    member = await reaction.message.guild.members.find(user.id)
                } catch (err) {
                    const Table = new AsciiTable("", {})
                        .addRow(
                            `Message Reaction Add`,
                            `User: '${user.username}#${user.discriminator}' (ID:${user.id}) not found!`
                    )
                    console.log(Table.toString())
                    console.log(err)
                    return
                }
                try {
                    member.roles.add(RULES_ROLE)
                } catch (err) {
                    const Table = new AsciiTable("", {})
                        .addRow(
                            `Message Reaction Add`,
                            `Failed to add Role to User: '${user.username}#${user.discriminator}' (ID:${user.id})!`
                    )
                    console.log(Table.toString())
                    console.log(err)
                    return
                }
            } else {
                const Table = new AsciiTable("", {})
                    .addRow(
                        `Message Reaction Add`,
                        `Guild ID Rules Channel: ${reaction.emoji.name}' != ${RULES_EMOJI}`
                )
                console.log(Table.toString())
            }
        } else if (
            reaction.message.channel.name.includes("test") &&
            user.tag &&
            (!(["◀️","▶️"].includes(reaction.emoji)))
        ) {
            const Table = new AsciiTable(
                    `🟢Message Reaction Add🟢`,
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
